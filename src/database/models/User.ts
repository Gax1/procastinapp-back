import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: { type: String },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Tasks" }],
});

const User = model("User", userSchema, "Users");

export default User;
