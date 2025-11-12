import { IHealthRepository } from "./health.repository";

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  uptime: number;
  db: boolean;
  redis: boolean;
}

export interface IHealthService {
  getStatus(): Promise<HealthStatus>;
}

export class HealthService implements IHealthService {
  constructor(private readonly repository: IHealthRepository) {}

  async getStatus(): Promise<HealthStatus> {
    const db = await this.repository.checkDatabase();
    const redis = await this.repository.checkCache();

    const status = db && redis ? "ok" : (db || redis ? "degraded" : "down");

    return {
      status,
      uptime: process.uptime(),
      db,
      redis
    };
  }
}
