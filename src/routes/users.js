const router = require("express").Router();
const { addUser } = require("../models/user");

router.get("/users/create", (req, res) => {
  const data = {};
  res.render("users/create", { data });
});

router.post("/users/create", async (req, res) => {
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
    data.firstName = firstName;
    res.render("users/create", { data: { ...data, ...req.body } });
    // if (error.code === 802) {
    console.log(error);
    // }
  }
});

module.exports = router;
