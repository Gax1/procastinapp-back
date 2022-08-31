import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { ProtoUser } from "../../interfaces/interfaces";
import { registerUser } from "./usersControllers";

jest.mock("../../utils/auth/authFunctions", () => ({
  ...jest.requireActual("../../utils/auth/authFunctions"),
  hashCreator: () => jest.fn().mockResolvedValue("#"),
}));

describe("Given a registration controller", () => {
  const mockUser: ProtoUser = {
    username: "mockName",
    password: "password",
    img: "data of img",
  };

  const req = {
    body: {
      user: {
        username: "mockName",
        password: "password",
        img: "data of img",
      },
      files: ["mock", "mock"],
    },
  } as Partial<Request>;
  describe("When it receives a request with a mock object", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue({ User: mockUser }),
    } as Partial<Response>;
    test("Then it should return 201 as status code", async () => {
      const next: NextFunction = jest.fn();

      User.create = jest.fn().mockReturnValue(mockUser);

      const statusCode = 201;

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the json method with a mock object", async () => {
      const next: NextFunction = jest.fn();

      User.create = jest.fn().mockReturnValue(mockUser);
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ User: mockUser });
    });
  });
  describe("When find user throw an error", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;
    test("Then it should call the next function", async () => {
      const next: NextFunction = jest.fn();

      User.create = jest.fn().mockRejectedValue(mockUser);
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
