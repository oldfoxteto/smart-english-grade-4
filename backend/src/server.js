import { app } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { logger } from "./observability/logger.js";
import { reportError } from "./observability/errorMonitor.js";

let server = null;

async function shutdown(code = 0) {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await pool.end();
  process.exit(code);
}

process.on("unhandledRejection", async (reason) => {
  await reportError(reason instanceof Error ? reason : new Error(String(reason)), {
    origin: "process.unhandledRejection"
  });
});

process.on("uncaughtException", async (error) => {
  await reportError(error, { origin: "process.uncaughtException" });
  await shutdown(1);
});

async function bootstrap() {
  try {
    await pool.query("SELECT 1");
    server = app.listen(config.port, () => {
      logger.info("server.started", { port: config.port, env: config.nodeEnv });
    });
  } catch (error) {
    await reportError(error, { origin: "bootstrap" });
    process.exit(1);
  }
}

bootstrap();
