const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./model/todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://DharaniselviMoorthi:dharani31@cluster0.v2jzapg.mongodb.net/todolistDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// GET ALL TASKS
app.get("/todolist", async (req, res) => {
  try {
    const tasks = await Todo.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// ADD TASK
app.post("/todolist", async (req, res) => {
  try {
    const newTask = new Todo({
      userTask: req.body.userTask,
      status: false
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});


// UPDATE STATUS
app.put("/todolist/:id", async (req, res) => {
  try {
    const updatedTask = await Todo.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});


// DELETE TASK
app.delete("/todolist/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));