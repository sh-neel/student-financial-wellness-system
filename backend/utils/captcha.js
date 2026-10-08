const crypto = require("crypto");

function createCaptcha() {
  const a = crypto.randomInt(1, 10);
  const b = crypto.randomInt(1, 10);
  const id = crypto.randomBytes(12).toString("hex");
  return { id, question: `${a} + ${b} = ?`, answer: String(a + b) };
}

module.exports = { createCaptcha };
