const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createCaptcha } = require("../utils/captcha");

const captchaStore = new Map();

function issueToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.getCaptcha = (req, res) => {
  const captcha = createCaptcha();
  captchaStore.set(captcha.id, { answer: captcha.answer, expires: Date.now() + 5 * 60 * 1000 });
  res.json({ success: true, captcha: { id: captcha.id, question: captcha.question } });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, course, captchaId, captchaAnswer } = req.body;

    if (!name || !email || !password || !captchaId || captchaAnswer === undefined) {
      return res.status(400).json({ success: false, message: "Name, email, password and CAPTCHA are required" });
    }

    const challenge = captchaStore.get(captchaId);
    captchaStore.delete(captchaId);

    if (!challenge || challenge.expires < Date.now() || String(captchaAnswer).trim() !== challenge.answer) {
      return res.status(400).json({ success: false, message: "Invalid or expired CAPTCHA" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      studentId,
      course
    });

    const token = issueToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, studentId: user.studentId, course: user.course }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = issueToken(user);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, studentId: user.studentId, course: user.course }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
