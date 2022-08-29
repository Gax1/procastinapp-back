import { NextFunction, Request, Response } from "express";
import CustomError from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customErrorGenerator";
import { generalError, notFoundError } from "./errors";

describe("Given a notFound middleware", () => {
  describe("When it receives a request obect", () => {
    const statusCode = 404;
    const publicMessage = "Endpoit not found";

    test("Then it should call the response status method with a 404", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the response json method with a error message", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ Error: publicMessage }),
      } as Partial<Response>;

      notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ Error: publicMessage });
    });
  });
});

describe("Given a general error middleware", () => {
  describe("When it receives a request object", () => {
    const statusCode = 409;
    const errorMessage = "Error for the client";
    const privateMessage = "Error for the developer";

    const error = customErrorGenerator(
      statusCode,
      privateMessage,
      errorMessage
    );

    test("Then it should call the response status method with an error code", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next: NextFunction = jest.fn();

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the json method with the message error", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ Error: errorMessage }),
      } as Partial<Response>;
      const next: NextFunction = jest.fn();

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ Error: errorMessage });
    });
  });
});
