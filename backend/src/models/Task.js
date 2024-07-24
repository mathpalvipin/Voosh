import mongoose from "mongoose";
const Task = mongoose.Schema({
    name:{type:String},
    description:{type:String },
    status:{type:String, default:"todo"},
} ,{
    timestamps: { createdAt: true, updatedAt: false }
  });

export default mongoose.model("Voosh-Task",Task);