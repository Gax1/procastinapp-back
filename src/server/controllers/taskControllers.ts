import { NextFunction, Request, Response } from "express";
import Task from "../../database/models/Tasks";
import { Task as Itask } from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { date } = req.query;
  let tasks: Itask[];
  try {
    tasks = await Task.find({ owner: id });
  } catch (error) {
    next(customErrorGenerator(404, error.message, "Error in the database"));

    return;
  }
  const tasksOfDay = tasks.filter((task) => task.date === date);
  res.status(200).json({ tasks: tasksOfDay });
};

export default getAllTasks;
