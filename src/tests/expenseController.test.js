import { createExpense, getMonthlyExpenses, deleteExpenseWithScope } from '../controllers/expenseController.js';
import Expense from '../models/Expense.js';
import { mockRequest, mockResponse, generateTestUserId } from './testUtils.js';

describe('Expense Controller', () => {
  let req, res, testUserId;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    testUserId = generateTestUserId();
    req.user = { id: testUserId };
  });

  describe('createExpense', () => {
    it('should create a new expense successfully', async () => {
      const expenseData = {
        name: 'Conta de Luz',
        description: 'Despesa mensal de energia elétrica',
        amount: 150.50,
        dueDay: 15,
        startDate: '2024-01-01',
        category: 'utilities'
      };

      req.body = expenseData;

      await createExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          expense: expect.objectContaining({
            name: expenseData.name,
            amount: expenseData.amount
          })
        })
      );

      // Verificar se foi criado no banco
      const createdExpense = await Expense.findOne({ name: expenseData.name });
      expect(createdExpense).toBeTruthy();
    });

    it('should handle missing required fields', async () => {
      req.body = { name: 'Conta de Luz' }; // Campos obrigatórios faltando

      await createExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(400); // Erro de validação agora retorna 400 (correto!)
    });
  });

  describe('deleteExpenseWithScope', () => {
    let expenseToDelete;

    beforeEach(async () => {
      expenseToDelete = await Expense.create({
        userId: testUserId,
        name: 'Despesa para deletar',
        description: 'Esta despesa será deletada',
        amount: 50,
        dueDay: 1,
        startDate: '2024-01-01',
        category: 'test'
      });
    });

    it('should delete expense successfully', async () => {
      req.params = { expenseId: expenseToDelete._id.toString() };
      req.query = { 
        scope: 'all', 
        month: '2024-08'
      };

      await deleteExpenseWithScope(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      // Verificar se foi realmente deletado
      const deletedExpense = await Expense.findById(expenseToDelete._id);
      expect(deletedExpense).toBeNull();
    });
  });
});
