import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { ProtoUser } from "../../interfaces/interfaces";
import hashCreator from "../../utils/auth/authFunctions";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data: ProtoUser = await req.body.user;
  data.password = await hashCreator(data.password);
  const [...img] = req.body.files;
  data.img = img;

  try {
    const newUser = await User.create(data);

    res.status(201).json({ User: newUser });
  } catch (error) {
    const customError = customErrorGenerator(
      400,
      error.message,
      "Error creating the user, try again later"
    );

    next(customError);
  }
};

export default registerUser;
