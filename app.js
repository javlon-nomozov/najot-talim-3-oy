const express = require("express");
const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");

// Set EJS as static folder
app.use('/assets',express.static("public"));

// load data from ./lists.js
const lists = require("./lists");

// homepage
app.get("/", (req, res) => {
  res.render("index", { lists: Object.keys(lists) });
});

// product list
app.get("/:list", (req, res) => {
  const listName = req.params.list;
  const listItems = lists[listName];
  if (!listItems) {
    return res.status(404).send("List not found");
  }

  const pageSize = 4;
  const page = parseInt(req.query.page) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil(listItems.length / pageSize);
  const paginatedItems = listItems.slice(startIndex, endIndex);

  res.render("list", {
    listName,
    listItems: paginatedItems,
    page,
    totalPages,
    pageSize,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
