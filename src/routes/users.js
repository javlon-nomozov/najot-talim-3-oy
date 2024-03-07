const router = require("express").Router();
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../models/user");

// all users
router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.render("users/list", { data: {}, users });
});

router.get("/create", (req, res) => {
  const data = {};
  res.render("users/create", { data, user: {} });
});

router.post("/create", async (req, res) => {
  const { firstName, lastName, age, username, role, password } = req.body;
  const data = {};
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
    data.message = error;
    res.render("users/create", { data, user: req.body });
    // if (error.code === 802) {
    // console.log(error);
    // }
  }
});

router.get("/:id/delete", async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/delete", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", { data: { message: "User Not Found" } });
  }
});

router.post("/delete", async (req, res) => {
  const user = await deleteUserById(req.body.id);
  if (user.id !== 0) {
    res.redirect('/users')
    // res.render("users/delete", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", { data: { message: "User Not Found" } });
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/details", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", { data: { message: "User Not Found" } });
  }
});

// get edit by id
router.get("/:id/edit", async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user.length !== 0) {
    res.render("users/edit", { data: {}, user: user[0] });
  } else {
    res.render("./error/404", { data: { message: "User Not Found" } });
  }
});

// post edit by id
router.post("/:id/edit", async (req, res) => {
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
    res.render("./error/404", { data: { message: "User Not Found" } });
  }
});

module.exports = router;
