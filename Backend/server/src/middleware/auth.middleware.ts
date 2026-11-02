import { verifyToken } from "@clerk/backend";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Locals {
      clerkUserId?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    res.status(503).json({
      success: false,
      message: "Authentication is not configured on the server.",
    });
    return;
  }

  const authorization = req.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "A valid bearer token is required.",
    });
    return;
  }

  try {
    const configuredParties = [
      process.env.FRONTEND_URL,
      process.env.CLERK_AUTHORIZED_PARTIES,
    ]
      .filter(Boolean)
      .join(",");
    const authorizedParties = configuredParties
      .split(",")
      .map((origin) => {
        const value = origin.trim();
        return value ? new URL(value).origin : "";
      })
      .filter(Boolean);

    const claims = await verifyToken(token, {
      secretKey,
      ...(authorizedParties.length > 0 ? { authorizedParties } : {}),
    });

    if (!claims.sub) {
      res.status(401).json({
        success: false,
        message: "The authentication token has no user identity.",
      });
      return;
    }

    res.locals.clerkUserId = claims.sub;
    next();
  } catch (error) {
    console.error(
      "Clerk session verification failed:",
      error instanceof Error
        ? { name: error.name, message: error.message }
        : "Unknown verification error",
    );
    res.status(401).json({
      success: false,
      message:
        "Clerk could not verify this session. Check that the backend secret key matches the frontend Clerk instance and that CLERK_AUTHORIZED_PARTIES contains the frontend origin.",
    });
  }
}
