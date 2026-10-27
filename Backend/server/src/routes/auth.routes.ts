import { createClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();

const registerSchema = z
  .object({
    role: z.enum(["issuer", "holder", "verifier"]),
    institutionName: z.string().trim().min(1).max(255).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.role === "issuer"
        ? Boolean(value.institutionName)
        : !value.institutionName,
    {
      message: "Issuer accounts require an institution name; other roles cannot set one.",
      path: ["institutionName"],
    },
  );
const activationSchema = z.object({ isActive: z.boolean() }).strict();

function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not configured.");
  }
  return createClerkClient({ secretKey });
}

router.post("/register", authMiddleware, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Registration details are invalid.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const clerkUserId = res.locals.clerkUserId;
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const clerkUser = await getClerkClient().users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId,
    );

    if (!primaryEmail?.emailAddress) {
      res.status(400).json({
        success: false,
        message: "A primary email address is required to complete registration.",
      });
      return;
    }

    if (primaryEmail.verification?.status !== "verified") {
      res.status(403).json({
        success: false,
        message: "Verify your email address before completing registration.",
      });
      return;
    }

    const firstName = clerkUser.firstName?.trim();
    const lastName = clerkUser.lastName?.trim();
    if (!firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: "First and last name are required to complete registration.",
      });
      return;
    }

    const inserted = await db
      .insert(users)
      .values({
        clerkId: clerkUserId,
        email: primaryEmail.emailAddress.toLowerCase(),
        firstName,
        lastName,
        role: parsed.data.role,
        institutionName: parsed.data.institutionName ?? null,
        isActive: parsed.data.role !== "issuer",
      })
      .onConflictDoNothing()
      .returning({ id: users.id });

    const [user] = await db
      .select({
        id: users.id,
        clerkId: users.clerkId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        institutionName: users.institutionName,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (!user) {
      res.status(409).json({
        success: false,
        message: "This account cannot be registered with the supplied details.",
      });
      return;
    }

    if (
      user.role !== parsed.data.role ||
      (user.role === "issuer" &&
        user.institutionName !== parsed.data.institutionName)
    ) {
      res.status(409).json({
        success: false,
        message: "This Clerk account already has a different CertifyVault profile.",
      });
      return;
    }

    res.status(inserted.length > 0 ? 201 : 200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("User registration failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to complete registration.",
    });
  }
});

router.get("/me", authMiddleware, async (_req, res) => {
  const clerkUserId = res.locals.clerkUserId;
  if (!clerkUserId) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        clerkId: users.clerkId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        institutionName: users.institutionName,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No active CertifyVault profile is linked to this account.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact an administrator for activation.",
      });
      return;
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("User profile lookup failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load your account profile.",
    });
  }
});

router.patch(
  "/users/:clerkId/activation",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    const parsed = activationSchema.safeParse(req.body);
    const clerkId = z.string().min(8).max(255).safeParse(req.params.clerkId);
    if (!parsed.success || !clerkId.success) {
      res.status(400).json({
        success: false,
        message: "Activation request is invalid.",
      });
      return;
    }

    try {
      const [user] = await db
        .update(users)
        .set({ isActive: parsed.data.isActive, updatedAt: new Date() })
        .where(eq(users.clerkId, clerkId.data))
        .returning({
          id: users.id,
          clerkId: users.clerkId,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
        });

      if (!user) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      res.json({ success: true, data: { user } });
    } catch (error) {
      console.error("User activation update failed:", error);
      res.status(500).json({
        success: false,
        message: "Unable to update account activation.",
      });
    }
  },
);

export default router;
