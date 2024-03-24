const { join: path } = require("path");
require("dotenv").config({ path: path(__dirname, ".env") });

module.exports = {
  // Application port, hostname
  port: process.env.PORT || 3000,
  hostName: process.env.HOST_NAME || "localhost",

  // Session secret for Express sessions
  sessionSecret: process.env.SESSION_SECRET_KEY || "very_secret",

  // EJS views directory
  viewsDir: path(__dirname, "templates"),

  // Static files directory
  staticDir: path(__dirname, "public"),
};
