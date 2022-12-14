import express from "express";
import multer from "multer";
import path from "path";
import {
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTaskById,
} from "../controllers/taskControllers";
import authentication from "../middlewares/authentication";
import backUpImge from "../middlewares/backUpImage";

const tasksRouter = express.Router();

const uploader = multer({
  dest: path.join("uploads", "img"),
  limits: { fileSize: 800000 },
});

tasksRouter.get("/my-day", authentication, getAllTasks);

tasksRouter.post(
  "/my-day",
  authentication,
  uploader.single("img"),
  backUpImge,
  createTask
);

tasksRouter.delete("/my-day", authentication, deleteTask);
tasksRouter.put(
  "/my-day",
  authentication,
  uploader.single("img"),
  backUpImge,
  editTask
);

tasksRouter.put(
  "/my-day",
  authentication,
  uploader.single("img"),
  backUpImge,
  editTask
);

tasksRouter.get("/my-task/:id", authentication, getTaskById);
export default tasksRouter;
