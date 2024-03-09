const router = require("express").Router();

const {
  allTodoesPage,
  createTodoPage,
  createTodo,
  deleteTodoPage,
  deleteTodo,
  getUserPage,
} = require("../controllers/todoes");

// all todoes
router.get("/", allTodoesPage);

router.get("/create", createTodoPage);

router.post("/create", createTodo);

router.get("/:id/delete", deleteTodoPage);

router.post("/delete", deleteTodo);

// get todo by id
router.get("/:id", getUserPage);

module.exports = router;
