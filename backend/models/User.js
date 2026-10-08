const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  studentId: { type: String, trim: true, maxlength: 40 },
  course: { type: String, trim: true, maxlength: 100 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
