import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { updateMonthlyVariant, updateVariantsFromMonth } from "../controllers/variantController.js";


const router = express.Router();

router.post("/:expenseId/variant", authenticateToken, updateMonthlyVariant);
router.patch("/:expenseId/update-scope", authenticateToken, updateVariantsFromMonth);


export default router;
