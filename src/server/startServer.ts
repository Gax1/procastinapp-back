import "../dotenv";
import Debug from "debug";
import chalk from "chalk";
import app from ".";

const debug = Debug("procastinapp:start-server");

const startServer = (port: number) => {
  // eslint-disable-next-line no-new
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Connected to server in port: ${port}`));
      resolve(true);
    });
    server.on("error", (error: Error) => {
      debug(chalk.red("Error in the connection with the server"));
      reject(error);
    });
  });
};

export default startServer;
