const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const { getUserByUsername } = require("../models/user");
const { comparePasswords } = require("../utils/bcrypt-utilities");

module.exports.loginPage = async (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  const alerts = req.flash.get("alerts");
  const data = { alerts, data: {}, layout: "layouts/empty-layout" };
  await res.render("./auth/login", data);
};

module.exports.login = async (req, res) => {
  const data = {};
  const { username, password } = req.body;
  const [foundUser] = await getUserByUsername(username);
  if (!foundUser || !(await comparePasswords(password, foundUser.password))) {
    req.flash.set("alerts", {
      message: "Incorrect password or username",
      type: "danger",
    });
    return res.redirect("/auth/login");
  }
  req.session.user = foundUser;
  res.redirect(req.session.lastPage || "/");
};

exports.logout = (req, res) => {
  req.session.user = null;
  req.flash.set("alerts", { message: "Succesfully log out", type: "warning" });
  res.redirect("/auth/login");
};
