const Joi = require("joi");

exports.createUserSchem = Joi.object().keys({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  age: Joi.number().min(16).max(75).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  role: Joi.string().valid("admin", "employee").required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(20)
    .required(),
});

exports.updateUserSchem = Joi.object().keys({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  age: Joi.number().min(16).max(75),
  username: Joi.string().alphanum().min(3).max(30),
  role: Joi.string().valid("admin", "employee"),
});
