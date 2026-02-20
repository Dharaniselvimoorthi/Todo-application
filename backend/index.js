const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./model/todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// GET all tasks
app.get("/todolist", async (req, res) => {
  const tasks = await Todo.find();
  res.json(tasks);
});


// POST new task
app.post("/todolist", async (req, res) => {
  const newTask = new Todo({
    userTask: req.body.userTask,
    status: false
  });

  const savedTask = await newTask.save();
  res.json(savedTask);
});


// UPDATE task status
app.put("/todolist/:id", async (req, res) => {
  const updatedTask = await Todo.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(updatedTask);
});


// DELETE task
app.delete("/todolist/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Task Deleted" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
