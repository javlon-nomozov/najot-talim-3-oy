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
      // users = {};
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
      console.log(`after deleting user with id:${id}`, users);
      console.log(`deleted user:`, deletedUser);
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

// getAllUsers().then((data)=>{
//   console.log(data);
// })

// addUser("Javlon", "ussee", "1234").then((data) => {
//   console.log(data);
// });

// updateUserById("5962a87e-358a-4b3b-9ef2-7db7c59943ee", {
//   // id: "5da6b775-bbf2-4dfa-8e55-f99c4d977cb6",
//   name: "Javlon",
//   username: "user1",
//   password: "12345",
// }).then((data) => {
//   console.log(data);
// });

// deleteUserById("5962a87e-358a-4b3b-9ef2-7db7c59943ee").then((data) => {
//   console.log(data);
// });

// (async () => {
//   const users = await getAllUsers();
//   console.log(users);
// })();

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUserById,
  deleteUserById,
};
