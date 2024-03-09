const { loginPage, login } = require("../controllers/auth");

const router = require("express").Router();

router.get('/login', loginPage)
router.post('/login', login)

module.exports = router