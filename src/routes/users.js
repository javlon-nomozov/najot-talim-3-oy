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
const accessChecherMid = require("../middlewares/has-role");

router.get("/", accessChecherMid("admin"), allUsersPage);
router.get("/create", accessChecherMid("admin"), createUserPage);
router.post(
  "/create",
  accessChecherMid("admin"),
  validate(createUserSchem,'/users/create'),
  createUser
);
router.get("/:id/delete", accessChecherMid("admin"), deleteUserPage);
router.post("/delete", accessChecherMid("admin"), deleteUser);
router.get("/:id/edit", accessChecherMid("admin"), editUserPage);
router.post(
  "/:id/edit",
  accessChecherMid("admin"),
  validate(updateUserSchem,'/users'),
  editUser
);
router.get("/:id", userPage);

module.exports = router;
