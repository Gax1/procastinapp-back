import { NextFunction, Request, Response } from "express";

import Task from "../../database/models/Tasks";
import User from "../../database/models/User";
import { Task as Itask } from "../../interfaces/interfaces";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: ownerId } = req.query;

  const { title, description, importance, date, img, backUpImg } =
    await req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      importance,
      date,
      img,
      backUpImg,
      owner: ownerId,
    });

    const user = await User.findById(ownerId);

    user.tasks.push(newTask.id);

    await user.save();

    req.body = newTask;

    res.status(201).json({ task: newTask });
  } catch (error) {
    const customError = customErrorGenerator(
      400,
      error.message,
      "Error creating the task"
    );

    next(customError);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.query;

    await Task.findByIdAndDelete(id);

    res.status(201).json({ Message: "Tasks has been succesfully deleted" });
  } catch (error) {
    const deleteError = customErrorGenerator(
      404,
      error.message,
      "Error deleting the task"
    );

    next(deleteError);
  }
};
