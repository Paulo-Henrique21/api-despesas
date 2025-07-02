import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createExpense,
  getMonthlyExpenses,
  updateExpenseWithScope,
  deleteExpenseWithScope,
  checkIfUserHasAnyExpense, // ← importar aqui
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", authenticateToken, createExpense);
router.get("/monthly", authenticateToken, getMonthlyExpenses);
router.patch("/:expenseId/edit", authenticateToken, updateExpenseWithScope);
router.delete("/:expenseId/delete", authenticateToken, deleteExpenseWithScope);
router.get("/has-any", authenticateToken, checkIfUserHasAnyExpense);

export default router;
