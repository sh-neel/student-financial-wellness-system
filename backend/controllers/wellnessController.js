const Expense = require("../models/Expense");
const Income = require("../models/Income");
const BudgetGoal = require("../models/BudgetGoal");

function monthRange(month) {
  const [year, mon] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, mon - 1, 1)),
    end: new Date(Date.UTC(year, mon, 0, 23, 59, 59, 999))
  };
}

function calculateScore(income, expenses, budgetLimit, savingsTarget) {
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.max(0, savings / income) : 0;
  const budgetUse = budgetLimit > 0 ? expenses / budgetLimit : 0;

  let score = 50;
  score += Math.min(savingsRate * 40, 25);
  if (budgetLimit > 0) {
    if (budgetUse <= 0.8) score += 20;
    else if (budgetUse <= 1) score += 5;
    else score -= Math.min((budgetUse - 1) * 50, 25);
  }
  if (savingsTarget > 0 && savings >= savingsTarget) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

exports.summary = async (req, res, next) => {
  try {
    const month = /^\d{4}-\d{2}$/.test(req.query.month || "") ? req.query.month : new Date().toISOString().slice(0, 7);
    const { start, end } = monthRange(month);

    const [incomeAgg, expenseAgg, categoryAgg, budget] = await Promise.all([
      Income.aggregate([{ $match: { user: require("mongoose").Types.ObjectId.createFromHexString(req.user.id), date: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { user: require("mongoose").Types.ObjectId.createFromHexString(req.user.id), date: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { user: require("mongoose").Types.ObjectId.createFromHexString(req.user.id), date: { $gte: start, $lte: end } } }, { $group: { _id: "$category", total: { $sum: "$amount" } } }, { $sort: { total: -1 } }]),
      BudgetGoal.findOne({ user: req.user.id, month })
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const savings = totalIncome - totalExpenses;
    const budgetLimit = budget?.limit || 0;
    const savingsTarget = budget?.savingsTarget || 0;
    const budgetPercent = budgetLimit ? Math.round((totalExpenses / budgetLimit) * 100) : 0;
    const score = calculateScore(totalIncome, totalExpenses, budgetLimit, savingsTarget);

    const recommendations = [];
    if (!totalIncome) recommendations.push("Add your income sources so your wellness score can be more accurate.");
    if (budgetLimit && budgetPercent >= 80) recommendations.push(`You have used ${budgetPercent}% of your monthly budget. Review non-essential spending.`);
    if (savings < 0) recommendations.push("Your expenses are higher than income. Reduce discretionary expenses and review your budget.");
    if (totalIncome > 0 && savings / totalIncome >= 0.2) recommendations.push("Great work! You are saving at least 20% of your recorded income.");
    if (savingsTarget > 0 && savings >= savingsTarget) recommendations.push("You have reached your monthly savings target.");

    res.json({
      success: true,
      data: {
        month,
        totalIncome,
        totalExpenses,
        savings,
        budgetLimit,
        savingsTarget,
        budgetPercent,
        wellnessScore: score,
        categories: categoryAgg,
        recommendations
      }
    });
  } catch (err) { next(err); }
};

exports.recommendations = async (req, res, next) => {
  try {
    const month = /^\d{4}-\d{2}$/.test(req.query.month || "") ? req.query.month : new Date().toISOString().slice(0, 7);
    const { start, end } = monthRange(month);

    const expenses = await Expense.find({ user: req.user.id, date: { $gte: start, $lte: end } }).lean();
    const budget = await BudgetGoal.findOne({ user: req.user.id, month }).lean();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const recommendations = [];
    if (budget && total >= budget.limit * 0.8) {
      recommendations.push({ type: "warning", message: "Spending has crossed 80% of your monthly budget." });
    }
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const largest = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    if (largest) recommendations.push({ type: "info", message: `${largest[0]} is your highest spending category this month.` });
    if (!recommendations.length) recommendations.push({ type: "success", message: "Your spending currently looks controlled. Keep tracking consistently." });

    res.json({ success: true, data: recommendations });
  } catch (err) { next(err); }
};
