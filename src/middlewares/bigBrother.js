// 😁
const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

module.exports = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  // req.loggedIn = true
  req.lastPage = req.url;
  res.redirect("/auth/login");
};
