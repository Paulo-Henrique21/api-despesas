import User from "../models/User.js";

export const ensureUserExists = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(401).json({
        message: "Usuário não encontrado. A ação não pode ser concluída.",
      });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar usuário:", error.message);
    return res.status(500).json({
      message: "Erro interno ao verificar o usuário",
      error: error.message,
    });
  }
};
