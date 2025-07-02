import ExpenseVariant from "../models/ExpenseVariant.js";
import Expense from "../models/Expense.js";
import dayjs from "dayjs";

export const updateMonthlyVariant = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { month, amount, dueDay, category } = req.body;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({ message: "Mês inválido. Use o formato YYYY-MM." });
    }

    const existing = await ExpenseVariant.findOne({ expenseId, month });

    let variant;
    if (existing) {
      existing.amount = amount ?? existing.amount;
      existing.dueDay = dueDay ?? existing.dueDay;
      existing.category = category ?? existing.category;
      await existing.save();
      variant = existing;
    } else {
      variant = await ExpenseVariant.create({
        expenseId,
        month,
        amount,
        dueDay,
        category,
      });
    }

    return res
      .status(200)
      .json({ message: "Variação salva com sucesso", variant });
  } catch (error) {
    console.error("Erro ao salvar variação:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao salvar variação", error: error.message });
  }
};

export const updateVariantsFromMonth = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { fromMonth, amount, dueDay, category } = req.body;
    const userId = req.user.id;

    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
      return res.status(404).json({ message: "Despesa base não encontrada" });
    }

    const end = expense.endDate
      ? dayjs(expense.endDate)
      : dayjs().add(12, "month"); // Limita a 12 meses se não tiver fim

    const [fromYear, fromMonthNum] = fromMonth.split("-").map(Number);
    const start = dayjs(`${fromYear}-${fromMonthNum}-01`);

    let current = start;
    const createdVariants = [];

    while (current.isBefore(end) || current.isSame(end, "month")) {
      const variantMonth = current.format("YYYY-MM");

      const existing = await ExpenseVariant.findOne({
        expenseId,
        month: variantMonth,
      });

      if (existing) {
        existing.amount = amount ?? existing.amount;
        existing.dueDay = dueDay ?? existing.dueDay;
        existing.category = category ?? existing.category;
        await existing.save();
        createdVariants.push({ month: variantMonth, updated: true });
      } else {
        await ExpenseVariant.create({
          expenseId,
          month: variantMonth,
          amount,
          dueDay,
          category,
        });
        createdVariants.push({ month: variantMonth, created: true });
      }

      current = current.add(1, "month");
    }

    return res.status(200).json({
      message: "Variações aplicadas para os meses futuros com sucesso",
      result: createdVariants,
    });
  } catch (error) {
    console.error("Erro ao atualizar variações:", error.message);
    return res.status(500).json({
      message: "Erro ao aplicar alterações futuras",
      error: error.message,
    });
  }
};
