const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/transactionController");

router.use(auth);
router.get("/", controller.listIncome);
router.get("/:id", controller.getIncome);
router.post("/", controller.createIncome);
router.put("/:id", controller.updateIncome);
router.delete("/:id", controller.deleteIncome);

module.exports = router;
