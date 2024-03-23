const express = require("express");
const { join: path } = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const config = require("./config");

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", config.viewsDir);

// Use EJS layouts
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");

// init routers
app.use(require("./middlewares/index"));
app.use(require("./routes/index"));

app.use((req, res) => {
  res.render("./error/404", {
    data: { message: "Page Not Found" },
    layout: "layouts/empty-layout",
  });
});

app.listen(config.port, config.hostName, () => {
  console.log(`Server is running on http://${config.hostName}:${config.port}`);
});
