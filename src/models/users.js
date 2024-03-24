const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "users.json");

async function addUser(name, username, password) {
  return new Promise(async (resolve, reject) => {
    let users;
    try {
      users = await getAllUsers();
    } catch (error) {
      users = {};
    }

    // Check if username already exists
    if (Object.values(users).some((user) => user.username === username)) {
      return reject(
        new Error(`User already exists with username: ${username}`)
      );
    }

    const newUser = {
      id: uuid(),
      name,
      username,
      password,
      role: "user",
    };
    users[newUser.id] = newUser;

    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newUser);
    });
  });
}

async function getAllUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function getUserById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await getAllUsers();
      const user = users[id];
      if (!user) {
        return reject(new Error(`User not found with id: ${id}`));
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

async function getUserByUsername(username) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await getAllUsers();
      const user = Object.values(users).filter((user) => user.username === username)[0];
      if (!user) {
        return reject(new Error(`User not found with username: ${username}`));
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateUserById(id, updatedUser) {
  return new Promise(async (resolve, reject) => {
    let users;
    try {
      users = await getAllUsers();
      // Check if username already exists
      if (Object.values(users).some((user) => user.username === username)) {
        return reject(
          new Error(`User already exists with username: ${username}`)
        );
      }
    } catch (error) {
      return reject(new Error(`User not found with id: ${id}`));
    }
    if (!users[id]) {
      return reject(new Error(`User not found with id: ${id}`));
    }

    users[id] = { ...users[id], ...updatedUser };

    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(users[id]);
    });
  });
}

async function deleteUserById(id) {
  return new Promise(async (resolve, reject) => {
    let users;
    try {
      users = await getAllUsers();

      if (!users[id]) {
        return reject(new Error(`User not found with id: ${id}`));
      }
      const deletedUser = { ...users[id] };
      delete users[id];
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedUser);
      });
    } catch (error) {
      users = {};
      return reject(new Error(`User not found with id: ${id}`));
    }
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUserById,
  deleteUserById,
};
