import mongoose from "mongoose";

const expenseVariantSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    month: { type: String, required: true }, // Ex: "2025-06"
    name: String,
    description: String,
    amount: Number,
    dueDay: Number,
    category: String,
    paymentStatus: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ExpenseVariant", expenseVariantSchema);
