const router = require("express").Router();
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../models/user");

router.post("/register", async (req, res) => {
  console.log("req.body");
  console.log(req.body);
  const { firstName, lastName, age, username, password } = req.body;
  res.send(await addUser(firstName, lastName, age, username, 'user', password));
  res.end();
});
module.exports = router;
