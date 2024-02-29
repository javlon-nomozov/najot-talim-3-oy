const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "cars.json");

const validator = (car) => {
  // model, price, image, videoId
  if (car.id && !(typeof car.id === "string" || typeof car.id === "number")) {
    throw new Error("Car id should be String or Number");
  }
  if (!(typeof car.model === "string")) {
    throw new Error("Car model should be String");
  }
  if (!(typeof car.price === "number")) {
    throw new Error("Car price should be number");
  }
  if (!(typeof car.image === "string")) {
    throw new Error("Car image should be string");
  }
  if (!(typeof car.videoId === "string")) {
    throw new Error("Car videoId should be string");
  }
  if (!(typeof car.description === "string")) {
    throw new Error("Car description should be string");
  }
  return car;
};

// create
function addCar(model, price, image, videoId, description) {
  return new Promise(async (res, rej) => {
    let cars;
    try {
      const newCar = validator({
        id: uuid(),
        model,
        price,
        image,
        videoId,
        description,
      });
      try {
        cars = await getAllCars();
      } catch (error) {
        cars = [];
      }
      cars.push(newCar);
      fs.writeFile(filePath, JSON.stringify(cars), (err) => {
        if (err) {
          return rej(err);
        }
        res(newCar);
      });
    } catch (error) {
      rej(error);
    }
  });
}

// addCar("tesla Model x",200,'model-x.jpg','FjS2LzrHEO8')

// read
function getAllCars() {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(JSON.parse(data.toString()));
    });
  });
}

function getCarById(id) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(_.filter(JSON.parse(data.toString()), (car) => car.id === id));
    });
  });
}

// update
function updateCarById(id, { model, price, image, videoId, description }) {
  return new Promise(async (res, rej) => {
    try {
      const updatedCar = validator({
        id,
        model,
        price,
        image,
        videoId,
        description,
      });
      let cars = await getAllCars();
      let existGuide;
      cars = cars.filter((el) => {
        if (el.id === id) {
          existGuide = el;
        } else {
          return true;
        }
      });
      cars.push(updatedCar);
      fs.writeFile(filePath, JSON.stringify(cars), (err) => {
        if (err) {
          return rej(err);
        }
        res(updatedCar);
      });
    } catch (error) {
      rej(error);
    }
  });
}

// delete
function deleteCarById(id) {
  return new Promise(async (res, rej) => {
    try {
      let cars = await getAllCars();
      let existCar;
      cars = cars.filter((el) => {
        if (el.id === id) {
          existCar = el;
        } else {
          return true;
        }
      });
      fs.writeFile(filePath, JSON.stringify(cars), (err) => {
        if (err) {
          return rej(err);
        }
      });
      res(existCar);
    } catch (error) {
      rej(error);
    }
  });
}

module.exports = {
  addCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
};
