const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  source: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: 0.01 },
  category: {
    type: String,
    enum: ["Scholarship", "Part-time Job", "Allowance", "Freelance", "Gift", "Investment", "Other"],
    default: "Other"
  },
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model("Income", incomeSchema);
