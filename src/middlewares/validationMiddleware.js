// Utilitário para validação de dados de entrada
export const validateUserInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      message: "Nome deve ter pelo menos 2 caracteres"
    });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      message: "Email deve ter formato válido"
    });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Senha deve ter pelo menos 6 caracteres"
    });
  }
  
  next();
};

export const validateExpenseInput = (req, res, next) => {
  const { name, amount, dueDay, startDate, category } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      message: "Nome da despesa deve ter pelo menos 2 caracteres"
    });
  }
  
  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Valor deve ser maior que zero"
    });
  }
  
  if (!dueDay || dueDay < 1 || dueDay > 31) {
    return res.status(400).json({
      message: "Dia de vencimento deve ser entre 1 e 31"
    });
  }
  
  if (!startDate) {
    return res.status(400).json({
      message: "Data de início é obrigatória"
    });
  }
  
  if (!category || category.trim().length < 2) {
    return res.status(400).json({
      message: "Categoria é obrigatória"
    });
  }
  
  next();
};
