const express = require("express");

module.exports = function (...allowedRoles) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return (req, res, next) => {
    if (allowedRoles.includes(req.session?.user?.role)) {
      return next();
    }
    req.flash.set("alerts", {
      message: `You are not allowed page: ${req.originalUrl}`,
      type: "danger",
    });

    res.redirect("/");
  };
};
