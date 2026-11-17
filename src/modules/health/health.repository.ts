import { Pool } from "pg";
import { RedisClientType } from "redis";

export interface IHealthRepository {
  checkDatabase(): Promise<boolean>;
  checkCache(): Promise<boolean>;
}

export class HealthRepository implements IHealthRepository {

  constructor(
    private readonly db: Pool,
    private readonly redis: RedisClientType
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.db.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }

  async checkCache(): Promise<boolean> {
    try {
      const pong = await this.redis.ping();
      return pong === "PONG";
    } catch {
      return false;
    }
  }
}
