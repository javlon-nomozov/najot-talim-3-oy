const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "users.json");

// create
function addUser(firstName, lastName, age, username, role, password) {
  return new Promise(async (res, rej) => {
    let users;
    try {
      users = await getAllUsers();
    } catch (error) {
      users = [];
    }

    // Check if username already exists
    if (users.some((user) => user.username === username)) {
      const error = new Error(
        `User already exist with this username: ${username}`
      );
      error.code = 802;
      return rej(error);
    }

    const newUser = {
      id: uuid(),
      firstName,
      lastName,
      age,
      username,
      role,
      password,
    };
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) {
        err.code = 801;
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
        err.code = 801;
        return rej(err);
      }
      console.log({ data: data.toString() });
      res(JSON.parse(data.toString()||'[]'));
    });
  });
}

function getUserById(id) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        err.code = 801;
        return rej(err);
      }
      res(_.filter(JSON.parse(data.toString()), (user) => user.id === id));
    });
  });
}

// update
function updateUserById(
  id,
  { firstName, lastName, age, username, role, password }
) {
  return new Promise(async (res, rej) => {
    let users = await getAllUsers();
    let userExist;
    users = users.map((user) => {
      if (user.id === id) {
        userExist = true;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        user.username = username || user.username;
        user.role = role || user.role;
        user.password = password || user.password;
      }
      return user;
    });
    if (userExist) {
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          err.code = 801;
          return rej(err);
        }
        res({ id, firstName, lastName, age, username, role, password });
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
          err.code = 801;
          return rej(err);
        }
        res(userExist);
      });
    } else {
      return false;
    }
  });
}

// addUser("Javlon", "Nomozov", 21, "great_lvl", 'admin', "123").then((data) =>
//   console.log(data)
// );

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
