import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserTask = mongoose.Schema({
  task: { type: Schema.Types.ObjectId, ref: "Voosh-Task" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("UserTask", UserTask);
