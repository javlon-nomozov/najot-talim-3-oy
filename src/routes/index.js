const router = require("express").Router();

router.use(require("./pages"));
router.use("/users", require("./users"));
router.use("/guides", require("./guides"));
router.use("/todoes", require("./todoes"));

module.exports = router;
