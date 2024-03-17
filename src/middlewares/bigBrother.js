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
  const { url } = req;
  if (
    url.startsWith("/users") ||
    url.startsWith("/guides") ||
    url.startsWith("/todoes")
  ) {
    req.session.lastPage = url;
  }
  res.redirect("/auth/login");
};
