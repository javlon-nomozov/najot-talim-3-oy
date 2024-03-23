const Joi = require("joi");

exports.registerUserSchem = Joi.object().keys({
  name: Joi.string().min(3).max(30).required().trim(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(4)
    .max(20)
    .required(),
});

exports.loginSchem = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.updateUserSchem = Joi.object().keys({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(20),
});
