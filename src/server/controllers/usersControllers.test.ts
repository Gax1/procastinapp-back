import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { ProtoUser } from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";
import { loginUser, registerUser } from "./usersControllers";

let mockResultHashCompare = true;

jest.mock("../../utils/auth/authFunctions", () => ({
  ...jest.requireActual("../../utils/auth/authFunctions"),

  hashCreator: () => "#",
  hashCompare: () => mockResultHashCompare,
  createToken: () => "testing",
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});
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

      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
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

describe("Given a login controller", () => {
  describe("When it recibes a mock object", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;

    const req = {
      body: {
        username: "mockuser",
        password: "mockpassword",
      },
    } as Partial<Request>;

    test("Then it it should response a 200", async () => {
      const next: NextFunction = jest.fn();
      User.find = jest
        .fn()
        .mockResolvedValue([
          { username: "mockuser", password: "mockpassword", id: "123123123" },
        ]);
      await loginUser(req as Request, res as Response, next as NextFunction);

      await expect(res.status).toHaveBeenCalledWith(200);
    });

    test("Then it should call the json method with a token", async () => {
      const next: NextFunction = jest.fn();
      const tokenUser = {
        user: {
          token: "testing",
        },
      };

      User.find = jest
        .fn()
        .mockResolvedValue([
          { username: "mockuser", password: "mockpassword", id: "123123123" },
        ]);
      await loginUser(req as Request, res as Response, next as NextFunction);

      await expect(res.json).toHaveBeenCalledWith(tokenUser);
    });
  });

  describe("When the find method of the User fail", () => {
    const req = {
      body: {
        username: "mockuser",
        password: "mockpassword",
      },
    } as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;

    test("If the user fin method return an empty array should call the next function", async () => {
      const next: NextFunction = jest.fn();
      User.find = jest.fn().mockResolvedValue([{ password: "" }]);

      mockResultHashCompare = false;

      const userError = customErrorGenerator(
        403,
        "User not found",
        "User or password not valid"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(userError);
    });
    test("Then it should call the next function", async () => {
      const next: NextFunction = jest.fn();
      User.find = jest
        .fn()
        .mockRejectedValue({ name: "error", message: "error" });

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
