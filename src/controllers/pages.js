const express = require("express");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.getHomePage = (req, res) => {
  const alerts = req.flash.get("alerts");
  if (res.locals.currentUser) {
    if (res.locals.currentUser.role === "admin") {
      return res.render("index-admin", { alerts });
    }
  }
  res.render("index", { alerts });
};
