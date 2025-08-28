import { updateExpenseWithScope } from '../controllers/expenseController.js';
import Expense from '../models/Expense.js';
import ExpenseVariant from '../models/ExpenseVariant.js';
import Payment from '../models/Payment.js';
import { mockRequest, mockResponse, generateTestUserId } from './testUtils.js';

describe('Update Expense With Scope', () => {
  let req, res, testUserId, testExpense;

  beforeEach(async () => {
    req = mockRequest();
    res = mockResponse();
    testUserId = generateTestUserId();
    req.user = { id: testUserId };

    // Criar uma despesa de teste
    testExpense = await Expense.create({
      userId: testUserId,
      name: 'Aluguel',
      description: 'Pagamento mensal do aluguel',
      amount: 1200.00,
      dueDay: 5,
      startDate: '2024-01-01',
      category: 'housing'
    });

    req.params = { expenseId: testExpense._id.toString() };
  });

  describe('Scope: only', () => {
    it('should update expense for current month only', async () => {
      const updates = {
        amount: 1300.00,
        paymentStatus: 'paid'
      };

      req.body = {
        scope: 'only',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Despesa atualizada apenas neste mês.',
          variant: expect.any(Object)
        })
      );

      // Verificar se a variante foi criada
      const variant = await ExpenseVariant.findOne({ 
        expenseId: testExpense._id, 
        month: '2024-08' 
      });
      expect(variant).toBeTruthy();
      expect(variant.amount).toBe(1300.00);

      // Verificar se o pagamento foi criado
      const payment = await Payment.findOne({ 
        expenseId: testExpense._id, 
        month: '2024-08' 
      });
      expect(payment).toBeTruthy();
      expect(payment.status).toBe('confirmed');
    });

    it('should handle unpaid status correctly', async () => {
      // Primeiro criar um pagamento
      await Payment.create({
        expenseId: testExpense._id,
        month: '2024-08',
        amount: 1200.00,
        paidAt: new Date(),
        method: 'manual',
        status: 'confirmed'
      });

      const updates = {
        paymentStatus: 'unpaid'
      };

      req.body = {
        scope: 'only',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      // Verificar se o pagamento foi removido
      const payment = await Payment.findOne({ 
        expenseId: testExpense._id, 
        month: '2024-08' 
      });
      expect(payment).toBeNull();
    });
  });

  describe('Scope: future', () => {
    it('should update expense for current and future months', async () => {
      const updates = {
        amount: 1400.00,
        name: 'Aluguel Atualizado'
      };

      req.body = {
        scope: 'future',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Despesa atualizada para este mês e os próximos.',
          updatedMonths: expect.arrayContaining(['2024-08'])
        })
      );

      // Verificar se as variantes foram criadas para os próximos meses
      const variants = await ExpenseVariant.find({ 
        expenseId: testExpense._id,
        month: { $gte: '2024-08' }
      });
      expect(variants.length).toBeGreaterThan(0);
      variants.forEach(variant => {
        expect(variant.amount).toBe(1400.00);
        expect(variant.name).toBe('Aluguel Atualizado');
      });
    });
  });

  describe('Scope: all', () => {
    it('should update base expense for all months', async () => {
      const updates = {
        amount: 1500.00,
        name: 'Aluguel Base Atualizado',
        category: 'rent'
      };

      req.body = {
        scope: 'all',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Despesa base atualizada em todos os meses.'
        })
      );

      // Verificar se a despesa base foi atualizada
      const updatedExpense = await Expense.findById(testExpense._id);
      expect(updatedExpense.amount).toBe(1500.00);
      expect(updatedExpense.name).toBe('Aluguel Base Atualizado');
      expect(updatedExpense.category).toBe('rent');

      // Verificar se todas as variantes foram removidas
      const variants = await ExpenseVariant.find({ expenseId: testExpense._id });
      expect(variants.length).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should return 400 for invalid scope', async () => {
      req.body = {
        scope: 'invalid',
        month: '2024-08',
        updates: { amount: 1000 }
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Escopo inválido. Use: only, future, all.'
        })
      );
    });

    it('should return 400 for invalid month format', async () => {
      req.body = {
        scope: 'only',
        month: '2024/08', // formato inválido
        updates: { amount: 1000 }
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Mês inválido. Use o formato YYYY-MM.'
        })
      );
    });

    it('should return 404 for non-existent expense', async () => {
      req.params = { expenseId: '507f1f77bcf86cd799439011' }; // ID fictício
      req.body = {
        scope: 'only',
        month: '2024-08',
        updates: { amount: 1000 }
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Despesa não encontrada.'
        })
      );
    });

    it('should return 404 for expense belonging to another user', async () => {
      const anotherUserId = generateTestUserId();
      const anotherExpense = await Expense.create({
        userId: anotherUserId,
        name: 'Despesa de outro usuário',
        amount: 500,
        dueDay: 10,
        startDate: '2024-01-01',
        category: 'other'
      });

      req.params = { expenseId: anotherExpense._id.toString() };
      req.body = {
        scope: 'only',
        month: '2024-08',
        updates: { amount: 1000 }
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Despesa não encontrada.'
        })
      );
    });
  });

  describe('Integration with real data scenarios', () => {
    it('should handle updating payment status from unpaid to paid correctly', async () => {
      const updates = {
        amount: 1200.00,
        paymentStatus: 'paid'
      };

      req.body = {
        scope: 'only',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      // Verificar se o pagamento foi criado com os dados corretos
      const payment = await Payment.findOne({ 
        expenseId: testExpense._id, 
        month: '2024-08' 
      });

      expect(payment).toBeTruthy();
      expect(payment.amount).toBe(1200.00);
      expect(payment.method).toBe('manual');
      expect(payment.note).toBe('Marcado como pago na edição');
      expect(payment.status).toBe('confirmed');
      expect(payment.paidAt).toBeInstanceOf(Date);
    });

    it('should handle scope future with endDate constraint', async () => {
      // Atualizar despesa com data de fim
      await Expense.updateOne(
        { _id: testExpense._id },
        { $set: { endDate: '2024-10-31' } }
      );

      const updates = {
        amount: 1350.00
      };

      req.body = {
        scope: 'future',
        month: '2024-08',
        updates
      };

      await updateExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      // Verificar se as variantes foram criadas apenas até a endDate
      const variants = await ExpenseVariant.find({ 
        expenseId: testExpense._id,
        month: { $gte: '2024-08' }
      });

      // Deve ter variantes para agosto, setembro e outubro (3 meses)
      expect(variants.length).toBe(3);
      
      const months = variants.map(v => v.month).sort();
      expect(months).toEqual(['2024-08', '2024-09', '2024-10']);
    });
  });
});
