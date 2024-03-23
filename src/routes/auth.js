// const { loginPage, login, logout } = require("../controllers/auth");
const {
  registerPage,
  register,
  loginPage,
  login,
  logout
} = require("../controllers/auth");
const { registerUserSchem, loginSchem } = require("../schemas/users");
const validate = require("../utils/validate");

const router = require("express").Router();

router.get("/login", loginPage);
router.post("/login", validate(loginSchem, "/auth/login"), login);
router.get("/register", registerPage);
router.post(
  "/register",
  validate(registerUserSchem, "/auth/register"),
  register
);
router.post("/logout", logout);

module.exports = router;
