import { Router } from "express";
import { dbPool } from "../../config/database";
import { redisClient } from "../../config/redis";
import { HealthRepository } from "./health.repository";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";

export function registerHealthRoutes(router: Router) {
  const repository = new HealthRepository(dbPool, redisClient);
  const service = new HealthService(repository);
  const controller = new HealthController(service);

  router.get("/health", controller.getHealth);
}
