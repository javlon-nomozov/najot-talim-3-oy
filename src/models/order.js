const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "orders.json");

async function getAllOrders() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function addOrder(bookId, clientName, clientPhone, quantity, address, totalPrice) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = {};
    }

    const newOrder = {
      id: uuid(),
      bookId,
      clientName,
      clientPhone,
      quantity,
      address,
      totalPrice,
      status:"new",
    };
    orders[newOrder.id] = newOrder;

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newOrder);
    });
  });
}

async function getOrderById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await getAllOrders();
      const order = orders[id];
      if (!order) {
        return reject(new Error(`Order not found with id: ${id}`));
      }
      resolve(order);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateOrderById(id, updatedOrder) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();
    } catch (error) {
      orders = {};
    }

    if (!orders[id]) {
      return reject(new Error(`Order not found with id: ${id}`));
    }

    orders[id] = { ...orders[id], ...updatedOrder };

    fs.writeFile(filePath, JSON.stringify(orders), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(orders[id]);
    });
  });
}

async function deleteOrderById(id) {
  return new Promise(async (resolve, reject) => {
    let orders;
    try {
      orders = await getAllOrders();

      if (!orders[id]) {
        return reject(new Error(`Order not found with id: ${id}`));
      }
      const deletedOrder = { ...orders[id] };
      delete orders[id];
      fs.writeFile(filePath, JSON.stringify(orders), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedOrder);
      });
    } catch (error) {
      orders = {};
      return reject(new Error(`Order not found with id: ${id}`));
    }
  });
}


module.exports = {
  getAllOrders,
  addOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
