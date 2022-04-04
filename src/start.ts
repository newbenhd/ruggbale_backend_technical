import express from "express";
import { Server } from "http";
import cors from "cors";
import getRouter from "./routes";
import errorMiddleware from "./utils/error-middleware";
import cacheMiddleware from "./utils/cache-middleware";

function startServer(option = { port: process.env.PORT }): Promise<Server> {
  const { port } = option;
  const app = express();
  app.use(cors());

  const router = getRouter();
  app.use("/api", router);
  app.use(errorMiddleware, cacheMiddleware);
  app.all("*", (req, res) => {
    res.status(400).send("Only GET /api/roll/next endpoint is available");
  });
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log("server listen on port ", port);
      const originalClose = server.close.bind(server);
      // @ts-ignore
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      resolve(server);
    });
  });
}
export default startServer;
