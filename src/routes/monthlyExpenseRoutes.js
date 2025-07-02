import express from "express";
import {
  checkIfUserHasAnyMonthlyExpense,
  deleteAllExpensesOfBase,
  deleteFutureMonthlyExpenses,
  deleteMonthlyExpense,
  getAvailableYears,
  getMonthlyExpensesByMonth,
  updateMonthlyExpenseStatus,
  updateMonthlyExpensesWithScope,
} from "../controllers/monthlyExpenseController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { ensureUserExists } from "../middlewares/usersExistsMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, ensureUserExists, getMonthlyExpensesByMonth);
router.patch(
  "/:id/status",
  authenticateToken,
  ensureUserExists,
  updateMonthlyExpenseStatus
);
router.patch(
  "/:id/edit-scope",
  authenticateToken,
  ensureUserExists,
  updateMonthlyExpensesWithScope
);

// Delete somente esta instância
router.delete(
  "/:id",
  authenticateToken,
  ensureUserExists,
  deleteMonthlyExpense
);

// Delete esta + futuras
router.delete(
  "/:id/delete-scope",
  authenticateToken,
  ensureUserExists,
  deleteFutureMonthlyExpenses
);

// Delete tudo (instâncias + despesa base)
router.delete(
  "/:id/delete-all",
  authenticateToken,
  ensureUserExists,
  deleteAllExpensesOfBase
);

router.get(
  "/available-years",
  authenticateToken,
  ensureUserExists,
  getAvailableYears
);
router.get(
  "/has-any",
  authenticateToken,
  ensureUserExists,
  checkIfUserHasAnyMonthlyExpense
);

export default router;
