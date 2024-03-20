const {
  getAllTodoes,
  addTodo,
  getTodoById,
  deleteTodoById,
  addManyTodoes,
  updateTodoById,
} = require("../models/todoes");
const { getAllUsers } = require("../models/user");
const { getAllGuides } = require("../models/guides");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allTodoesPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  let todoes;
  const { user } = req.session;
  if (user.role !== "admin") {
    todoes = (await getAllTodoes()).filter((todo) => todo.user_id == user.id);
    res.render("todoes/list", {
      data: { user: req.session.user },
      todoes,
      alerts,
    });
  } else {
    todoes = await getAllTodoes();
    res.render("todoes/admin/list", {
      data: { user: req.session.user },
      todoes,
      alerts,
    });
  }
};

exports.createTodoPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const users = await getAllUsers();
  const guides = await getAllGuides();
  const data = { user: req.session.user };
  res.render("todoes/admin/create", {
    data,
    todo: req.body,
    users,
    guides,
    alerts,
  });
};

exports.createTodo = async (req, res) => {
  const { user: user_id, guide: guide_id } = req.body;
  const users = await getAllUsers();
  const guides = await getAllGuides();
  if (user_id !== "all") {
    try {
      const newTodo = await addTodo(user_id, guide_id);
      req.flash.set("alerts", {
        message: "Todo is created",
        type: "success",
      });

      res.redirect(String(newTodo.id));
    } catch (error) {
      res.render("todoes/create", {
        data: { message: "Todo Not Found" },
        todo: req.body,
        users,
        guides,
      });
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
  const alerts = req.flash.get("alerts");
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    res.render("todoes/admin/delete", {
      data: { user: req.session.user },
      todo: todo[0],
      alerts,
    });
  } else {
    res.render("./error/404", {
      data: { message: "Todo Not Found" },
    });
  }
};

exports.deleteTodo = async (req, res) => {
  const todo = await deleteTodoById(req.body.id);
  if (todo.id) {
    req.flash.set("alerts", {
      message: "Todo was deleted",
      type: "success",
    });
    res.redirect("/todoes");
    // res.render("todoes/delete", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", {
      data: { message: "Todo Not Found" },
    });
  }
};

exports.getTodoPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    if (req.user.role === "admin") {
      return res.render("todoes/admin/details", {
        data: {},
        todo: todo[0],
        alerts,
      });
    }
    if (req.user.id === todo[0].user_id) {
      return res.render("todoes/details", { data: {}, todo: todo[0] });
    }
    res.status(403).send("Do not try to get others informations");
  } else {
    res.render("./error/404", {
      data: { message: "Todo Not Found" },
    });
  }
};

exports.markAsRead = async (req, res) => {
  const updadetTodo = updateTodoById(req.params.id, { compleated: true });
  if (!updadetTodo) {
    return res.status(404).render("./error/404", {
      data: { message: "Todo Not Found" },
    });
  }
  req.flash.set("alerts", {
    message: "Marked as read",
    type: "success",
  });
  res.redirect(`/todoes/${req.params.id}`);
};
