const { Router, urlencoded, static } = require("express");
const session = require("express-session");
const { join: path } = require("path");

require('dotenv').config()

const router = Router();

router.use(
  session({
    secret: process.env.SECRET_KEY || 'very_secret',
    resave: false,
    saveUninitialized: true,
  })
);
// use body parser
router.use(urlencoded({ extended: false }));
// Set EJS as static folder
router.use("/assets", static(path(__dirname, "..", "public")));

module.exports = router;
