const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const { getUserByUsername } = require("../models/users");
const { comparePasswords, hashPassword } = require("../utils/bcrypt-utilities");
const { addUser } = require("../models/users");

exports.registerPage = (req, res) => {
  if (req.session.user.role !== "guest") {
    return res.redirect("/");
  }
  const alerts = req.flash.get("alerts");
  res.render("auth/register", {
    user: {},
    alerts,
    layout: "layouts/empty-layout",
  });
};

exports.register = async (req, res) => {
  const { name, username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = await addUser(name, username, hashedPassword);

    req.flash.set("alerts", {
      message: "You are singed up successfully.",
      type: "success",
    });
    req.flash.set("alerts", {
      message: `Congratulations, ${newUser.name}! log in now!`,
      type: "success",
    });
    res.redirect("/auth/login");
  } catch (error) {
    req.flash.set("alerts", {
      message: "User already exists with this username.",
      type: "danger",
    });
    return res.redirect("/auth/register");
  }
};

module.exports.loginPage = async (req, res) => {
  if (req.session.user.role !== "guest") {
    return res.redirect("/");
  }
  const alerts = req.flash.get("alerts");
  const data = { alerts, layout: "layouts/empty-layout" };
  await res.render("auth/login", data);
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await getUserByUsername(username);
  if (!foundUser || !(await comparePasswords(password, foundUser.password))) {
    req.flash.set("alerts", {
      message: "Incorrect password or username",
      type: "danger",
    });
    return res.redirect("/auth/login");
  }
  req.session.user = foundUser;
  req.flash.set("alerts", {
    message: `You are welcome ${foundUser.name}!`,
    type: "success",
  });
  res.redirect(req.session.lastPage || "/");
};

exports.logout = (req, res) => {
  req.session.user = { role: "guest" };
  req.flash.set("alerts", { message: "Succesfully log out", type: "warning" });
  res.redirect("/auth/login");
};
