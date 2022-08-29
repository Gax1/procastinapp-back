import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { ProtoUser } from "../../interfaces/interfaces";
import registerUser from "./usersControllers";

describe("Given a resgistration controller", () => {
  jest.mock("../../utils/auth/authFunctions", () => ({
    ...jest.requireActual("../../utils/auth/authFunctions"),
    hashCreator: () => jest.fn().mockResolvedValue("#"),
  }));
  describe("When it throws an error", () => {
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
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;

    const next: NextFunction = jest.fn();

    User.create = jest.fn().mockRejectedValue(mockUser);

    test("Then it should call the next function", async () => {
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
