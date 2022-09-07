import express from "express";
import getAllTasks from "../controllers/taskControllers";
import authentication from "../middlewares/authentication";

const tasksRouter = express.Router();

tasksRouter.get("/tasks", authentication, getAllTasks);

export default tasksRouter;
