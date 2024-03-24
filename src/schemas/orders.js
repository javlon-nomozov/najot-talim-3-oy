const Joi = require("joi");

// Define the schema for the Order model
const orderSchema = Joi.object({
  bookId: Joi.string().required(),
  clientName: Joi.string().required(),
  clientPhone: Joi.string().required(),
  quantity: Joi.number().default(1),
  address: Joi.string().required(),
});

changeOrderStatus = Joi.object({
  status: Joi.string().valid(
    "new",
    "accepted",
    "on_way",
    "completed",
    "cancelled"
  ).required(),
});

module.exports = { orderSchema, changeOrderStatus };
