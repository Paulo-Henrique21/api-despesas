import express from "express";
import { resetDemo, getDemoCredentials, initializeDemo, updateDemoPassword } from "../controllers/demoController.js";

const router = express.Router();

// Rota para obter credenciais do usuário demo
router.get("/credentials", getDemoCredentials);

// Rota para resetar dados do usuário demo manualmente
router.post("/reset", resetDemo);

// Rota para inicializar usuário demo
router.post("/initialize", initializeDemo);

// Rota para atualizar senha do usuário demo
router.post("/update-password", updateDemoPassword);

export default router;
