const {
  getAllUsers,
  getUserById,
  deleteUserById
} = require("../models/users");
const { hashPassword } = require("../utils/bcrypt-utilities");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allUsersPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const users = await getAllUsers();
  res.render("users/list", { users, alerts });
};

exports.deleteUserPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("auth/admin/delete", {
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
