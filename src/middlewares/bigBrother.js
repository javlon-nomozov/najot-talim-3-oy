// 😁
const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

module.exports = (req, res, next) => {
  if (req.session.user.role!== "guest") {
    return next();
  }
  // const { url } = req;
  // if (
  //   url.startsWith("/auth") ||
  //   url.startsWith("/authors") ||
  //   url.startsWith("/authors") ||
  //   url.startsWith("/authors") ||
  //   url.startsWith("/categories")
  // ) {
  //   req.session.lastPage = url;
  // }
  res.redirect("/auth/login");
};
