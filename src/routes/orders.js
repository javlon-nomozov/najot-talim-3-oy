const router = require("express").Router();
const accessCheckerMid = require("../middlewares/has-role");
const validate = require("../utils/validate");
const { orderSchema } = require("../schemas/orders");

const {
  allOrdersPage,
  createOrderPage,
  createOrder,
  changeOrderStatus,
  // deleteOrder,
} = require("../controllers/orders");

router.use("/", accessCheckerMid('admin','user'));
router.get("/", allOrdersPage);
router.get("/books", createOrderPage);
router.post("/create", validate(orderSchema), createOrder);
router.post("/:id/change-status", changeOrderStatus);
// router.post("/:id/delete", deleteOrder);
module.exports = router;
