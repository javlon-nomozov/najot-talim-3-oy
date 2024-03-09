exports.getHomePage = (req, res) => {
    // res.send("home");
    const data = {};
    data.message = `Kodlarda ishlatilgan html, css qisimlari chatGPT dan olindi`;
    res.render("index", { users: [], data });
  }