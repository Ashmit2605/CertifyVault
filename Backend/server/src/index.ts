import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import blockchainRoutes from "./routes/blockchain.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import issuerRoutes from "./routes/issuer.routes.js";
import holderRoutes from "./routes/holder.routes.js";
import credentialClaimRoutes, { credentialClaimRouter } from "./routes/claim.routes.js";
import publicCredentialRoutes from "./routes/public-credential.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import {
  startBulkImportWorker,
  startInvitationOutboxWorker,
} from "./services/credential-lifecycle.service.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Certificate Verification API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/issuer", issuerRoutes);
app.use("/api/me", holderRoutes);
app.use("/api/credentials", credentialClaimRoutes);
app.use("/api/credential-claims", credentialClaimRouter);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/public/credentials", publicCredentialRoutes);
app.use("/api/verification", verificationRoutes);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    console.error("Unhandled API error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected server error occurred.",
    });
  },
);

const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  console.log(`🚀 Server running at: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
  startInvitationOutboxWorker();
  startBulkImportWorker();
});
