const express = require("express");
const { join: path } = require("path");

const app = express();

// importing routers
const users = require("./routes/users");
const auth = require("./routes/auth");

// use body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// Set EJS as static folder
app.use("/assets", express.static(path(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path(__dirname,"../front/index.html"));
});


app.use("/auth", auth);
app.use("/users", users);
// app.use((req, res) => {
//   res.render('./error/404', {data:{message:'Page Not Found'}})
//   // res.send("404 error");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
