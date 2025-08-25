import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // 1. Extrair name, email, password e registerPassword do req.body
    const { name, email, password, registerPassword } = req.body;

    // 2. Verificar se a senha de registro foi fornecida
    if (!registerPassword) {
      return res.status(400).json({
        message: "Senha de registro é obrigatória",
      });
    }

    // 3. Verificar se a senha de registro está correta
    if (registerPassword !== process.env.REGISTER_PASSWORD) {
      return res.status(401).json({
        message: "Senha de registro incorreta",
      });
    }

    // 4. Verificar se o email já existe no banco
    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    // 5. Criptografar a senha
    const passwordCrypt = await bcrypt.hash(password, 10);

    // 6. Criar o usuário no banco
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
    // 7. Retornar o usuário criado

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
    // 1. Extrair email e password do req.body
    const { email, password } = req.body;

    // 2. Buscar o usuário pelo email
    const user = await User.findOne({ email });

    // 3. Se não achar, retorna 404
    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    // 4. Comparar a senha com bcrypt.compare

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // 5. Se estiver incorreta, retorna 401
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Senha incorreta",
      });
    }
    // 6. Gerar token JWT com id e role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 7. Retornar token + dados do usuário

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
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
    res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
