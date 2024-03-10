const {
  getAllTodoes,
  addTodo,
  getTodoById,
  deleteTodoById,
  addManyTodoes,
} = require("../models/todoes");
const { getAllUsers } = require("../models/user");
const { getAllGuides } = require("../models/guides");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allTodoesPage = async (req, res) => {
  let todoes;
  const { user } = req.session;
  if (user.role !== "admin") {
    todoes = (await getAllTodoes()).filter((todo) => todo.user_id == user.id);
  } else {
    todoes = await getAllTodoes();
  }
  res.render("todoes/list", { data: {user:req.session.user}, todoes });
};

exports.createTodoPage = async (req, res) => {
  const users = await getAllUsers();
  const guides = await getAllGuides();
  const data = {user:req.session.user};
  res.render("todoes/create", { data, todo: req.body, users, guides });
};

exports.createTodo = async (req, res) => {
  const { user: user_id, guide: guide_id } = req.body;
  const data = {};
  const users = await getAllUsers();
  const guides = await getAllGuides();
  if (user_id !== "all") {
    try {
      const newTodo = await addTodo(user_id, guide_id);
      res.redirect(String(newTodo.id));
    } catch (error) {
      data.message = error;
      res.render("todoes/create", { data, todo: req.body, users, guides });
      // if (error.code === 802) {
      // console.log(error);
      // }
    }
  } else {
    await addManyTodoes(
      guide_id,
      users.map((user) => user.id)
    );
    res.redirect("/todoes/");
  }
};

exports.deleteTodoPage = async (req, res) => {
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    res.render("todoes/delete", { data: {user:req.session.user}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
};

exports.deleteTodo = async (req, res) => {
  const todo = await deleteTodoById(req.body.id);
  if (todo.id !== 0) {
    res.redirect("/todoes");
    // res.render("todoes/delete", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
};

exports.getUserPage = async (req, res) => {
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    res.render("todoes/details", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
};
