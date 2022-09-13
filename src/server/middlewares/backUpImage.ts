import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import customErrorGenerator from "../../utils/customError/customErrorGenerator";

const backUpImge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;

    const imgName = `${Date.now()}-${file.originalname}`;

    fs.rename(
      path.join("uploads", "img", file.filename),
      path.join("uploads", "img", imgName)
    );
    const supaBase = createClient(
      "https://tvwhlidthburgnidbinv.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2hsaWR0aGJ1cmduaWRiaW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI3MjA0NzAsImV4cCI6MTk3ODI5NjQ3MH0.-HugWWv76PXlaGgkABcHAhXaLXM-O6T4LBuymtfIv-M"
    );

    const storage = supaBase.storage.from("final-project");

    const fileDir = await fs.readFile(path.join("uploads", "img", imgName));

    const uploadResult = await storage.upload(imgName, fileDir);
    if (uploadResult.error) {
      const error = customErrorGenerator(
        409,
        uploadResult.error.message,
        "Error uploading the image"
      );
      next(error);
    }

    const backUpSupaBase = storage.getPublicUrl(imgName);

    req.body.img = imgName;
    req.body.backUpImg = backUpSupaBase.publicURL;

    next();
    return;
  } catch (error) {
    const customError = customErrorGenerator(
      503,
      error.message,
      "Error in the request"
    );
    next(customError);
  }
};

export default backUpImge;
