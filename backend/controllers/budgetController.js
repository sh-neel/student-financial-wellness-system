const BudgetGoal = require("../models/BudgetGoal");

exports.list = async (req, res, next) => {
  try {
    const budgets = await BudgetGoal.find({ user: req.user.id }).sort({ month: -1 });
    res.json({ success: true, data: budgets });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const budget = await BudgetGoal.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, message: "Budget created", data: budget });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const budget = await BudgetGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found" });
    res.json({ success: true, message: "Budget updated", data: budget });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const budget = await BudgetGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found" });
    res.status(204).send();
  } catch (err) { next(err); }
};
