import { Router } from "express";
import { verifyToken } from "../helper/authToken.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import UserTask from "../models/UserTask.js";
const router = Router();


router.post("/Create", verifyToken, async (req, res) => {
  try {
    const email = req.user?.email; //get user email  by token set in cookie httponly
    const user = await User.findOne({ email: email });
    const id = user._id.valueOf();

    const { name, description } = req.body?.task;
    
    const task = await Task.create({
      name: name,
      description: description,
    });
    const userTask = await UserTask.create({
      task: task._id,
      user: user._id,
    });
    const createdTask = await UserTask.findOne({ _id: userTask._id }).populate({
      path: "task",
    });
    console.log(createdTask);
    
      res.status(200).json(createdTask);
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/show", verifyToken, async (req, res) => {
  try {
    
      const email = req.user?.email; //get user email  by token set in cookie httponly
      const user = await User.findOne({ email: email });
     
      const tasks = await UserTask.find({
        user: user?._id,
      }).populate({ path: "task" });
     
        res.status(200).json(tasks);
      
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/edit", verifyToken, async (req, res) => {
  try {
    const email = req.user?.email; //get user email  by token set in cookie httponly
    const user = await User.findOne({ email: email });

    const task = req.body;
    const userTaskToUpdate = await UserTask.findOne({
      user: user._id,
      task: task._id,
    });
    if (!userTaskToUpdate) {
      return res.status(500).json({ message: "Task not Found , refresh" });
    }

    await Task.findOneAndUpdate({ _id: task._id }, task);
    const updatedTask = await UserTask.findOne({
      _id: userTaskToUpdate._id,
    }).populate({ path: "task" });

  
      return res.status(200).json(updatedTask);
   
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/delete", verifyToken, async (req, res) => {
  try {
    const id = req.body?.id;
    const email = req.user?.email; //get user email  by token set in cookie httponly
    const user = await User.findOne({ email: email });
    const userTaskToDelete = await UserTask.findOne({
      _id: id,
      user: user._id,
    });
    console.log(id);
    if (!userTaskToDelete) {
      return res.status(500).json({ message: "Task not found" });
    }
    await UserTask.deleteOne(
      { _id: userTaskToDelete._id },
    );
    
      return res.status(200).json(userTaskToDelete._id);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export default router;
