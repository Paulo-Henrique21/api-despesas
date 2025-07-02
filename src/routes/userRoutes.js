import express from "express";
import { getUserProfile, login, logout, register } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
