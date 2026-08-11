import type { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // placeholder for auth token verification
  next();
}
