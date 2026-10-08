const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/wellnessController");

router.use(auth);
router.get("/summary", controller.summary);
router.get("/recommendations", controller.recommendations);

module.exports = router;
