import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import MonthlyExpense from "../models/MonthlyExpense.js";
import Payment from "../models/Payment.js";
import ExpenseVariant from "../models/ExpenseVariant.js";

export const createDemoUser = async () => {
  try {
    const demoEmail = process.env.DEMO_USER_EMAIL;
    const demoPassword = process.env.DEMO_USER_PASSWORD;

    if (!demoEmail || !demoPassword) {
      console.log("Configurações do usuário demo não encontradas no .env");
      return null;
    }

    // Criptografar a senha
    const passwordCrypt = await bcrypt.hash(demoPassword, 10);

    // Verificar se o usuário demo já existe
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      // Criar usuário demo se não existir
      demoUser = await User.create({
        name: "Usuário Demo",
        email: demoEmail,
        password: passwordCrypt,
        role: "user",
      });

      console.log("Usuário demo criado com sucesso");
    } else {
      // Atualizar senha do usuário demo existente
      await User.findByIdAndUpdate(demoUser._id, {
        password: passwordCrypt,
        name: "Usuário Demo", // Garantir que o nome esteja correto
      });

      console.log("Senha do usuário demo atualizada com sucesso");
      
      // Recarregar o usuário atualizado
      demoUser = await User.findById(demoUser._id);
    }

    return demoUser;
  } catch (error) {
    console.error("Erro ao criar usuário demo:", error);
    return null;
  }
};

export const resetDemoUserData = async () => {
  try {
    const demoEmail = process.env.DEMO_USER_EMAIL;
    
    if (!demoEmail) {
      console.log("Email do usuário demo não configurado");
      return false;
    }

    const demoUser = await User.findOne({ email: demoEmail });
    
    if (!demoUser) {
      console.log("Usuário demo não encontrado");
      return false;
    }

    const userId = demoUser._id;

    // Limpar todos os dados relacionados ao usuário demo
    await Promise.all([
      // Deletar pagamentos relacionados às despesas do usuário demo
      Payment.deleteMany({
        expenseId: { $in: await Expense.find({ userId }).distinct('_id') }
      }),
      // Deletar despesas mensais do usuário demo
      MonthlyExpense.deleteMany({ userId }),
      // Deletar variantes de despesas do usuário demo
      ExpenseVariant.deleteMany({ userId }),
      // Deletar despesas do usuário demo
      Expense.deleteMany({ userId }),
    ]);

    // Criar dados de exemplo para o usuário demo
    await createDemoData(userId);

    console.log(`Dados do usuário demo resetados às ${new Date().toLocaleString()}`);
    return true;
  } catch (error) {
    console.error("Erro ao resetar dados do usuário demo:", error);
    return false;
  }
};

