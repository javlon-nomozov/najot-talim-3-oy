const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");
const { getAllGuides } = require("./guides");

function getAllTodoes({ join } = { join: true }) {
  return new Promise((res, rej) => {
    fs.readFile(
      path(__dirname, "..", "db", "todoes.json"),
      async (err, data) => {
        if (err) {
          return rej(err);
        }
        const parsedData = JSON.parse(data.toString());
        // console.log({users});
        if (join) {
          const users = {};
          (await getAllUsers()).forEach((user) => (users[user.id] = user));
          const guides = {};
          (await getAllGuides()).forEach((guide) => (guides[guide.id] = guide));
          res(
            parsedData.map((todo) => {
              todo.user = users[todo.user_id];
              todo.guide = guides[todo.guide_id];
              return todo;
            })
          );
        } else {
          res(parsedData);
        }
      }
    );
  });
}

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
      res(JSON.parse(data.toString() || "[]"));
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


function getUserByUsername(username) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        err.code = 801;
        return rej(err);
      }
      res(_.filter(JSON.parse(data.toString()), (user) => user.username === username));
    });
  });
}

// update
function updateUserById(id, updatedUser) {
  return new Promise(async (res, rej) => {
    let users = await getAllUsers();
    let userExist;
    users = users.map((user) => {
      if (user.id === id) {
        userExist = user;
        user.firstName = updatedUser.firstName || user.firstName;
        user.lastName = updatedUser.lastName || user.lastName;
        user.age = updatedUser.age || user.age;
        user.username = updatedUser.username || user.username;
        user.role = updatedUser.role || user.role;
      }
      return user;
    });
    if (userExist) {
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          err.code = 801;
          return rej(err);
        }
        res({ id, ...userExist });
      });
    } else {
      return res({});
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
  getUserByUsername,
  updateUserById,
  deleteUserById,
};
