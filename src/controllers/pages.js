exports.getHomePage = (req, res) => {
  // res.send("home");
  const data = { user: req.session.user };
  data.message = `Kodlarda ishlatilgan html, css qisimlari chatGPT dan olindi`;
  res.render("index", { users: [], data });
};
