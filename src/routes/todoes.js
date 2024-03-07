const {
  getAllTodoes,
  addTodo,
  getTodoById,
  deleteTodoById,
  addManyTodoes,
} = require("../models/todoes");

const { getAllUsers } = require("../models/user");
const { getAllGuides } = require("../models/guides");

const router = require("express").Router();

// all todoes
router.get("/", async (req, res) => {
  const todoes = await getAllTodoes();
    // console.log({ todoes: todoes[0] });
  res.render("todoes/list", { data: {}, todoes });
});

router.get("/create", async (req, res) => {
  const users = await getAllUsers();
  const guides = await getAllGuides();
  const data = {};
  res.render("todoes/create", { data, todo: req.body, users, guides });
});

router.post("/create", async (req, res) => {
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
  }else{
    await addManyTodoes(guide_id, (users.map(user=>user.id)))
    console.log('all');
    res.end('salom')
  }
});

router.get("/:id/delete", async (req, res) => {
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    res.render("todoes/delete", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
});

router.post("/delete", async (req, res) => {
  const todo = await deleteTodoById(req.body.id);
  if (todo.id !== 0) {
    res.redirect("/todoes");
    // res.render("todoes/delete", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
});

// get todo by id
router.get("/:id", async (req, res) => {
  const todo = await getTodoById(req.params.id);
  if (todo.length !== 0) {
    res.render("todoes/details", { data: {}, todo: todo[0] });
  } else {
    res.render("./error/404", { data: { message: "Todo Not Found" } });
  }
});

module.exports = router;
