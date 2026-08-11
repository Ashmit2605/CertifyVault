import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  // auth implementation placeholder
  res.json({ message: "Login route placeholder" });
});

export default router;
