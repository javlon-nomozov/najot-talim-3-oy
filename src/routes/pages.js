const router = require("express").Router();

// homepage
router.get("/", (req, res) => {
  // res.send("home");
  const data = {};
  data.message = `Kodlarda ishlatilgan html, css qisimlarini va mahsulotlar ro'yxatlari
    chatGPT dan olindi <br />Mentorimiz Arraylarni chatGPT dan olishimiz
    mumkunligini aytgandilar darsda, lekin html va css kodlar haqida
    aytmagan `;
  res.render("index", { users: [], data });
});

module.exports = router;
