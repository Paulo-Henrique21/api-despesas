import { updateExpenseWithScope } from '../controllers/expenseController.js';
import Expense from '../models/Expense.js';
import ExpenseVariant from '../models/ExpenseVariant.js';
import { mockRequest, mockResponse, generateTestUserId } from './testUtils.js';

describe('Debug Edit Expense Issue', () => {
  let req, res, testUserId, testExpense;

  beforeEach(async () => {
    req = mockRequest();
    res = mockResponse();
    testUserId = generateTestUserId();
    req.user = { id: testUserId };

    // Criar uma despesa similar ao que existe no frontend
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

  it('should debug the exact issue from frontend', async () => {
    console.log('\n🔍 DEBUGGING EDIT EXPENSE ISSUE');
    console.log('Original expense:', testExpense.toObject());

    const updates = {
      name: 'Aluguel Editado',
      amount: 1300.00,
      category: 'rent'
    };

    // Simulando edição "Este e próximos"
    req.body = {
      scope: 'future',
      month: '2024-08',
      updates
    };

    console.log('Request body:', req.body);

    await updateExpenseWithScope(req, res);

    console.log('Response status:', res.status.mock.calls);
    console.log('Response data:', res.json.mock.calls);

    // Verificar o que foi salvo no banco
    const variants = await ExpenseVariant.find({ 
      expenseId: testExpense._id 
    }).lean();

    console.log('Created variants:', variants);

    // Verificar se todas as propriedades foram salvas
    if (variants.length > 0) {
      const firstVariant = variants[0];
      console.log('First variant details:');
      console.log('- name:', firstVariant.name);
      console.log('- amount:', firstVariant.amount);
      console.log('- category:', firstVariant.category);
      console.log('- month:', firstVariant.month);
    }

    // Testes específicos
    expect(variants.length).toBeGreaterThan(0);
    expect(variants[0].name).toBe('Aluguel Editado');
    expect(variants[0].amount).toBe(1300.00);
    expect(variants[0].category).toBe('rent');
  });

  it('should test scope only with all fields', async () => {
    console.log('\n🔍 TESTING SCOPE ONLY');
    
    const updates = {
      amount: 1500.00,
      paymentStatus: 'paid'
    };

    req.body = {
      scope: 'only',
      month: '2024-08',
      updates
    };

    await updateExpenseWithScope(req, res);

    const variant = await ExpenseVariant.findOne({ 
      expenseId: testExpense._id,
      month: '2024-08' 
    });

    console.log('Scope only variant:', variant?.toObject());

    expect(variant).toBeTruthy();
    expect(variant.amount).toBe(1500.00);
  });

  it('should test scope all', async () => {
    console.log('\n🔍 TESTING SCOPE ALL');
    
    const updates = {
      name: 'Nome Totalmente Novo',
      amount: 2000.00,
      category: 'new-category'
    };

    req.body = {
      scope: 'all',
      month: '2024-08',
      updates
    };

    await updateExpenseWithScope(req, res);

    const updatedExpense = await Expense.findById(testExpense._id);
    console.log('Updated base expense:', updatedExpense?.toObject());

    expect(updatedExpense.name).toBe('Nome Totalmente Novo');
    expect(updatedExpense.amount).toBe(2000.00);
    expect(updatedExpense.category).toBe('new-category');
  });
});
