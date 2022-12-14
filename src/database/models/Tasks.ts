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
  img: {
    type: String,
    required: true,
  },
  backUpImg: {
    type: String,
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

const Task = model("Task", taskSchema, "Tasks");

export default Task;
