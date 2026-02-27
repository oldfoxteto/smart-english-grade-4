import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createGzip } from "node:zlib";
import dotenv from "dotenv";

dotenv.config();

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      ...options
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
        reject(new Error(`${command} exited with code ${code}: ${stderr}`));
      }
    });

    if (options.stdoutPipe) {
      child.stdout.pipe(options.stdoutPipe);
    }
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const backupDir = process.env.DB_BACKUP_DIR || "./backups";
  const fileName = process.env.DB_BACKUP_FILE || `lisan-backup-${timestamp()}.sql.gz`;
  const outputPath = join(backupDir, fileName);

  await mkdir(backupDir, { recursive: true });

  const gzip = createGzip({ level: 9 });
  const writer = createWriteStream(outputPath);
  gzip.pipe(writer);

  await run("pg_dump", [databaseUrl, "--no-owner", "--no-privileges", "--format=plain"], {
    env: process.env,
    stdoutPipe: gzip
  });

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
    gzip.end();
  });

  console.log(`Backup created: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
