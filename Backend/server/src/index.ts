import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import verificationRoutes from "./routes/verification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Certificate Verification API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/verification", verificationRoutes);

const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
