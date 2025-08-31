import ExpenseVariant from "../models/ExpenseVariant.js";
import Expense from "../models/Expense.js";
import Payment from "../models/Payment.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore);

export const createExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      description,
      amount,
      dueDay,
      startDate,
      endDate,
      category,
      paymentStatus,
    } = req.body;

    const expense = await Expense.create({
      userId,
      name,
      description,
      amount,
      dueDay,
      startDate,
      endDate: endDate || null,
      category,
    });

    const now = dayjs();
    const start = dayjs(startDate);

    // const isSameMonth =
    //   start.month() === now.month() && start.year() === now.year();

    // if (paymentStatus === "paid" && isSameMonth) {
    //   await Payment.create({
    //     expenseId: expense._id,
    //     month: now.format("YYYY-MM"),
    //     amount,
    //     paidAt: new Date(),
    //     method: "manual",
    //     note: "Marcado como pago na criação",
    //     status: "confirmed",
    //   });
    // }
    if (paymentStatus === "paid") {
      const paymentMonth = dayjs(startDate).format("YYYY-MM");

      await Payment.create({
        expenseId: expense._id,
        month: paymentMonth,
        amount,
        paidAt: new Date(),
        method: "manual",
        note: "Marcado como pago na criação",
        status: "confirmed",
      });
    }

    return res.status(201).json({
      message: "Despesa criada com sucesso!",
      expense,
    });
  } catch (error) {
    console.error("❌ Erro ao criar despesa:", error.message);
    
    // Se for erro de validação do Mongoose, retorna 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Dados inválidos para criar despesa",
        error: error.message,
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    // Outros erros retornam 500
    return res.status(500).json({
      message: "Erro interno ao criar despesa",
      error: error.message,
    });
  }
};

export const getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query; // formato: "2025-06"

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: "Parâmetro 'month' inválido. Ex: 2025-06",
      });
    }

    const endOfMonth = dayjs(`${month}-01`).endOf("month").toDate();
    const afterEndOfMonth = dayjs(`${month}-01`)
      .add(1, "month")
      .startOf("month")
      .toDate();

    const expenses = await Expense.find({
      userId,
      status: "active",
      startDate: { $lte: endOfMonth },
      $or: [{ endDate: null }, { endDate: { $gte: afterEndOfMonth } }],
    }).lean();

    if (expenses.length === 0) return res.status(200).json([]);

    const expenseIds = expenses.map((e) => e._id.toString());

    const [variants, payments] = await Promise.all([
      ExpenseVariant.find({ expenseId: { $in: expenseIds }, month }).lean(),
      Payment.find({ expenseId: { $in: expenseIds }, month }).lean(),
    ]);

    const result = expenses.map((expense) => {
      const variant = variants.find(
        (v) => v.expenseId.toString() === expense._id.toString()
      );

      const payment = payments.find(
        (p) => p.expenseId.toString() === expense._id.toString()
      );

      const dueDate = new Date(`${month}-${variant?.dueDay ?? expense.dueDay}`);
      const today = new Date();

      let status = "unpaid";
      if (payment) status = "paid";
      else if (today > dueDate) status = "due";

      return {
        expenseId: expense._id,
        name: expense.name,
        category: variant?.category ?? expense.category,
        amount: variant?.amount ?? expense.amount,
        dueDay: variant?.dueDay ?? expense.dueDay,
        dueDate,
        description: expense.description,
        status,
        payment: payment
          ? {
              paidAt: payment.paidAt,
              amount: payment.amount,
              method: payment.method,
              note: payment.note,
              status: payment.status,
            }
          : null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erro ao listar despesas:", error.message);
    return res.status(500).json({
      message: "Erro ao listar despesas",
      error: error.message,
    });
  }
};

export const updateExpenseWithScope = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;
    const { scope, month, updates } = req.body;

    if (!["only", "future", "all"].includes(scope)) {
      return res
        .status(400)
        .json({ message: "Escopo inválido. Use: only, future, all." });
    }

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({ message: "Mês inválido. Use o formato YYYY-MM." });
    }

    const expense = await Expense.findOne({ _id: expenseId, userId });
    if (!expense) {
      return res.status(404).json({ message: "Despesa não encontrada." });
    }

    if (scope === "only") {
      const variant = await ExpenseVariant.findOneAndUpdate(
        { expenseId, month },
        { $set: updates },
        { upsert: true, new: true }
      );

      // Lógica para atualizar o pagamento
      if (typeof updates.paymentStatus === "string") {
        const existingPayment = await Payment.findOne({ expenseId, month });

        if (updates.paymentStatus === "paid") {
          if (!existingPayment) {
            await Payment.create({
              expenseId,
              month,
              amount: updates.amount ?? variant.amount ?? expense.amount,
              paidAt: new Date(),
              method: "manual",
              note: "Marcado como pago na edição",
              status: "confirmed",
            });
          }
        } else if (updates.paymentStatus === "unpaid") {
          if (existingPayment) {
            await Payment.deleteOne({ _id: existingPayment._id });
          }
        }
      }

      return res
        .status(200)
        .json({ message: "Despesa atualizada apenas neste mês.", variant });
    }

    if (scope === "future") {
      const start = dayjs(month + "-01");
      const end = expense.endDate
        ? dayjs(expense.endDate)
        : start.add(60, "month");

      const results = [];
      let current = start;

      while (current.isSameOrBefore(end, "month")) {
        const currentMonth = current.format("YYYY-MM");

        const variant = await ExpenseVariant.findOneAndUpdate(
          { expenseId, month: currentMonth },
          { $set: updates },
          { upsert: true, new: true }
        );

        results.push({ month: currentMonth, variant });
        current = current.add(1, "month");
      }

      return res.status(200).json({
        message: "Despesa atualizada para este mês e os próximos.",
        updatedMonths: results.map((r) => r.month),
      });
    }

    if (scope === "all") {
      // Atualiza a despesa base
      await Expense.updateOne({ _id: expenseId, userId }, { $set: updates });

      // Remove variantes conflitantes
      await ExpenseVariant.deleteMany({ expenseId });

      return res
        .status(200)
        .json({ message: "Despesa base atualizada em todos os meses." });
    }
  } catch (error) {
    console.error("Erro ao editar despesa com escopo:", error.message);
    return res.status(500).json({
      message: "Erro ao editar despesa com escopo",
      error: error.message,
    });
  }
};

