import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Rotas
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js"; // atualizada para nova lógica
import variantRoutes from "./routes/variantRoutes.js"; // nova rota
import paymentRoutes from "./routes/paymentRoutes.js"; // nova rota

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Conectar ao banco
connectDB();

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes); // inclui /monthly
app.use("/api/variants", variantRoutes); // POST /:expenseId/variant
app.use("/api/payments", paymentRoutes); // POST /:expenseId/pay

// Rota de saúde
app.get("/", (req, res) => {
  res.send("API rodando com sucesso!");
});

// Iniciar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
