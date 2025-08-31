import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "despesas";

  if (!uri) {
    console.error("❌ MONGODB_URI/MONGO_URI não definidos");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
}
