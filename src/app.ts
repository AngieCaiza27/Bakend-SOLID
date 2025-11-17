import express from "express";
import cors from "cors";
import { registerHealthRoutes } from "./modules/health/health.routes";
import { registerUserRoutes } from "./modules/users/user.routes";


export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const router = express.Router();

  registerHealthRoutes(router);
  registerUserRoutes(router); 
  app.use("/api", router);

  return app;
}
