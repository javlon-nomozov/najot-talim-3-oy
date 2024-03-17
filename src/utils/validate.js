const express = require("express");
const Joi = require("joi");

module.exports = function validate(schema, errorPath) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log(error);
      try {
        error.details.forEach((el) => {
          req.flash.set("alerts", {
            message: el.message,
            type: "danger",
          });
        });
        // req.flash.set("alerts", {
        //   message: error.details[0].message,
        //   type: "danger",
        // });
      } catch (error) {
        req.flash.set("alerts", {
          message: error,
          type: "danger",
        });
      }
      return res.redirect(errorPath || "/");
    }
    req.body = { ...req.body, ...value };
    next();
  };
};
