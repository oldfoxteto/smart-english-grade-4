import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    throw new Error("Usage: node scripts/run-sql-file.js <sql-file-path>");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const absolutePath = resolve(process.cwd(), sqlFile);
  const sql = (await readFile(absolutePath, "utf8")).replace(/^\uFEFF/, "");

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(sql);
    console.log(`Executed SQL file successfully: ${absolutePath}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
