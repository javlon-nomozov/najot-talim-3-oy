const checkPasswordStrength = require("../utils/password-checher");
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../models/user");
const { deleteTodoByUserId } = require("../models/todoes");
const { hashPassword } = require("../utils/bcrypt-utilities");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allUsersPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const users = await getAllUsers();
  res.render("users/admin/list", { data: {}, users, alerts });
};

exports.createUserPage = (req, res) => {
  const alerts = req.flash.get("alerts");
  const data = {};
  res.render("users/admin/create", { data, user: {}, alerts });
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, age, username, role, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = await addUser(
      firstName,
      lastName,
      age,
      username.toLowerCase(),
      role,
      hashedPassword
    );
    req.flash.set("alerts", {
      message: "User is created",
      type: "success",
    });
    res.redirect(String(newUser.id));
  } catch (error) {
    res.render("users/admin/create", {
      data: { message: "User Not Found" },
    });
  }
};

exports.deleteUserPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/admin/delete", {
      data: {},
      user: user[0],
      alerts,
    });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
      alerts,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await deleteUserById(req.body.id);
  if (user.id !== 0) {
    await deleteTodoByUserId(req.body.id);
    req.flash.set("alerts", {
      message: "User was deleted",
      type: "success",
    });
    res.redirect("/users");
    // res.render("users/admin/delete", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};

exports.userPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  if (req.user.role === "admin") {
    const user = await getUserById(req.params.id);
    if (user.length !== 0) {
      return res.render("users/admin/details", {
        data: {},
        user: user[0],
        alerts,
      });
    } else {
      res.render("./error/404", {
        data: { message: "User Not Found" },
      });
    }
  } else if (req.params.id === req.user.id) {
    const user = await getUserById(req.params.id);
    res.render("users/details", { data: {}, user: user[0], alerts });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};

exports.editUserPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/admin/edit", {
      data: {},
      user: user[0],
      alerts,
    });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
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
    req.flash.set("alerts", {
      message: "User was updated",
      type: "success",
    });
    res.redirect(`/users/${req.params.id}`);
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};
