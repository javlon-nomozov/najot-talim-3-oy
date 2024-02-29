const path = require("path");

const { customReadFile, readPartial } = require("../tools");
const {
  getAllCars,
  getCarById,
  addCar,
  updateCarById,
  deleteCarById,
} = require("../models/cars");

const router = require("express").Router();

// GET: http://localhost:3000
router.get("/", async (req, res) => {
  try {
    const cars = await getAllCars();
    let content = "";
    content += await readPartial("start.html");
    content += await readPartial("header.html");
    content += '<main><section class="car-list">';
    cars.forEach((el) => {
      content += `
    <div class="car-box">
    <a href="/car/${el.id}">
        <img src="${el.image}" alt="${el.model}"/>
        <h2 >${el.model}</h2>
        <p>${
          el.description.length < 70
            ? el.description
            : el.description.slice(0, 75) + "......"
        }</p></a></br>
      <a href="/car/edit/${el.id}" class="btn edit">Edit</a>
      <form action="/car/delete" method="post">
      <input type="hidden" name="id" value="${
        el.id
      }"><button type="submit" class="btn delete">Delete</button>
      </form></div>
      `;
    });
    content += '</section"></main>';
    content += await readPartial("end.html");
    res.send(content.replaceAll("${{title}}", "Home"));
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


// GET: http://localhost:3000/car/add
router.get("/add", async (req, res) => {
  try {
    let content = "";
    content += await readPartial("start.html");
    content += await readPartial("header.html");
    content += (await readPartial("car-form.html")).replaceAll(
      "${{action}}",
      "/car/add"
    );
    content += await readPartial("end.html");
    res.send(
      content
        .replaceAll("${{title}}", "Add new Car")
        .replaceAll("${{model}}", "")
        .replaceAll("${{image}}", "")
        .replaceAll("${{videoId}}", "")
        .replaceAll("${{description}}", "")
        .replaceAll("${{price}}", "")
    );
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

// POST: http://localhost:3000/car/add
router.post("/add", async (req, res) => {
  try {
    const { model, price, image, videoId, description } = req.body;
    const { id: carId } = await addCar(
      model,
      Number(price),
      image,
      videoId,
      description
    );
    await res.redirect(`/car/${carId}`);
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

// GET: http://localhost:3000/car/edit/123
router.get("/edit/:id", async (req, res) => {
  try {
    const { id: carId } = req.params;
    const [car] = await getCarById(carId);
    if (!car) {
      res
        .status(404)
        .send(
          (
            await customReadFile(
              path.join(__dirname, "..", "templates", "404.html")
            )
          ).replaceAll("${{message}}", "The car does not exist with id" + carId)
        );
    } else {
      let content = "";
      content += await readPartial("start.html");
      content += await readPartial("header.html");
      content += (await readPartial("car-form.html")).replaceAll(
        "${{action}}",
        "/car/edit/" + car.id
      );
      content += await readPartial("end.html");
      res.send(
        content
          .replaceAll("${{title}}", "Edit" + car.model)
          .replaceAll("${{model}}", car.model)
          .replaceAll("${{image}}", car.image)
          .replaceAll("${{videoId}}", car.videoId)
          .replaceAll("${{description}}", car.description)
          .replaceAll("${{price}}", car.price)
      );
    }
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

// POST: http://localhost:3000/car/edit/123
router.post("/edit/:id", async (req, res) => {
  try {
    const { model, price, image, videoId, description } = req.body;
    const { id: carId } = req.params;
    await updateCarById(carId, {
      model,
      price: Number(price),
      image,
      videoId,
      description,
    });
    await res.redirect(`/car/${carId}`);
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

// POST: http://localhost:3000/car/edit/123
router.post("/delete", async (req, res) => {
  try {
    const { id: carId } = req.body;
    await deleteCarById(carId);
    await res.redirect(`/`);
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

// GET: http://localhost:3000/car/123
router.get("/:id", async (req, res) => {
  try {
    const { id: carId } = req.params;
    const [car] = await getCarById(carId);
    if (!car) {
      res
        .status(500)
        .send(
          (
            await customReadFile(
              path.join(__dirname, "..", "templates", "500.html")
            )
          ).replaceAll("${{message}}", "The car does not exist with id" + carId)
        );
    } else {
      let content = "";
      content += await readPartial("start.html");
      content += await readPartial("header.html");
      // content += '';
      content += `
      <main>
      <div class="car-info">
          <h1>${car.model}</h1></br>
          <p>price: $${car.price}</p></br>
          <a href="/car/edit/${car.id}" class="btn edit">Edit</a>
          <form action="/car/delete" method="post">
          <input type="hidden" name="id" value="${car.id}"><button type="submit" class="btn delete">Delete</button>
          </form>
          <p>description:
            ${car.description}
          </p></br>
        </div></br>
      <section class="car-detail">
      <div id="ytplayer"></div>
      `;
      content += '</section"></main>';
      content += `<script>${(
        await customReadFile(
          path.join(__dirname, "..", "public", "car-video-bg.js")
        )
      ).replaceAll("${{videoId}}", car.videoId)}</script>`;
      content += await readPartial("end.html");
      res.send(content.replaceAll("${{title}}", car.model));
    }
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