const createDemoData = async (userId) => {
  try {
    // Criar algumas despesas de exemplo
    const demoExpenses = [
      {
        userId,
        name: "Aluguel",
        description: "Pagamento mensal do aluguel",
        amount: 1200.00,
        dueDay: 5,
        startDate: new Date("2024-01-01"),
        category: "Casa",
        status: "active"
      },
      {
        userId,
        name: "Condomínio",
        description: "Taxa mensal do condomínio",
        amount: 280.00,
        dueDay: 8,
        startDate: new Date("2024-01-01"),
        category: "Casa",
        status: "active"
      },
      {
        userId,
        name: "Conta de Luz",
        description: "Energia elétrica residencial",
        amount: 150.00,
        dueDay: 12,
        startDate: new Date("2024-01-01"),
        category: "Casa",
        status: "active"
      },
      {
        userId,
        name: "Internet",
        description: "Plano de internet residencial",
        amount: 89.90,
        dueDay: 15,
        startDate: new Date("2024-01-01"),
        category: "Serviços",
        status: "active"
      },
      {
        userId,
        name: "Academia",
        description: "Mensalidade da academia",
        amount: 75.00,
        dueDay: 10,
        startDate: new Date("2024-01-01"),
        category: "Saúde",
        status: "active"
      },
      {
        userId,
        name: "Plano de Saúde",
        description: "Plano médico familiar",
        amount: 320.00,
        dueDay: 18,
        startDate: new Date("2024-01-01"),
        category: "Saúde",
        status: "active"
      },
      {
        userId,
        name: "Netflix",
        description: "Assinatura de streaming de vídeo",
        amount: 29.90,
        dueDay: 20,
        startDate: new Date("2024-01-01"),
        category: "Assinaturas",
        status: "active"
      },
      {
        userId,
        name: "Spotify",
        description: "Assinatura de música premium",
        amount: 16.90,
        dueDay: 22,
        startDate: new Date("2024-01-01"),
        category: "Assinaturas",
        status: "active"
      },
      {
        userId,
        name: "Celular",
        description: "Plano do telefone celular",
        amount: 49.90,
        dueDay: 8,
        startDate: new Date("2024-01-01"),
        category: "Tecnologia",
        status: "active"
      },
      {
        userId,
        name: "Combustível",
        description: "Gasolina mensal do carro",
        amount: 350.00,
        dueDay: 25,
        startDate: new Date("2024-01-01"),
        category: "Carro",
        status: "active"
      },
      {
        userId,
        name: "Supermercado",
        description: "Compras mensais de alimentação",
        amount: 800.00,
        dueDay: 1,
        startDate: new Date("2024-01-01"),
        category: "Alimentação",
        status: "active"
      },
      {
        userId,
        name: "Transporte Público",
        description: "Passe mensal de ônibus/metrô",
        amount: 120.00,
        dueDay: 3,
        startDate: new Date("2024-01-01"),
        category: "Transporte",
        status: "active"
      }
    ];

    const createdExpenses = await Expense.insertMany(demoExpenses);

    // Criar algumas despesas mensais de exemplo para o mês atual e anterior
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const monthlyExpenses = [];

    // Despesas do mês atual (algumas pagas, outras não)
    createdExpenses.forEach((expense, index) => {
      monthlyExpenses.push({
        userId,
        expenseId: expense._id,
        month: currentMonth,
        year: currentYear,
        value: expense.amount,
        paymentStatus: index % 2 === 0 ? "paid" : "unpaid", // Alternar entre pago e não pago
        dueDay: expense.dueDay,
        description: expense.description
      });

      // Despesas do mês anterior (todas pagas)
      monthlyExpenses.push({
        userId,
        expenseId: expense._id,
        month: previousMonth,
        year: previousYear,
        value: expense.amount,
        paymentStatus: "paid",
        dueDay: expense.dueDay,
        description: expense.description
      });
    });

    await MonthlyExpense.insertMany(monthlyExpenses);

    // Criar alguns pagamentos de exemplo para as despesas pagas
    const paidMonthlyExpenses = monthlyExpenses.filter(me => me.paymentStatus === "paid");
    const payments = paidMonthlyExpenses.map(monthlyExpense => {
      const expense = createdExpenses.find(e => e._id.equals(monthlyExpense.expenseId));
      return {
        expenseId: monthlyExpense.expenseId,
        month: `${monthlyExpense.year}-${monthlyExpense.month.toString().padStart(2, '0')}`,
        amount: monthlyExpense.value,
        paidAt: new Date(monthlyExpense.year, monthlyExpense.month - 1, expense.dueDay),
        method: ["Cartão de Crédito", "PIX", "Débito Automático", "Boleto"][Math.floor(Math.random() * 4)],
        note: `Pagamento automático - ${expense.name}`,
        status: "confirmed"
      };
    });

    await Payment.insertMany(payments);

    console.log("Dados de exemplo criados para o usuário demo");
    console.log(`- ${createdExpenses.length} despesas criadas`);
    console.log(`- ${monthlyExpenses.length} despesas mensais criadas`);
    console.log(`- ${payments.length} pagamentos criados`);
  } catch (error) {
    console.error("Erro ao criar dados de exemplo:", error);
  }
};

export const initializeDemoUser = async () => {
  try {
    // Criar usuário demo se não existir
    await createDemoUser();
    
    // Resetar dados do usuário demo
    await resetDemoUserData();
    
    console.log("Usuário demo inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar usuário demo:", error);
  }
};

// Função para agendar reset diário (executa à meia-noite)
export const scheduleDailyReset = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Meia-noite

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    resetDemoUserData();
    
    // Agendar próximo reset (24 horas)
    setInterval(resetDemoUserData, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  console.log(`Próximo reset do usuário demo agendado para: ${tomorrow.toLocaleString()}`);
};
