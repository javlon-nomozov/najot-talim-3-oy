const { loginPage, login, logout } = require("../controllers/auth");

const router = require("express").Router();

router.get('/login', loginPage)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router