const mongoose = require("mongoose");

const budgetGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  limit: { type: Number, required: true, min: 0.01 },
  savingsTarget: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 300 }
}, { timestamps: true });

budgetGoalSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("BudgetGoal", budgetGoalSchema);
