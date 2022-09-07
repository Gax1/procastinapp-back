import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../../database/models/Tasks";
import getAllTasks from "./taskControllers";

const mockedId = new mongoose.Types.ObjectId();

const mockedFind = [
  {
    title: "",
    description: "",
    importance: "",
    date: "2/18/2016",
    img: "",
    owner: mockedId,
  },
  {
    title: "",
    description: "",
    importance: "",
    date: "4/18/2016",
    img: "",
    owner: mockedId,
  },
];

describe("Given a task controller", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;

  const req = {
    query: { id: "test-id", date: "4/18/2016" },
  } as Partial<Request>;

  const next = jest.fn();
  describe("When it receives a request with request with a body and a query", () => {
    Task.find = jest.fn().mockReturnValue(mockedFind);
    test("Then it should call the status method with a 201", async () => {
      const codeStatus = 200;

      await getAllTasks(req as Request, res as Response, next as NextFunction);

      await expect(res.status).toHaveBeenCalledWith(codeStatus);
    });
    test("Then it should call the json method with the matcher of the date", async () => {
      jest.clearAllMocks();

      await getAllTasks(req as Request, res as Response, next as NextFunction);

      await expect(res.json).toHaveBeenCalledWith([mockedFind[1]]);
    });
  });
  describe("When theres an error in the find", () => {
    test("Then it should call the next method with an error", async () => {
      Task.find = jest.fn().mockRejectedValue(mockedFind);

      await getAllTasks(req as Request, res as Response, next as NextFunction);
      expect(next).toHaveBeenCalled();
    });
  });
});
