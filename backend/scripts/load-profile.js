import { performance } from "node:perf_hooks";

const BASE_URL = process.env.LOAD_TEST_BASE_URL || "http://localhost:4000";
const TOTAL_REQUESTS = Number(process.env.LOAD_TEST_REQUESTS || 200);
const CONCURRENCY = Number(process.env.LOAD_TEST_CONCURRENCY || 20);
const TARGET_PATH = process.env.LOAD_TEST_PATH || "/health";
const METHOD = (process.env.LOAD_TEST_METHOD || "GET").toUpperCase();

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

async function hitEndpoint() {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}${TARGET_PATH}`, { method: METHOD });
  const ms = performance.now() - start;
  return { ok: response.ok, status: response.status, ms };
}

async function main() {
  const latencies = [];
  let success = 0;
  let failed = 0;

  const startedAt = performance.now();
  let sent = 0;

  async function worker() {
    while (sent < TOTAL_REQUESTS) {
      const current = sent;
      sent += 1;
      if (current >= TOTAL_REQUESTS) break;
      try {
        const result = await hitEndpoint();
        latencies.push(result.ms);
        if (result.ok) {
          success += 1;
        } else {
          failed += 1;
        }
      } catch {
        failed += 1;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  const elapsedMs = performance.now() - startedAt;
  const rps = TOTAL_REQUESTS / (elapsedMs / 1000);

  const report = {
    baseUrl: BASE_URL,
    targetPath: TARGET_PATH,
    method: METHOD,
    totalRequests: TOTAL_REQUESTS,
    concurrency: CONCURRENCY,
    success,
    failed,
    successRate: Number(((success / TOTAL_REQUESTS) * 100).toFixed(2)),
    durationMs: Number(elapsedMs.toFixed(1)),
    rps: Number(rps.toFixed(2)),
    latencyMs: {
      avg: Number((latencies.reduce((a, b) => a + b, 0) / Math.max(1, latencies.length)).toFixed(2)),
      p50: Number(percentile(latencies, 50).toFixed(2)),
      p95: Number(percentile(latencies, 95).toFixed(2)),
      p99: Number(percentile(latencies, 99).toFixed(2))
    }
  };

  console.log(JSON.stringify(report, null, 2));

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
