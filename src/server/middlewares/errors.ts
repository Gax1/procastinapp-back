import "../../dotenv";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../interfaces/interfaces";

const debug = Debug("procastinapp:error");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ Error: "Endpoit not found" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  const errorMessage =
    error.publicMessage ?? "Error in the server, please try again later";

  debug(chalk.redBright(error.message));

  res.status(errorCode).json({ Error: errorMessage });
};
