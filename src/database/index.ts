import "../dotenv";
import Debug from "debug";
import mongoose from "mongoose";
import chalk from "chalk";

const debug = Debug("procastinapp:database-connection");

const dataBaseConnection = (mongoURL: string) => {
  // eslint-disable-next-line no-new
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        delete newDocument.password;
        return newDocument;
      },
    });
    mongoose.connect(mongoURL, (error) => {
      if (error) {
        debug(
          chalk.redBright("Error connecting with the data base", error.message)
        );
        reject(error);
        return;
      }
      debug(chalk.white("Connected with data base"));
      resolve(true);
    });
  });
};

export default dataBaseConnection;
