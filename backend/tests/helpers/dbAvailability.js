import { query } from "../../src/db/pool.js";

let cachedAvailability;
let warned = false;

export async function checkDatabaseAvailability() {
  if (cachedAvailability !== undefined) {
    return cachedAvailability;
  }

  try {
    await query("SELECT 1");
    cachedAvailability = true;
    return true;
  } catch (error) {
    cachedAvailability = false;

    if (process.env.CI === "true") {
      throw new Error(
        `Database is required in CI but unavailable for tests. DATABASE_URL=${process.env.DATABASE_URL || "<missing>"}`
      );
    }

    if (!warned) {
      warned = true;
      console.warn(
        "[tests] Database unavailable. DB-dependent tests will be skipped. Run `npm run db:reset` and ensure DATABASE_URL is reachable."
      );
    }

    return false;
  }
}
