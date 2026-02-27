import { createReadStream } from "node:fs";
import { spawn } from "node:child_process";
import { createGunzip } from "node:zlib";
import dotenv from "dotenv";

dotenv.config();

function runPsql(databaseUrl, inputStream) {
  return new Promise((resolve, reject) => {
    const child = spawn("psql", [databaseUrl], {
      stdio: ["pipe", "inherit", "pipe"],
      env: process.env
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`psql exited with code ${code}: ${stderr}`));
      }
    });

    inputStream.pipe(child.stdin);
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const backupFile = process.env.DB_RESTORE_FILE;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  if (!backupFile) {
    throw new Error("DB_RESTORE_FILE is required");
  }

  const isGzip = backupFile.endsWith(".gz");
  const source = createReadStream(backupFile);
  const inputStream = isGzip ? source.pipe(createGunzip()) : source;

  await runPsql(databaseUrl, inputStream);
  console.log(`Restore completed from: ${backupFile}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
