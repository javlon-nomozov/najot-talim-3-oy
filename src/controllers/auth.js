const express = require("express");
const { getUserById, getUserByUsername } = require("../models/user");
/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

module.exports.loginPage = (req, res) => {
  res.render("./auth/login", { data: {} });
};

module.exports.login = async (req, res) => {
  const data = { message: "Incorrect password or username" };
  console.log(req.body);
  const { username, password } = req.body;
  const foundUser = await getUserByUsername(username);
  console.log(foundUser, foundUser.password !== password);
  if (!foundUser || foundUser.password !== password) {
    res.render("./auth/login", { data });
  }
  res.end();
};
