import express from "express";     

const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

function validateTodo(req, res, next) {
  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "" || title.length > 200) {
      return res.status(400).json({
        error: { message: "Invalid title", code: "VALIDATION_ERROR" },
      });
    }
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      error: { message: "Invalid completed value", code: "VALIDATION_ERROR" },
    });
  }

  next();
}


app.get("/api/todos", async (req, res) => {
  res.json({ items: todos, total: todos.length });
});

app.get("/api/todos/:id", async (req, res) => {
  const todo = todos.find((t) => String(t.id) === req.params.id);
  if (!todo) {
    return res.status(404).json({
      error: { message: "Todo not found", code: "NOT_FOUND" },
    });
  }
  res.json(todo);
});

app.post("/api/todos", validateTodo, async (req, res) => {
  const { title, completed = false } = req.body;

  if (!title) {
    return res.status(400).json({
      error: { message: "Title is required", code: "VALIDATION_ERROR" },
    });
  }

  const todo = { id: nextId++, title, completed };
  todos.push(todo);

  res.status(201).json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const idx = todos.findIndex((t) => String(t.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      error: { message: "Todo not found", code: "NOT_FOUND" },
    });
  }
  todos.splice(idx, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Todo API running on port ${PORT}`));
