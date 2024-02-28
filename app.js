const express = require("express");

// initialize environmental variables
require("dotenv").config();

const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT;

app.use((req, res) => {
  res.send('<h1>Hellow</h1>');
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
