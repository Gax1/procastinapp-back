import { Request, Response } from "express";
import { notFoundError } from "./errors";

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
