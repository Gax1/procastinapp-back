import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import { loginUser, registerUser } from "../controllers/usersControllers";
import userRegisterCredentialsSchema from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post("/login", loginUser);

const uploader = multer({
  dest: path.join("uploads", "img"),
  limits: { fieldSize: 800000 },
});

usersRouter.post(
  "/register",
  uploader.single("img"),
  validate(userRegisterCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);
export default usersRouter;
