const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "orders.json");

function getAllOrders() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "[]"));
    });
  });
}

function addOrder(
  bookId,
  clientName,
  clientPhone,
  quantity,
  address,
  totalPrice,
  status
) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = [];
    }

    const newOrder = {
      id: uuid(),
      bookId,
      clientName,
      clientPhone,
      quantity: quantity || 1,
      address,
      totalPrice: totalPrice + 30000, // Assuming totalPrice is without delivery charge
      status: status || "new",
    };
    orders.push(newOrder);

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newOrder);
    });
  });
}

function getOrderById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await getAllOrders();
      const order = orders.find((order) => order.id === id);
      if (!order) {
        return reject(new Error(`Order not found with id: ${id}`));
      }
      resolve(order);
    } catch (error) {
      reject(error);
    }
  });
}

function updateOrderById(id, updatedOrder) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = [];
    }

    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return reject(new Error(`Order not found with id: ${id}`));
    }

    orders[index] = { ...orders[index], ...updatedOrder };

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(orders[index]);
    });
  });
}

function deleteOrderById(id) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = [];
    }

    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return reject(new Error(`Order not found with id: ${id}`));
    }

    const deletedOrder = orders.splice(index, 1)[0];

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(deletedOrder);
    });
  });
}

function updateOrderStatusById(id, newStatus) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = [];
    }

    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return reject(new Error(`Order not found with id: ${id}`));
    }

    orders[index].status = newStatus;

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(orders[index]);
    });
  });
}

module.exports = {
  getAllOrders,
  addOrder,
  getOrderById,
  updateOrderById,
  updateOrderStatusById,
  deleteOrderById,
};
