import { createClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import express, { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();
const profileSchema = z
  .object({
    fullName: z.string().trim().min(3).max(200).refine(
      (name) => name.split(/\s+/).filter(Boolean).length >= 2,
      "Enter both a first and last name.",
    ),
  })
  .strict();

const avatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const avatarBodyParser = express.raw({
  type: [...avatarTypes],
  limit: "4mb",
});

function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not configured.");
  }
  return createClerkClient({ secretKey });
}

function getClerkUserId(res: import("express").Response): string | null {
  return res.locals.clerkUserId ?? null;
}

function matchesImageType(contentType: string, image: Buffer): boolean {
  if (contentType === "image/jpeg") {
    return image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  }
  if (contentType === "image/png") {
    return (
      image.length >= 8 &&
      image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }
  return (
    contentType === "image/webp" &&
    image.length >= 12 &&
    image.toString("ascii", 0, 4) === "RIFF" &&
    image.toString("ascii", 8, 12) === "WEBP"
  );
}

router.use(authMiddleware, requireRole("admin"));

router.get("/", async (_req, res) => {
  const clerkUserId = getClerkUserId(res);
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const [[user], clerkUser] = await Promise.all([
      db
        .select({
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          avatarData: users.avatarData,
        })
        .from(users)
        .where(eq(users.clerkId, clerkUserId))
        .limit(1),
      getClerkClient().users.getUser(clerkUserId),
    ]);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No administrator profile is linked to this account.",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        profile: {
          ...user,
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          twoFactorEnabled: clerkUser.twoFactorEnabled,
        },
      },
    });
  } catch (error) {
    console.error("Admin settings lookup failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load account settings.",
    });
  }
});

router.patch("/profile", async (req, res) => {
  const clerkUserId = getClerkUserId(res);
  const parsed = profileSchema.safeParse(req.body);
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Enter a valid first and last name.",
    });
    return;
  }

  const nameParts = parsed.data.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastNameParts = nameParts.slice(1);
  const lastName = lastNameParts.join(" ");

  try {
    const clerkUser = await getClerkClient().users.updateUser(clerkUserId, {
      firstName,
      lastName,
    });
    const [user] = await db
      .update(users)
      .set({ firstName, lastName, updatedAt: new Date() })
      .where(eq(users.clerkId, clerkUserId))
      .returning({
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        avatarData: users.avatarData,
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No administrator profile is linked to this account.",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        profile: {
          ...user,
          fullName: `${firstName} ${lastName}`,
          twoFactorEnabled: clerkUser.twoFactorEnabled,
        },
      },
    });
  } catch (error) {
    console.error("Admin profile update failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update your profile.",
    });
  }
});

router.put("/avatar", avatarBodyParser, async (req, res) => {
  const clerkUserId = getClerkUserId(res);
  const contentType = req.header("content-type")?.toLowerCase();
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }
  if (!contentType || !avatarTypes.has(contentType) || !Buffer.isBuffer(req.body)) {
    res.status(400).json({
      success: false,
      message: "Upload a JPG, PNG, or WEBP image.",
    });
    return;
  }
  if (req.body.length === 0) {
    res.status(400).json({ success: false, message: "The image is empty." });
    return;
  }
  if (!matchesImageType(contentType, req.body)) {
    res.status(400).json({
      success: false,
      message: "The image content does not match its file type.",
    });
    return;
  }

  const avatarData = `data:${contentType};base64,${req.body.toString("base64")}`;
  try {
    const [user] = await db
      .update(users)
      .set({ avatarData, updatedAt: new Date() })
      .where(eq(users.clerkId, clerkUserId))
      .returning({ avatarData: users.avatarData });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No administrator profile is linked to this account.",
      });
      return;
    }

    res.json({ success: true, data: { avatarData: user.avatarData } });
  } catch (error) {
    console.error("Admin avatar update failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to save your profile photo.",
    });
  }
});

router.delete("/avatar", async (_req, res) => {
  const clerkUserId = getClerkUserId(res);
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const [user] = await db
      .update(users)
      .set({ avatarData: null, updatedAt: new Date() })
      .where(eq(users.clerkId, clerkUserId))
      .returning({ clerkId: users.clerkId });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No administrator profile is linked to this account.",
      });
      return;
    }

    res.json({ success: true, data: { avatarData: null } });
  } catch (error) {
    console.error("Admin avatar removal failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to remove your profile photo.",
    });
  }
});

router.post("/sessions/revoke-all", async (_req, res) => {
  const clerkUserId = getClerkUserId(res);
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const clerk = getClerkClient();
    const sessionPage = await clerk.sessions.getSessionList({
      userId: clerkUserId,
      status: "active",
      limit: 500,
    });
    const sessions = [...sessionPage.data];
    for (let offset = sessions.length; offset < sessionPage.totalCount; offset += 500) {
      const page = await clerk.sessions.getSessionList({
        userId: clerkUserId,
        status: "active",
        limit: 500,
        offset,
      });
      sessions.push(...page.data);
    }
    await Promise.all(
      sessions.map((session) => clerk.sessions.revokeSession(session.id)),
    );

    res.json({
      success: true,
      data: { revokedCount: sessions.length },
    });
  } catch (error) {
    console.error("Admin session revocation failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to end all active sessions.",
    });
  }
});

export default router;
