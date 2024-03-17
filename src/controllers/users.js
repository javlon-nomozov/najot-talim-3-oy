const checkPasswordStrength = require("../utils/password-checher");
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../models/user");
const { deleteTodoByUserId } = require("../models/todoes");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allUsersPage = async (req, res) => {
  const users = await getAllUsers();
  res.render("users/admin/list", { data: {}, users });
};

exports.createUserPage = (req, res) => {
  const data = {};
  res.render("users/admin/create", { data, user: {} });
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, age, username, role, password } = req.body;
  try {
    const newUser = await addUser(
      firstName,
      lastName,
      age,
      username.toLowerCase(),
      role,
      password
    );
    res.redirect(String(newUser.id));
  } catch (error) {
    res.render("users/admin/create", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};

exports.deleteUserPage = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/admin/delete", {
      data: {},
      user: user[0],
    });
  } else {
    res.render("./error/404", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await deleteUserById(req.body.id);
  if (user.id !== 0) {
    await deleteTodoByUserId(req.body.id);
    res.redirect("/users");
    // res.render("users/admin/delete", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};

exports.userPage = async (req, res) => {
  if (req.user.role === "admin") {
    const user = await getUserById(req.params.id);
    if (user.length !== 0) {
      return res.render("users/admin/details", { data: {}, user: user[0] });
    } else {
      res.render("./error/404", {
        alerts: [{ message: "User Not Found", type: "warning" }],
      });
    }
  } else if (req.params.id === req.user.id) {
    const user = await getUserById(req.params.id);
    res.render("users/details", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};

exports.editUserPage = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/admin/edit", {
      data: {},
      user: user[0],
    });
  } else {
    res.render("./error/404", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};

exports.editUser = async (req, res) => {
  const { firstName, lastName, age, role, username } = req.body;
  const user = await updateUserById(req.params.id, {
    firstName,
    lastName,
    age,
    role,
    username,
  });
  if (user.id) {
    res.redirect(`/users/${req.params.id}`);
  } else {
    res.render("./error/404", {
      alerts: [{ message: "User Not Found", type: "warning" }],
    });
  }
};
