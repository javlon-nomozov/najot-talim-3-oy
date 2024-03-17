const Joi = require("joi");

exports.createGuideSchem = Joi.object().keys({
  title: Joi.string().required().trim(),
  content: Joi.string().min(4).required().max(3000),
  send_others: Joi.boolean().required(),
});

exports.updateGuideSchem = Joi.object().keys({
  title: Joi.string().trim(),
  content: Joi.string().min(4).max(3000),
});
