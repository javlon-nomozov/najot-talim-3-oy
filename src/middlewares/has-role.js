const express = require("express");

module.exports = function (...allowedRoles) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return (req, res, next) => {
    if (allowedRoles.includes(req.session.user)) {
      return next();
    }
    res.send('Is not allowed go back to <a href="/">hamepage</a>');
  };
};
