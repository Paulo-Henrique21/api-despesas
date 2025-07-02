import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

export const markExpenseAsPaid = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;
    const { month, amount, method, note } = req.body;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Mês inválido. Use o formato YYYY-MM." });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valor inválido para pagamento." });
    }

    // Verificar se despesa pertence ao usuário
    const expense = await Expense.findOne({ _id: expenseId, userId });
    if (!expense) {
      return res.status(404).json({ message: "Despesa não encontrada." });
    }

    // Verifica se já foi pago
    const alreadyPaid = await Payment.findOne({ expenseId, month });
    if (alreadyPaid) {
      return res.status(409).json({ message: "Pagamento já registrado para esse mês." });
    }

    const payment = await Payment.create({
      expenseId,
      month,
      amount,
      paidAt: new Date(),
      method: method ?? "",
      note: note ?? "",
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Pagamento registrado com sucesso.",
      payment,
    });
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error.message);
    return res.status(500).json({
      message: "Erro ao registrar pagamento.",
      error: error.message,
    });
  }
};

export const unmarkExpenseAsPaid = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Mês inválido. Use o formato YYYY-MM." });
    }

    // Verifica se a despesa existe e pertence ao usuário
    const expense = await Expense.findOne({ _id: expenseId, userId });
    if (!expense) {
      return res.status(404).json({ message: "Despesa não encontrada ou não pertence ao usuário." });
    }

    // Verifica se existe pagamento registrado para esse mês
    const payment = await Payment.findOne({ expenseId, month });
    if (!payment) {
      return res.status(404).json({ message: "Nenhum pagamento registrado para este mês." });
    }

    await Payment.deleteOne({ _id: payment._id });

    return res.status(200).json({ message: "Pagamento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover pagamento:", error.message);
    return res.status(500).json({
      message: "Erro ao remover pagamento",
      error: error.message,
    });
  }
};
