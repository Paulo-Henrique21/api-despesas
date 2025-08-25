// Utilitário para padronizar respostas de erro
export const errorResponse = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

export const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

// Middleware para capturar erros não tratados
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  
  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    }));
    
    return errorResponse(res, 400, 'Dados inválidos', details);
  }
  
  // Erro de duplicação (email já existe)
  if (err.code === 11000) {
    return errorResponse(res, 409, 'Dados já existem no sistema');
  }
  
  // Erro de cast (ID inválido)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'ID inválido');
  }
  
  // Erro interno do servidor
  return errorResponse(res, 500, 'Erro interno do servidor');
};
