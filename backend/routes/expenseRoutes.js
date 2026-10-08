const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/transactionController");

router.use(auth);
router.get("/", controller.listExpenses);
router.get("/:id", controller.getExpense);
router.post("/", controller.createExpense);
router.put("/:id", controller.updateExpense);
router.delete("/:id", controller.deleteExpense);

module.exports = router;
