import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    month: { type: String, required: true }, // Ex: "2025-06"
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    method: { type: String, default: "" },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "pending", "failed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