export const deleteExpenseWithScope = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;
    const { scope, month } = req.query;

    if (!expenseId || !scope || !month) {
      return res.status(400).json({
        message: "Parâmetros obrigatórios: expenseId, scope, month",
      });
    }

    if (!["future", "all"].includes(scope)) {
      return res.status(400).json({
        message:
          "Escopo inválido. Permitidos apenas: future, all. O escopo 'only' foi descontinuado.",
      });
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: "Parâmetro 'month' deve estar no formato YYYY-MM.",
      });
    }

    const expense = await Expense.findOne({ _id: expenseId, userId });
    if (!expense) {
      return res.status(404).json({ message: "Despesa não encontrada." });
    }

    const isFirstMonth = dayjs(expense.startDate).format("YYYY-MM") === month;

    if (scope === "future") {
      await ExpenseVariant.deleteMany({
        expenseId,
        month: { $gte: month },
      });

      await Payment.deleteMany({
        expenseId,
        month: { $gte: month },
      });

      // Se a despesa estiver sendo apagada no mês de início, apaga tudo
      if (isFirstMonth) {
        await Expense.deleteOne({ _id: expenseId, userId });
        return res.status(200).json({
          message: "Despesa completamente removida (era o primeiro mês).",
        });
      }

      // Caso contrário, só atualiza a endDate
      const newEndDate = dayjs(month + "-01")
        .endOf("month")
        .toDate();
      await Expense.updateOne(
        { _id: expenseId, userId },
        { $set: { endDate: newEndDate } }
      );

      return res
        .status(200)
        .json({ message: "Despesa removida deste mês em diante." });
    }

    if (scope === "all") {
      await Expense.deleteOne({ _id: expenseId, userId });
      await ExpenseVariant.deleteMany({ expenseId });
      await Payment.deleteMany({ expenseId });

      return res
        .status(200)
        .json({ message: "Despesa completamente removida." });
    }
  } catch (error) {
    console.error("Erro ao deletar com escopo:", error.message);
    return res.status(500).json({
      message: "Erro ao deletar despesa com escopo",
      error: error.message,
    });
  }
};

export const checkIfUserHasAnyExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const exists = await Expense.exists({ userId });

    return res.status(200).json({
      hasAny: !!exists,
    });
  } catch (error) {
    console.error("Erro ao verificar despesas base:", error.message);
    return res.status(500).json({
      message: "Erro ao verificar despesas do usuário",
      error: error.message,
    });
  }
};
