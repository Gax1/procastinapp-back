import { model, Schema } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  importance: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: "Users" },
});

const Task = model("Task", taskSchema, "Tasks");

export default Task;
