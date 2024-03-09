const { getHomePage } = require("../controllers/pages");

const router = require("express").Router();

// homepage
router.get("/", getHomePage);

module.exports = router;
