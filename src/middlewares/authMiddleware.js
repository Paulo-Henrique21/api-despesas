import jwt from "jsonwebtoken"; // Importa a biblioteca jsonwebtoken para lidar com tokens JWT

// Função middleware para autenticar o token JWT
export const authenticateToken = (req, res, next) => {
  // Obtém o token do cabeçalho de autorização da requisição
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

  // Verifica se o token não foi fornecido
  if (!token) {
    return res.status(401).json({
      message: "Token não encontrado", // Retorna erro 401 (não autorizado) se o token estiver ausente
    });
  }

  try {
    // Verifica e decodifica o token usando a chave secreta armazenada em JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona os dados decodificados do token ao objeto `req` para uso posterior
    req.user = decoded;

    // Chama o próximo middleware ou rota
    next();
  } catch (error) {
    // Retorna erro 403 (proibido) se o token for inválido ou expirado
    return res.status(403).json({
      message: "Token inválido ou expirado",
    });
  }
};