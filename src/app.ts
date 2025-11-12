import { registerHealthRoutes } from "./modules/health/health.routes";
import express from "express";
import cors from "cors";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const router = express.Router();
  registerHealthRoutes(router);

  app.use("/api", router);

  return app;
}
