const express = require("express");
const Joi = require("joi");

exports.createAuthorSchem = Joi.object().keys({
  name: Joi.string().min(4).max(20).required().trim(),
});

exports.editAuthorSchem = Joi.object().keys({
  name: Joi.string().min(4).max(20).trim(),
});
