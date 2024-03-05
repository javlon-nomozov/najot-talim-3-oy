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
  res.send(await getAllUsers());
  console.log("req.body");
  console.log(req.body);
  // res.end();
});

// // all users
// router.get("/login", async (req, res) => {
//   res.send((await getUserByUsername(req.params.username))[0]||{});
//   console.log("req.body");
//   console.log(req.body);
//   // res.end();
// });

// router.post("/add", async (req, res) => {
//   console.log("req.body");
//   console.log(req.body);
//   const { firstName, lastName, age, role, username, password } = req.body;
//   res.send(await addUser(firstName, lastName, age, username, role, password));
//   // res.end();
// });
module.exports = router;
