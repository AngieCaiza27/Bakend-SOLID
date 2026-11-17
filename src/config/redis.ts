import { createClient, RedisClientType } from "redis";
import { env } from "./env";

export const redisClient: RedisClientType = createClient({
  socket: {
    host: env.redisHost || "localhost",
    port: env.redisPort || 6379
  }
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
