const loginCheckerMid = require("../middlewares/bigBrother");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/", require("./books"));
router.use("/authors", require("./authors"));
router.use("/categories", require("./categories"));
router.use("/orders", require("./orders"));
router.use("/comments", require("./comments"));

module.exports = router;
