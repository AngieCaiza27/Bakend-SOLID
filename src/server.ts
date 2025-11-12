import { createApp } from "./app";
import { env } from "./config/env";
import { connectRedis } from "./config/redis";
import { dbPool } from "./config/database";

async function bootstrap() {
  try {
    await connectRedis(); // 👈 ESTO ES CRÍTICO
    await dbPool.query("SELECT 1");

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`🚀 API escuchando en ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Error inicializando servidor:", error);
    process.exit(1);
  }
}

bootstrap();
