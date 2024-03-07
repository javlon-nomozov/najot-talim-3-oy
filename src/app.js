const express = require("express");
const { join: path } = require("path");

const app = express();

// importing routers
const pages = require('./routes/pages')
const users = require('./routes/users')
const guides = require('./routes/guides')

// use body parser
app.use(express.urlencoded({ extended: false }));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path(__dirname, "templates"));

// Set EJS as static folder
app.use("/assets", express.static(path(__dirname, "public")));

// init routers
app.use(require('./routes/index'))
// app.use('/users',users)
// app.use('/guides',guides)

app.use((req, res) => {
  res.render('./error/404', {data:{message:'Page Not Found'}})
  // res.send("404 error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
