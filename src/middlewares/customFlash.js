const express = require("express");
const customFlashUtil = require("../utils/custom-flash-messanger");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = (req, res, next) => {
  req.flash = customFlashUtil
  next();
};
