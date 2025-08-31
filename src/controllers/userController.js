import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, registerPassword } = req.body;

    if (!registerPassword) {
      return res.status(400).json({
        message: "Senha de registro é obrigatória",
      });
    }

    if (registerPassword !== process.env.REGISTER_PASSWORD) {
      return res.status(401).json({
        message: "Senha de registro incorreta",
      });
    }

    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const passwordCrypt = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passwordCrypt,
    });

    if (!user) {
      return res.status(500).json({
        message: "Erro ao criar o usuário",
      });
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar o usuário",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "E-mail ou Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ⭐ Opções do cookie para funcionar entre subdomínios em produção
    const isProd = process.env.NODE_ENV === "production";
    const domain = isProd ? (process.env.COOKIE_DOMAIN || ".onrender.com") : undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,                         // necessário com SameSite=None
      sameSite: isProd ? "none" : "lax",      // cross-site em prod
      path: "/",
      ...(domain && { domain }),              // visível em ui- e api-.onrender.com
      maxAge: 30 * 24 * 60 * 60 * 1000,       // 30 dias
    });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error: error.message });
  }
};

export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? (process.env.COOKIE_DOMAIN || ".onrender.com") : undefined;

  res.clearCookie("token", {
    path: "/",
    ...(domain && { domain }),
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    httpOnly: true,
    maxAge: 0, // Força expiração imediata
  });

  res.status(200).json({ message: "Logout realizado com sucesso" });
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password"); // remove o campo senha

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter perfil do usuário",
      error: error.message,
    });
  }
};
