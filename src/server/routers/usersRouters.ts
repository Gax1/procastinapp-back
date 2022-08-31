import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import { loginUser, registerUser } from "../controllers/usersControllers";
import userRegisterCredentialsSchema from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

const uploader = multer({ dest: "uploads", limits: { fieldSize: 3000000 } });
usersRouter.post("/login", loginUser);
usersRouter.post(
  "/register",
  validate(userRegisterCredentialsSchema, {}, { abortEarly: false }),
  uploader.single("image"),
  registerUser
);
export default usersRouter;
