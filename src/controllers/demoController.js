import { resetDemoUserData, createDemoUser } from "../services/demoUserService.js";

export const resetDemo = async (req, res) => {
  try {
    const success = await resetDemoUserData();
    
    if (success) {
      return res.status(200).json({
        message: "Dados do usuário demo resetados com sucesso",
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        message: "Erro ao resetar dados do usuário demo"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message
    });
  }
};

export const getDemoCredentials = async (req, res) => {
  try {
    const demoEmail = process.env.DEMO_USER_EMAIL;
    const demoPassword = process.env.DEMO_USER_PASSWORD;

    if (!demoEmail || !demoPassword) {
      return res.status(404).json({
        message: "Credenciais do usuário demo não configuradas"
      });
    }

    return res.status(200).json({
      message: "Credenciais do usuário demo",
      credentials: {
        email: demoEmail,
        password: demoPassword
      },
      note: "Este usuário tem seus dados resetados diariamente à meia-noite"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message
    });
  }
};

export const initializeDemo = async (req, res) => {
  try {
    const demoUser = await createDemoUser();
    
    if (demoUser) {
      await resetDemoUserData();
      
      return res.status(200).json({
        message: "Usuário demo inicializado com sucesso",
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role
        }
      });
    } else {
      return res.status(500).json({
        message: "Erro ao inicializar usuário demo"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message
    });
  }
};

export const updateDemoPassword = async (req, res) => {
  try {
    const demoUser = await createDemoUser(); // Isso agora atualiza a senha automaticamente
    
    if (demoUser) {
      return res.status(200).json({
        message: "Senha do usuário demo atualizada com sucesso",
        credentials: {
          email: process.env.DEMO_USER_EMAIL,
          password: process.env.DEMO_USER_PASSWORD
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        message: "Erro ao atualizar senha do usuário demo"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message
    });
  }
};
