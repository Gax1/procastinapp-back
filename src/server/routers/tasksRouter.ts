import express from "express";
import { createTask, getAllTasks } from "../controllers/taskControllers";
import authentication from "../middlewares/authentication";

const tasksRouter = express.Router();

tasksRouter.get("/my-day", authentication, getAllTasks);
tasksRouter.post("/my-day", createTask);

export default tasksRouter;
