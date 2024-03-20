const Joi = require("joi");

exports.createTodoeSchem = Joi.object({
  user: Joi.string().required(),
  guide: Joi.string().required(),
});

exports.updateTodoeSchem = Joi.object({
  user: Joi.string(),
  guide: Joi.string(),
  compleated: Joi.boolean(),
});
