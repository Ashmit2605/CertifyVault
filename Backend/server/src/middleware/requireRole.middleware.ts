import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

type UserRole = "admin" | "issuer" | "holder" | "verifier";

export function requireRole(...allowedRoles: UserRole[]) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    const clerkUserId = res.locals.clerkUserId;
    if (!clerkUserId) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    try {
      const [user] = await db
        .select({ role: users.role, isActive: users.isActive })
        .from(users)
        .where(eq(users.clerkId, clerkUserId))
        .limit(1);

      if (!user || !user.isActive) {
        res.status(403).json({
          success: false,
          message: "An active CertifyVault profile is required.",
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Role authorization failed:", error);
      res.status(500).json({
        success: false,
        message: "Unable to authorize this request.",
      });
    }
  };
}
