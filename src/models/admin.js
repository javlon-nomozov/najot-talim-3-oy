const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "admins.json");

async function getAllAdmins() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "[]"));
    });
  });
}

async function addAdmin(name, username, password) {
  return new Promise(async (resolve, reject) => {
    let admins;
    try {
      admins = await getAllAdmins();
    } catch (error) {
      admins = [];
    }

    // Check if username already exists
    if (admins.some((admin) => admin.username === username)) {
      return reject(
        new Error(`Admin already exists with username: ${username}`)
      );
    }

    const newAdmin = {
      id: uuid(),
      name,
      username,
      password,
    };
    admins.push(newAdmin);

    fs.writeFile(filePath, JSON.stringify(admins), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newAdmin);
    });
  });
}

async function getAdminById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const admins = await getAllAdmins();
      const admin = admins.find((admin) => admin.id === id);
      if (!admin) {
        return reject(new Error(`Admin not found with id: ${id}`));
      }
      resolve(admin);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateAdminById(id, updatedAdmin) {
  return new Promise(async (resolve, reject) => {
    let admins;
    try {
      admins = await getAllAdmins();
    } catch (error) {
      admins = [];
    }

    const index = admins.findIndex((admin) => admin.id === id);
    if (index === -1) {
      return reject(new Error(`Admin not found with id: ${id}`));
    }

    admins[index] = { ...admins[index], ...updatedAdmin };

    fs.writeFile(filePath, JSON.stringify(admins), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(admins[index]);
    });
  });
}

async function deleteAdminById(id) {
  return new Promise(async (resolve, reject) => {
    let admins;
    try {
      admins = await getAllAdmins();
    } catch (error) {
      admins = [];
    }

    const index = admins.findIndex((admin) => admin.id === id);
    if (index === -1) {
      return reject(new Error(`Admin not found with id: ${id}`));
    }

    const deletedAdmin = admins.splice(index, 1)[0];

    fs.writeFile(filePath, JSON.stringify(admins), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(deletedAdmin);
    });
  });
}

// getAllAdmins().then((data)=>{
//   console.log(data);
// })
// addAdmin("Javlon", "asdasd", "1234").then((data) => {
//   console.log(data);
// });

// updateAdminById("5da6b775-bbf2-4dfa-8e55-f99c4d977cb6", {
//   id: "5da6b775-bbf2-4dfa-8e55-f99c4d977cb6",
//   name: "Javlon",
//   username: "user1",
//   password: "12345",
// }).then((data) => {
//   console.log(data);
// });

// deleteAdminById('5da6b775-bbf2-4dfa-8e55-f99c4d977cb6').then(
//   (data) => {
//     console.log(data);
//   }
// )

// (async () => {
//   const admins = await getAllAdmins();
//   console.log(admins);
// })();

module.exports = {
  getAllAdmins,
  addAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
