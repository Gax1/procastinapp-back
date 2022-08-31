import "../../dotenv";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorValidate } from "../../interfaces/interfaces";

const debug = Debug("procastinapp:error");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ Error: "Endpoit not found" });
};

export const generalError = (
  error: CustomError | ErrorValidate,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  const errorMessage =
    (error as CustomError).publicMessage ??
    "Error in the server, please try again later";
  if ((error as ErrorValidate).details) {
    (error as ErrorValidate).details.body.forEach((errorInfo) => {
      debug(chalk.redBright(errorInfo.message));
    });
  }
  debug(chalk.redBright(error.message));

  res.status(errorCode).json({ Error: errorMessage });
};
