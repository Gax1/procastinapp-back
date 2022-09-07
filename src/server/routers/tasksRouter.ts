import express from "express";
import getAllTasks from "../controllers/taskControllers";
import authentication from "../middlewares/authentication";

const tasksRouter = express.Router();

tasksRouter.get("/my-day", authentication, getAllTasks);

export default tasksRouter;
