import dataBaseConnection from "./database";
import "./dotenv";
import startServer from "./server/startServer";

const port = +process.env.PORT;

const mongoUrl = process.env.MONGOURL as string;

(async () => {
  try {
    await dataBaseConnection(mongoUrl);
    await startServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
