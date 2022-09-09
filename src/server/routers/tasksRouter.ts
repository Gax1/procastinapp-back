import express from "express";
import multer from "multer";
import path from "path";
import { createTask, getAllTasks } from "../controllers/taskControllers";
import authentication from "../middlewares/authentication";
import backUpImge from "../middlewares/backUpImage";

const tasksRouter = express.Router();

const uploader = multer({
  dest: path.join("uploads", "img"),
  limits: { fileSize: 800000 },
});

tasksRouter.get("/my-day", authentication, getAllTasks);

tasksRouter.post("/my-day", uploader.single("img"), backUpImge, createTask);
export default tasksRouter;
