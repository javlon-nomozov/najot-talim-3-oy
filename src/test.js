const express = require("express");
const session = require("express-session");
const app = express();
const customFlashMiddleware = require("./middlewares/customFlash");
// init routers
app.use(
  session({
    secret: process.env.SECRET_KEY || "very_secret",
    resave: false,
    saveUninitialized: true,
    // store
  })
);
app.use(customFlashMiddleware);

app.get("/", (req, res) => {
  const message = req.flash.get("err") || "Bir";
  res.send(message);
  // res.send("Home");
});
app.get("/user", (req, res) => {
  req.flash.set("err", "xatolik");
  res.send('added');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
