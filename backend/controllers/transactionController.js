const Expense = require("../models/Expense");
const Income = require("../models/Income");

function buildDateFilter(from, to) {
  const filter = {};
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.date.$lte = new Date(`${to}T23:59:59.999Z`);
  }
  return filter;
}

function parseListQuery(req) {
  const { search = "", category = "", from = "", to = "", sort = "date", order = "desc", page = 1, limit = 20 } = req.query;
  const allowedSort = ["date", "amount", "title", "category"];
  const sortField = allowedSort.includes(sort) ? sort : "date";
  const direction = order === "asc" ? 1 : -1;
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  return { search, category, from, to, sortField, direction, pageNumber, limitNumber };
}

async function listTransactions(Model, req, res, next, searchFields) {
  try {
    const { search, category, from, to, sortField, direction, pageNumber, limitNumber } = parseListQuery(req);
    const filter = { user: req.user.id, ...buildDateFilter(from, to) };

    if (category) filter.category = category;
    if (search) {
      filter.$or = searchFields.map(field => ({ [field]: { $regex: search, $options: "i" } }));
    }

    const [items, total] = await Promise.all([
      Model.find(filter).sort({ [sortField]: direction }).skip((pageNumber - 1) * limitNumber).limit(limitNumber),
      Model.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (err) {
    next(err);
  }
}

exports.listExpenses = (req, res, next) => listTransactions(Expense, req, res, next, ["title", "notes", "category"]);
exports.listIncome = (req, res, next) => listTransactions(Income, req, res, next, ["source", "notes", "category"]);

exports.getExpense = async (req, res, next) => {
  try {
    const item = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.createExpense = async (req, res, next) => {
  try {
    const item = await Expense.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, message: "Expense created", data: item });
  } catch (err) { next(err); }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const item = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Expense not found" });
    res.json({ success: true, message: "Expense updated", data: item });
  } catch (err) { next(err); }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const item = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(204).send();
  } catch (err) { next(err); }
};

exports.getIncome = async (req, res, next) => {
  try {
    const item = await Income.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Income not found" });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.createIncome = async (req, res, next) => {
  try {
    const item = await Income.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, message: "Income created", data: item });
  } catch (err) { next(err); }
};

exports.updateIncome = async (req, res, next) => {
  try {
    const item = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Income not found" });
    res.json({ success: true, message: "Income updated", data: item });
  } catch (err) { next(err); }
};

exports.deleteIncome = async (req, res, next) => {
  try {
    const item = await Income.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Income not found" });
    res.status(204).send();
  } catch (err) { next(err); }
};
