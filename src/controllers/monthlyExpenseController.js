import Expense from "../models/Expense.js";
import MonthlyExpense from "../models/MonthlyExpense.js";

export const getMonthlyExpensesByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 userId recebido:", userId);

    const { month, year } = req.query;
    console.log("🗓️ Filtro recebido → month:", month, "| year:", year);

    if (!month || !year) {
      return res.status(400).json({
        message: "Mês e ano são obrigatórios",
      });
    }

    const monthlyExpenses = await MonthlyExpense.find({
      userId,
      month: Number(month),
      year: Number(year),
    }).populate("expenseId");

    console.log("📦 Despesas encontradas:", monthlyExpenses.length);

    const formatted = monthlyExpenses.map((expense) => ({
      id: expense.id,
      title: expense.expenseId?.title,
      category: expense.expenseId?.category,
      value: expense.value,
      paymentStatus: expense.paymentStatus,
      dueDay: expense.dueDay,
      description: expense.description,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Erro no getMonthlyExpensesByMonth:", error.message);
    res.status(500).json({
      message: "Erro ao buscar despesas do mês",
      error: error.message,
    });
  }
};

export const getAvailableYears = async (req, res) => {
  try {
    const userId = req.user.id;

    const years = await MonthlyExpense.distinct("year", { userId });

    years.sort();

    return res.status(200).json(years);
  } catch (error) {
    console.error("Erro ao buscar anos disponíveis:", error.message);
    return res.status(500).json({
      message: "Erro ao buscar anos disponíveis",
      error: error.message,
    });
  }
};

export const updateMonthlyExpenseStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { paymentStatus } = req.body;


    if (!["paid", "unpaid"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Status inválido. Use 'paid' ou 'unpaid'",
      });
    }


    const monthlyExpense = await MonthlyExpense.findOne({ _id: id, userId });

    if (!monthlyExpense) {
      return res.status(404).json({
        message: "Despesa mensal não encontrada",
      });
    }


    monthlyExpense.paymentStatus = paymentStatus;
    await monthlyExpense.save();


    return res.status(200).json({
      message: "Status atualizado com sucesso!",
      data: monthlyExpense,
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error.message);
    return res.status(500).json({
      message: "Erro ao atualizar status da despesa mensal",
      error: error.message,
    });
  }
};

export const updateMonthlyExpensesWithScope = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateFields = req.body;

    const currentInstance = await MonthlyExpense.findOne({ _id: id, userId });

    if (!currentInstance) {
      return res.status(404).json({
        message: "Despesa mensal não encontrada",
      });
    }

    const { expenseId, month, year } = currentInstance;

    const futureInstances = await MonthlyExpense.updateMany(
      {
        userId,
        expenseId,
        $or: [{ year: { $gt: year } }, { year: year, month: { $gte: month } }],
      },
      { $set: updateFields }
    );

    return res.status(200).json({
      message: "Despesas futuras atualizadas com sucesso!",
      updated: futureInstances.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar despesas futuras",
      error: error.message,
    });
  }
};

export const deleteMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const monthlyExpense = await MonthlyExpense.findOne({ _id: id, userId });
    if (!monthlyExpense) {
      return res.status(404).json({
        message: "Despesa mensal não encontrada",
      });
    }
    await MonthlyExpense.deleteOne({ _id: id, userId });
    return res.status(200).json({
      message: "Despesa mensal deletada com sucesso!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar despesa mensal",
      error: error.message,
    });
  }
};

export const deleteFutureMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const currentInstance = await MonthlyExpense.findOne({ _id: id, userId });

    if (!currentInstance) {
      return res.status(404).json({
        message: "Despesa mensal não encontrada",
      });
    }

    const { expenseId, month, year } = currentInstance;

    const result = await MonthlyExpense.deleteMany({
      userId,
      expenseId,
      $or: [{ year: { $gt: year } }, { year: year, month: { $gte: month } }],
    });

    return res.status(200).json({
      message: "Despesas futuras deletadas com sucesso!",
      deleted: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar despesas futuras",
      error: error.message,
    });
  }
};

export const deleteAllExpensesOfBase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: expenseId } = req.params; // Agora o ID recebido é o expenseId

    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
      return res.status(404).json({
        message: "Despesa base não encontrada",
      });
    }

    await MonthlyExpense.deleteMany({ expenseId, userId });

    await Expense.deleteOne({ _id: expenseId, userId });

    return res.status(200).json({
      message: "Despesa completa deletada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar despesa completa:", error.message);
    return res.status(500).json({
      message: "Erro ao deletar despesa completa",
      error: error.message,
    });
  }
};

export const checkIfUserHasAnyMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const exists = await MonthlyExpense.exists({ userId });

    return res.status(200).json({
      hasAny: !!exists,
    });
  } catch (error) {
    console.error("Erro ao verificar despesas mensais:", error.message);
    return res.status(500).json({
      message: "Erro ao verificar despesas do usuário",
      error: error.message,
    });
  }
}
