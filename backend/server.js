require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: false
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/wellness", wellnessRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value already exists" });
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)))
    .catch(err => {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    });
}

module.exports = app;
