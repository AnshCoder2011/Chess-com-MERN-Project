import express from "express";
import { registerUser, loginUser, updateUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:id", protect, updateUser);

export default router;
