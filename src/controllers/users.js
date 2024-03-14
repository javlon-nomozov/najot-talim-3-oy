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
  res.render("users/list", { data: {}, users });
};

exports.createUserPage = (req, res) => {
  const data = {};
  res.render("users/create", { data, user: {} });
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, age, username, role, password } = req.body;
  const data = {};
  try {
    if (!checkPasswordStrength(password)) {
      data.message =
        "Weak password</br>password must conmtains min 6 characters: letters, numbers, symbols";
      return res.render("users/create", { data, user: req.body });
    }
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
    data.message = error;
    res.render("users/create", { data, user: req.body });
  }
};

exports.deleteUserPage = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/delete", {
      data: {},
      user: user[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await deleteUserById(req.body.id);
  if (user.id !== 0) {
    await deleteTodoByUserId(req.body.id);
    res.redirect("/users");
    // res.render("users/delete", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};

exports.userPage = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/details", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};

exports.editUserPage = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/edit", {
      data: {},
      user: user[0],
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
    res.redirect(`/users/${req.params.id}`);
  } else {
    res.render("./error/404", {
      data: { message: "User Not Found" },
    });
  }
};
