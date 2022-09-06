import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../../interfaces/interfaces";
import { verifyToken } from "../../utils/auth/authFunctions";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const CustomError = customErrorGenerator(
    400,
    "Bad Request",
    "Error in authentication"
  );
  const dataAuth = req.get("Authorization");
  if (!dataAuth || !dataAuth.startsWith("Bearer ")) {
    next(CustomError);
    return;
  }

  const token = dataAuth.slice(7);
  const tokenData: string | JwtPayload = verifyToken(token);

  if (typeof tokenData === "string") {
    next(CustomError);
    return;
  }
  req.payload = tokenData as JwtPayload;

  next();
};

export default authentication;
