const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  copies: Joi.number().integer().min(1).required(),
  cover: Joi.string().valid("soft", "hard").required(),
  price: Joi.number().min(0).required(),
  authorId: Joi.string().required(), // Assuming authorId is a string for referencing the author
  categoryId: Joi.string().required(), // Assuming categoryId is a string for referencing the category
  image: Joi.string().uri().required(),
});

const editBookSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  copies: Joi.number().integer().min(1),
  cover: Joi.string().valid("soft", "hard"),
  price: Joi.number().min(0),
  authorId: Joi.string(), // Assuming authorId is a string for referencing the author
  categoryId: Joi.string(), // Assuming categoryId is a string for referencing the category
  image: Joi.string().uri(),
});

module.exports = { createBookSchema, editBookSchema };
