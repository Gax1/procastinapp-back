import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../../database/models/Tasks";
import User from "../../database/models/User";
import {
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTaskById,
} from "./taskControllers";

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

      await expect(res.json).toHaveBeenCalledWith({ tasks: [mockedFind[1]] });
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

describe("Given a createTask controller", () => {
  const req = {
    query: { id: "test-id" },
    body: {
      title: "task-title",
      description: "task-description",
      date: "task-date",
      img: "img",
      importance: "very",
    },
  } as Partial<Request>;

  const newTask = {
    title: "task-title",
    description: "task-description",
    date: "task-date",
    img: "img",
    importance: "very",
  };

  const user = new User({
    username: "test-username",
    id: "test-id",
    tasks: [{ id: "test-id" }],
  });

  const next = jest.fn();
  jest.clearAllMocks();
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  describe("When its called with a request with body and query", () => {
    test("Then it should call the method status with 201 and the json method with a new task", async () => {
      Task.create = jest.fn().mockResolvedValueOnce(newTask);
      User.findById = jest.fn().mockResolvedValueOnce(user);
      user.save = jest.fn();
      await createTask(req as Request, res as Response, next as NextFunction);

      await expect(res.status).toHaveBeenCalledWith(201);
      await expect(res.json).toHaveBeenCalledWith({ task: newTask });
    });
  });

  describe("When its called with a bad request", () => {
    test("Then it should call the status code with a 400 and a json with a custom error", async () => {
      Task.create = jest.fn().mockRejectedValueOnce(newTask);
      User.findById = jest.fn().mockResolvedValueOnce(user);
      user.save = jest.fn();
      await createTask(req as Request, res as Response, next as NextFunction);

      await expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a delete task controller", () => {
  const req = {
    query: { id: "test-id" },
    body: {},
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  const next = jest.fn();
  describe("When called with a request", () => {
    test("Then it should call the status method with a 201 and json with a message", async () => {
      Task.findByIdAndDelete = jest.fn().mockResolvedValue("");

      await deleteTask(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        Message: "Tasks has been succesfully deleted",
      });
    });
  });
  describe("When it receives an error", () => {
    test("Then it should call the next method", async () => {
      Task.findByIdAndDelete = jest.fn().mockRejectedValue("");

      await deleteTask(req as Request, res as Response, next as NextFunction);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a edit task controller", () => {
  describe("When its called with a request", () => {
    const editedTask = {
      date: "test-date",
      title: "test-title",
      description: "test-description",
      img: "test-img",
      backUpImg: "test-backUpImg",
      owner: "test-owner",
      importance: "test-importance",
    };

    const req = {
      query: { id: "test-id" },
      body: {
        date: "test-date",
        title: "test-title",
        description: "test-description",
        img: "test-img",
        backUpImg: "test-backUpImg",
        owner: "test-owner",
        importance: "test-importance",
      },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response>;
    const next: NextFunction = jest.fn();
    test("Then it should call the json method with a new task and the status method with 200", async () => {
      Task.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(editedTask);

      await editTask(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ task: editedTask });
    });
    test("Then if receives an error, should call the next method", async () => {
      Task.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(editedTask);

      await editTask(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalled();
    });
  });
});

describe("Given a getTaskById controller", () => {
  const myTask = {
    date: "test-date",
    title: "test-title",
    description: "test-description",
    img: "test-img",
    backUpImg: "test-backUpImg",
    owner: "test-owner",
    importance: "test-importance",
  };
  const req = {
    params: { id: "test-id" },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  const next: NextFunction = jest.fn();
  describe("When it receives a request with an id", () => {
    test("Then it should return a new task", async () => {
      Task.findById = jest.fn().mockResolvedValueOnce(myTask);

      await getTaskById(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ myTask });
    });
  });
  describe("When it receives an error", () => {
    test("Then it should call the enxt method", async () => {
      Task.findById = jest.fn().mockRejectedValueOnce(myTask);

      await getTaskById(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
