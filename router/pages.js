const router = require("express").Router();
const path = require("path");

const { customReadFile, readPartial } = require("../tools");

// GET: http://localhost:3000/about
router.get("/about", async (req, res) => {
  try {
    let content = "";
    content += await readPartial("start.html");
    content += await readPartial("header.html");
    content += '<main><section class="about">';
    content += `
      <main><section class="about">
        <h2>Our Story</h2>
        <p>This website made for educational purpose, by Javlon Nomozov at Najot Ta'lim education center to hometask</br>To visit github accaunt click this:</br></br>
        <a href="https://github.com/javlon-nomozov" target="_blank" class="btn edit">Button</a></p>
      </section></main>
      `;
    content += '</section"></main>';
    content += await readPartial("end.html");
    res.send(content.replaceAll("${{title}}", "About"));
  } catch (error) {
    res
      .status(500)
      .send(
        (
          await customReadFile(
            path.join(__dirname, "..", "templates", "500.html")
          )
        ).replaceAll("${{message}}", error)
      );
  }
});

module.exports = router;
