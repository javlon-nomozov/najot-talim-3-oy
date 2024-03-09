const router = require("express").Router();
const {
  allUsersPage,
  createUserPage,
  createUser,
  deleteUserPage,
  deleteUser,
  editUserPage,
  editUser,
  userPage,
} = require("../controllers/users");

// all users
router.get("/", allUsersPage);

router.get("/create", createUserPage);

router.post("/create", createUser);

router.get("/:id/delete", deleteUserPage);

router.post("/delete", deleteUser);

// get user by id
router.get("/:id", userPage);

// get edit by id
router.get("/:id/edit", editUserPage);

// post edit by id
router.post("/:id/edit", editUser);

module.exports = router;
