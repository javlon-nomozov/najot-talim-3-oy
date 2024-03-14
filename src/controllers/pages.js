const express = require("express");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.getHomePage = (req, res) => {
  // res.send("home");
  const data = { user: req.session.user };
  data.message = `Kodlarda ishlatilgan html, css qisimlari chatGPT dan olindi`;
  if (res.locals.currentUser) {
    if (res.locals.currentUser.role==='admin') {
      return res.render("index-admin", { users: [], data });
    }
  }
  res.render("index", { users: [], data });
};
