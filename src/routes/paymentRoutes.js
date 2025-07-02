import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { markExpenseAsPaid, unmarkExpenseAsPaid } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/:expenseId/pay", authenticateToken, markExpenseAsPaid);
router.delete("/:expenseId/unpay", authenticateToken, unmarkExpenseAsPaid);

export default router;
