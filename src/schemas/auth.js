const express = require("express");
const Joi = require("joi");
exports.loginScheme = Joi.object().keys({
  username: Joi.string().min(4).max(20).required(),
  password: Joi.string().min(6).max(25).required(),
});
