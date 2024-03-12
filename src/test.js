const express = require("express");
const session = require("express-session");
const CustomSessionStore = require("./utils/CustomSessionStore");

const app = express();

// Create an instance of CustomSessionStore
const sessionStore = new CustomSessionStore({filePath:__dirname+'/session.json'});

// Use session middleware with the custom session store
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Define your routes and other middleware
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`Views: ${req.session.views}`);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
