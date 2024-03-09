const express = require("express");
const { join: path } = require("path");

const app = express();


// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path(__dirname, "templates"));


// init routers
app.use(require('./middlewares/index'))
app.use(require('./routes/index'))

app.use((req, res) => {
  res.render('./error/404', {data:{message:'Page Not Found'}})
  // res.send("404 error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
