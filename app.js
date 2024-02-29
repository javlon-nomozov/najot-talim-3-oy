const path = require("path");

const express = require("express");
const bodyParser = require('body-parser')

const { customReadFile } = require("./tools");

// initialize environmental variables
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

// initialize public folder as a static file folder
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/',(req,res)=>res.redirect('/car'))

// adding cars route
app.use('/car', require("./router/cars"));
// adding pages route
app.use('/', require("./router/pages"));

// GET: http://localhost:3000/non-exist-page
app.use( async (req, res) => {
  res
    .status(404)
    .send(
      (
        await customReadFile(path.join(__dirname, "templates", "404.html"))
      ).replaceAll(
        "${{message}}",
        "Oops! The page you're looking for doesn't exist."
      )
    );
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
