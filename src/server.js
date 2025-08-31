import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Rotas
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";

// Serviços
import { initializeDemoUser, scheduleDailyReset } from "./services/demoUserService.js";

dotenv.config();

const app = express();

// Configuração de proxy para cookies seguros
app.set("trust proxy", 1);

// CORS com múltiplas origens (desenvolvimento e produção)
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Conectar ao banco e inicializar serviços
await connectDB();
await initializeDemoUser();
scheduleDailyReset();

// Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/demo", demoRoutes);

// Health check e rota principal
app.get("/health", (req, res) => res.status(200).send("ok"));
app.get("/", (req, res) => res.send("API rodando com sucesso!"));

// Iniciar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em 0.0.0.0:${PORT}`);
});
