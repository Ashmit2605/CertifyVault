import type { Request, Response } from "express";
import { getBlockchainHealth } from "../services/blockchain.service.js";

export async function blockchainHealth(
  _req: Request,
  res: Response,
) {
  try {
    const health = await getBlockchainHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    console.error(
      "Blockchain health check failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    res.status(503).json({
      success: false,
      message: "Blockchain service is unavailable or not configured.",
    });
  }
}
