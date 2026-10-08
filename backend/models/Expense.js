const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: 0.01 },
  category: {
    type: String,
    enum: ["Tuition", "Rent", "Food", "Books", "Transport", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
    default: "Other"
  },
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
