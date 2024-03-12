const { Router, urlencoded, static } = require("express");
const session = require("express-session");
const { join: path } = require("path");

const CustomSessionStore = require("../utils/CustomSessionStore");

require("dotenv").config();

const router = Router();

router.use(
  session({
    secret: process.env.SECRET_KEY || "very_secret",
    resave: false,
    saveUninitialized: true,
    store: new CustomSessionStore({filePath: path(__dirname, "test.json")}),
  })
);
// use body parser
router.use(urlencoded({ extended: false }));
// Set EJS as static folder
router.use("/assets", static(path(__dirname, "..", "public")));

module.exports = router;
