import { NextFunction, Request, Response } from "express";
import backUpImge from "./backUpImage";

let mockedUpload = {};

jest.mock("fs");

jest.mock("@supabase/supabase-js", () => ({
  ...jest.requireActual("@supabase/supabase-js"),

  createClient: () => ({
    storage: {
      from: () => ({
        upload: () => mockedUpload,
        getPublicUrl: () => "test-url",
      }),
    },
  }),
}));

jest.mock("fs/promises", () => ({
  ...jest.requireActual("fs/promises"),
  rename: jest.fn(),
  readFile: jest.fn().mockResolvedValue(""),
}));

const req = {
  body: {},
  file: { originalname: "test-name", filename: "filedname-test" },
} as Partial<Request>;
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as Partial<Response>;
const next: NextFunction = jest.fn();

describe("Given a backUp image middleware", () => {
  describe("When it receives a request with a file", () => {
    test("Then it should call the next method", async () => {
      await backUpImge(req as Request, res as Response, next as NextFunction);

      await expect(next).toHaveBeenCalled();
    });
    describe("When it receives an error in the upload", () => {
      test("Then it should call the next error with a custom error", async () => {
        mockedUpload = {
          error: {
            message: "Error",
          },
        };

        await backUpImge(req as Request, res as Response, next as NextFunction);

        await expect(next).toHaveBeenCalled();
      });
    });
  });
});
