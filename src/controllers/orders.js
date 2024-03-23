const express = require("express");
const { getBookById, getAllBooks, updateBookById } = require("../models/book");
const {
  addOrder,
  getOrderById,
  getAllOrders,
  updateOrderById,
} = require("../models/order");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.allOrdersPage = async (req, res, next) => {
  books = await getAllBooks();
  const alerts = req.flash.get("alerts");
  const orders = Object.values(await getAllOrders());
  orders.forEach((order) => {
    order.bookTitle = books[order.bookId].title;
  });
  res.render("orders/list", { orders, alerts });
};

exports.createOrderPage = (req, res, next) => {
  const alerts = req.flash.get("alerts");
  const { bookId, quantity } = req.query;

  //   const alerts = req.flash.get("alerts");
  //   res.render("orders/create", { guide: {}, alerts, });
  res.render("orders/create", {
    order: {},
    alerts,
    user: req.user,
    bookId,
    quantity,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.createOrder = async (req, res) => {
  //   const {  } = req.query;
  const { bookId, clientName, clientPhone, quantity, address, status } =
    req.body;
  try {
    const book = await getBookById(bookId);
    if (book.copies < quantity) {
      req.flash.set("alerts", {
        typeof: "danger",
        message: "The amount of books is not enough. try to sell less books.",
      });
      return res.redirect(`/`)
    } else if (book && book.copies) {
      const totalPrice = quantity * book.price + 30000;
      const newOrder = await addOrder(
        bookId,
        clientName,
        clientPhone,
        quantity,
        address,
        totalPrice,
        status
      );
      console.log(bookId, { copies: book.copies - quantity });
      console.log(await updateBookById(bookId, { copies: book.copies - quantity }));
      req.flash.set("alerts", {
        type: "success",
        message: "Order created successfully",
      });
      return res.redirect("/");
    }else {
      req.flash.set("alerts", {
        type: "danger",
        message: "Unnown error occured.",
      });
      return res.redirect("/");
    }
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error });
    res.redirect(`/orders/create/?bookId=${bookId}&quantity=${quantity}`);
  }
};

exports.changeOrderStatus = async (req, res, next) => {
  const { id: orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await getOrderById(orderId);
    if (order) {
      if (order.status === "completed") {
        req.flash.set("alerts", {
          type: "danger",
          message: "Order already completed you can not edit it again",
        });
        return res.redirect(`/orders`);
      }
      const newOrder = await updateOrderById(orderId, { status });
      req.flash.set("alerts", {
        type: "success",
        message: "Order status changed successfully",
      });
      res.redirect("/orders");
    }
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error });
    res.redirect(`/orders`);
  }
};
