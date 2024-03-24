const Joi = require('joi');

const commentSchema = Joi.object({
  ownerName: Joi.string(),
  content: Joi.string().required(),
  bookId: Joi.string().uuid().required(),
});

module.exports = {commentSchema};
