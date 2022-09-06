import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import {
  IUser,
  JwtPayload,
  LoginUser,
  ProtoUser,
} from "../../interfaces/interfaces";
import {
  createToken,
  hashCompare,
  hashCreator,
} from "../../utils/auth/authFunctions";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, img }: ProtoUser = await req.body;
  const encryptedPassword = await hashCreator(password);

  try {
    await User.create({
      username,
      password: encryptedPassword,
      img,
    });

    res.status(201).json({ message: "Succeed in registration" });
  } catch (error) {
    const customError = customErrorGenerator(
      400,
      error.message,
      "Error creating the user, try again later"
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as LoginUser;

  const userError = customErrorGenerator(
    403,
    "User not found",
    "User or password not valid"
  );

  let findusers: IUser[];
  try {
    findusers = await User.find({ username: user.username });
    const isPasswordValid = await hashCompare(
      user.password,
      findusers[0].password
    );
    if (!isPasswordValid) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = customErrorGenerator(
      403,
      `name: ${(error as Error).name}; message: ${(error as Error).message}`,
      "User or password invalid"
    );
    next(finalError);
    return;
  }

  const payload: JwtPayload = {
    id: findusers[0].id,
    username: findusers[0].username,
  };

  const responseData = {
    user: {
      username: findusers[0].username,
      id: findusers[0].id,
      token: createToken(payload),
    },
  };

  res.status(200).json(responseData);
};
