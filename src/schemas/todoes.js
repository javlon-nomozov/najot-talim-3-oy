const Joi = require("joi");

exports.createTodoeSchem = Joi.object({
  user_id: Joi.string().required(),
  guide_id: Joi.string().required(),
});

exports.updateTodoeSchem = Joi.object({
  user_id: Joi.string(),
  guide_id: Joi.string(),
  compleated: Joi.boolean(),
});
