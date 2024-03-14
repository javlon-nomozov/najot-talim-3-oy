const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");
const { getAllUsers, getUserById } = require("./user");
const { getAllGuides, getGuideById } = require("./guides");

const filePath = path(__dirname, "..", "db", "todoes.json");

// create
function addTodo(user_id, guide_id, compleated) {
  return new Promise(async (res, rej) => {
    let todoes;
    try {
      todoes = await getAllTodoes({ join: false });
    } catch (error) {
      todoes = [];
    }
    const newTodoes = { id: uuid(), user_id, guide_id, compleated };
    todoes.push(newTodoes);
    fs.writeFile(filePath, JSON.stringify(todoes), (err) => {
      if (err) {
        return rej(err);
      }
      res(newTodoes);
    });
  });
}

// create
function addManyTodoes(guide_id, user_id_list = []) {
  return new Promise(async (res, rej) => {
    let todoes;
    let newTodoes = [];
    try {
      todoes = await getAllTodoes({ join: false });
    } catch (error) {
      todoes = [];
    }
    for (let i = 0; i < user_id_list.length; i++) {
      const user_id = user_id_list[i];
      console.log({ user_id });

      const newTodoe = { id: uuid(), user_id, guide_id, compleated: false };
      newTodoes.push(newTodoe);
    }
    console.log({ todoes });
    fs.writeFile(filePath, JSON.stringify(todoes.concat(newTodoes)), (err) => {
      if (err) {
        return rej(err);
      }
      res(newTodoes);
    });
  });
}

// read
function getAllTodoes({ join } = { join: true }) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, async (err, data) => {
      if (err) {
        return rej(err);
      }
      const parsedData = JSON.parse(data.toString());
      if (join) {
        const users = {};
        (await getAllUsers()).forEach((user) => (users[user.id] = user));
        const guides = {};
        (await getAllGuides()).forEach((guide) => (guides[guide.id] = guide));
        res(
          parsedData.map((todo) => {
            todo.user = users[todo.user_id];
            todo.guide = guides[todo.guide_id];
            return todo;
          })
        );
      } else {
        res(parsedData);
      }
    });
  });
}

function getTodoById(id, { join } = { join: true }) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, async (err, data) => {
      if (err) {
        return rej(err);
      }
      const parsedData = _.filter(
        JSON.parse(data.toString()),
        (todo) => todo.id === id
      );

      for (let i = 0; i < parsedData.length; i++) {
        const todo = parsedData[i];
        const user = (await getUserById(todo.user_id))[0];
        if (!user) {
          return rej("User not found");
        }
        todo.user = user;
        const guide = (await getGuideById(todo.guide_id))[0];
        if (!guide) {
          return rej("Guide not found");
        }
        todo.guide = guide;
      }
      res(parsedData);
    });
  });
}

// update
function updateTodoById(id, { user_id, guide_id, compleated }) {
  return new Promise(async (res, rej) => {
    let todoes = await getAllTodoes({ join: false });
    let todoExist;
    todoes = todoes.map((todo) => {
      if (todo.id === id) {
        todoExist = todo;
        todo.title = title || todo.title;
        todo.content = content || todo.content;
      }
      return todo;
    });
    if (todoExist) {
      fs.writeFile(filePath, JSON.stringify(todoes), (err) => {
        if (err) {
          return rej(err);
        }
        res({ id, ...todoExist });
      });
    } else {
      return res({});
    }
  });
}

// delete
function deleteTodoById(id) {
  return new Promise(async (res, rej) => {
    let todoes = await getAllTodoes({ join: false });
    let todoExist;
    todoes = todoes.filter((el) => {
      if (el.id !== id) {
        return true;
      } else {
        todoExist = el;
      }
    });
    if (todoExist) {
      fs.writeFile(filePath, JSON.stringify(todoes), (err) => {
        if (err) {
          return rej(err);
        }
        res(todoExist);
      });
    } else {
      res({});
    }
  });
}

function deleteTodoByUserId(user_id) {
  return new Promise(async (res, rej) => {
    let todoes = await getAllTodoes({ join: false });
    let todoExist;
    todoes = todoes.filter((el) => {
      if (el.user_id !== user_id) {
        return true;
      } else {
        todoExist = el;
      }
    });
    if (todoExist) {
      fs.writeFile(filePath, JSON.stringify(todoes), (err) => {
        if (err) {
          return rej(err);
        }
        res(todoExist);
      });
    } else {
      res({});
    }
  });
}

function deleteTodoByGuideId(user_id) {
  return new Promise(async (res, rej) => {
    let todoes = await getAllTodoes({ join: false });
    let todoExist;
    todoes = todoes.filter((el) => {
      if (el.user_id !== user_id) {
        return true;
      } else {
        todoExist = el;
      }
    });
    if (todoExist) {
      fs.writeFile(filePath, JSON.stringify(todoes), (err) => {
        if (err) {
          return rej(err);
        }
        res(todoExist);
      });
    } else {
      res({});
    }
  });
}

module.exports = {
  addTodo,
  addManyTodoes,
  getAllTodoes,
  getTodoById,
  updateTodoById,
  deleteTodoById,
  deleteTodoByUserId,
  deleteTodoByGuideId,
};
