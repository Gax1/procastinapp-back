import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorValidate } from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";
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

  describe("When it receives an error with an empy message and undefined statusCode", () => {
    const statusCode: undefined = undefined;
    const publicMessage = "";
    const privateMessage = "Error for the developer";

    const generalStatusCode = 500;
    const generalMessage = "Error in the server, please try again later";

    const error = customErrorGenerator(
      statusCode,
      privateMessage,
      publicMessage
    );
    test("Then it should call the status method with a 500", () => {
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

      expect(res.status).toHaveBeenCalledWith(generalStatusCode);
    });
    test("Then it should call the json method with a message", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ Error: generalMessage }),
      } as Partial<Response>;
      const next: NextFunction = jest.fn();

      generalError(
        error as CustomError,
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ Error: generalMessage });
    });
    describe("When it receives a validation error", () => {
      const validationError = {
        name: "ValidationError",
        message: "Validation Failed",
        statusCode: 400,
        error: "Bad Request",
        details: {
          body: [
            {
              message: "error",
              path: ["password"],
              type: "string.empty",
              context: {
                label: "password",
                value: "",
                key: "password",
              },
            },
          ],
        },
      };

      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ Error: generalMessage }),
      } as Partial<Response>;
      const next: NextFunction = jest.fn();

      test("Then it should should call the debug", () => {
        generalError(
          validationError as ErrorValidate,
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith({ Error: generalMessage });
      });
    });
  });
});
