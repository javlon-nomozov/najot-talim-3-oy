const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const { getUserByUsername } = require("../models/user");

module.exports.loginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("./auth/login", { data: {} });
};

module.exports.login = async (req, res) => {
  const data = { message: "Incorrect password or username" };
  const { username, password } = req.body;
  const [foundUser] = await getUserByUsername(username);
  if (!foundUser || foundUser.password !== password) {
    return res.render("./auth/login", { data });
  }
  req.session.user = foundUser;
  res.redirect("/");
};

exports.logout = (req, res) => {
  req.session.user = null;
  res.redirect("/auth/login");
};
