const { loginPage, login, logout } = require("../controllers/auth");
const { loginScheme } = require("../schemas/auth");
const validate = require("../utils/validate");

const router = require("express").Router();

router.get("/login", loginPage);
router.post("/login", validate(loginScheme,'/auth/login'), login);
router.get("/logout", logout);

module.exports = router;
