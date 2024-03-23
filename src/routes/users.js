const router = require("express").Router();
const validate = require("../utils/validate");
const { createUserSchem, updateUserSchem } = require("../schemas/users");

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
const accessCheckerMid = require("../middlewares/has-role");

router.get("/", allUsersPage);
router.get("/create", createUserPage);
router.post(
  "/create",

  validate(createUserSchem, "/users/create"),
  createUser
);
router.get("/:id/delete", deleteUserPage);
router.post("/delete", deleteUser);
router.get("/:id/edit", editUserPage);
router.post("/:id/edit", validate(updateUserSchem, "/users"), editUser);
router.get("/:id", userPage);

module.exports = router;
