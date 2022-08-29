import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { ProtoUser } from "../../interfaces/interfaces";
import registerUser from "./usersControllers";

describe("Given a registration controller", () => {
  jest.mock("../../utils/auth/authFunctions", () => ({
    ...jest.requireActual("../../utils/auth/authFunctions"),
    hashCreator: () => jest.fn().mockResolvedValue("#"),
  }));
  describe("When it receives a request with a mock object", () => {
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

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue({ User: mockUser }),
    } as Partial<Response>;

    const next: NextFunction = jest.fn();

    User.create = jest.fn().mockReturnValue(mockUser);

    test("Then it should return 201 as status code", async () => {
      const statusCode = 201;

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the json method with a mock object", async () => {
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ User: mockUser });
    });
  });
});
