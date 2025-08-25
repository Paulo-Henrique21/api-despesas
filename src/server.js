// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import cookieParser from "cookie-parser";

// // Rotas
// import userRoutes from "./routes/userRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js"; // atualizada para nova lógica
// import variantRoutes from "./routes/variantRoutes.js"; // nova rota
// import paymentRoutes from "./routes/paymentRoutes.js"; // nova rota
// import demoRoutes from "./routes/demoRoutes.js"; // rotas do usuário demo

// // Serviços
// import { initializeDemoUser, scheduleDailyReset } from "./services/demoUserService.js";

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// // Conectar ao banco
// connectDB();

// // Inicializar usuário demo e agendar reset diário
// initializeDemoUser();
// scheduleDailyReset();

// // Rotas
// app.use("/api/users", userRoutes);
// app.use("/api/expenses", expenseRoutes); // inclui /monthly
// app.use("/api/variants", variantRoutes); // POST /:expenseId/variant
// app.use("/api/payments", paymentRoutes); // POST /:expenseId/pay
// app.use("/api/demo", demoRoutes); // rotas do usuário demo

// // Rota de saúde
// app.get("/", (req, res) => {
//   res.send("API rodando com sucesso!");
// });

// // Iniciar servidor
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });

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

/** 1) Segurança/proxy (para cookies Secure atrás de proxy, ex.: Render) */
app.set("trust proxy", 1);

/** 2) CORS com múltiplas origens (dev + prod) */
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // permite tools locais (sem origin) e as origins da lista
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/** 3) Conectar ao banco e só depois iniciar serviços que dependem do DB */
await connectDB();
await initializeDemoUser();

/** ⚠️ Em Render Free a instância pode dormir. Se precisar rodar todo dia,
 *  considere um Cron Job do Render chamando um endpoint, ao invés de job em memória. */
scheduleDailyReset();

/** Rotas */
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/demo", demoRoutes);

/** Health-check para o Render */
app.get("/health", (req, res) => res.status(200).send("ok"));
app.get("/", (req, res) => res.send("API rodando com sucesso!"));


/** 4) Start: usar porta do Render e bind 0.0.0.0 */
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em 0.0.0.0:${PORT}`);
});
