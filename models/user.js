const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "users.json");

// create
function addUser(firstName, lastName, age) {
  return new Promise(async (res, rej) => {
    let users;
    try {
      users = await getAllUsers();
    } catch (error) {
      users = [];
    }
    const newUser = { id: uuid(), firstName, lastName, age };
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) {
        return rej(err);
      }
      res(newUser);
    });
  });
}

// read
function getAllUsers() {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(JSON.parse(data.toString()));
    });
  });
}

function getUserById(id) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(_.filter(JSON.parse(data.toString()), (user) => user.id === id));
    });
  });
}

// update
function updateUserById(id, { firstName, lastName, age }) {
  return new Promise(async (res, rej) => {
    let users = await getAllUsers();
    let userExist;
    users = users.filter((el) => {
      if (el.id !== id) {
        return true;
      } else {
        userExist = true;
      }
    });
    if (userExist) {
      const updatedUser = { id, firstName, lastName, age };
      users.push(updatedUser);
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          return rej(err);
        }
        res(updatedUser);
      });
    } else {
      return false;
    }
  });
}

// delete
function deleteUserById(id) {
  return new Promise(async (res, rej) => {
    let users = await getAllUsers();
    let userExist;
    users = users.filter((el) => {
      if (el.id !== id) {
        return true;
      } else {
        userExist = el;
      }
    });
    if (userExist) {
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          return rej(err);
        }
        res(userExist);
      });
    } else {
      return false;
    }
  });
}

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
