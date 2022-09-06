import { NextFunction, Response } from "express";
import { JwtPayload as Jwt } from "jsonwebtoken";
import { CustomRequest, JwtPayload } from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";
import authentication from "./authentication";

let mockJwtPayload: string | Jwt = {
  id: "test-id",
  username: "test-username",
  iat: 123456789,
};

jest.mock("../../utils/auth/authFunctions", () => ({
  ...jest.requireActual("../../utils/auth/authFunctions"),
  verifyToken: () => mockJwtPayload,
}));
beforeEach(() => jest.clearAllMocks());

const req = {
  get: jest.fn().mockReturnValue("Bearer #"),
  payload: {} as JwtPayload,
} as Partial<CustomRequest>;
const res = {
  status: jest.fn(),
  json: jest.fn().mockReturnThis(),
} as Partial<Response>;

const CustomError = customErrorGenerator(
  400,
  "Bad Request",
  "Error in authentication"
);

describe("Given a authentication middleware", () => {
  describe("When it receives a request with an authorization header", () => {
    test("Then it should call the next function", () => {
      const next = jest.fn() as NextFunction;

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When it receives an unvalid token", () => {
    test("Then it should call next with a custom error", () => {
      jest.clearAllMocks();
      mockJwtPayload = "error";
      const next = jest.fn() as NextFunction;

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(CustomError);
    });
  });
  describe("When it receives a request without a header", () => {
    const next = jest.fn() as NextFunction;

    test("Then it should call the next function with a custom error", () => {
      req.get = jest.fn().mockReturnValue("#");

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(CustomError);
    });
  });
});
