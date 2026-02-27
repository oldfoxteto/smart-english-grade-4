import fs from "fs";

function injectFromObject(obj) {
  for (const [key, value] of Object.entries(obj || {})) {
    if ((process.env[key] === undefined || process.env[key] === "") && value !== undefined && value !== null) {
      process.env[key] = String(value);
    }
  }
}

function injectFromJsonBundle() {
  const bundle = process.env.APP_SECRETS_JSON;
  if (!bundle) return;
  try {
    const parsed = JSON.parse(bundle);
    injectFromObject(parsed);
  } catch (error) {
    throw new Error(`APP_SECRETS_JSON is invalid JSON: ${error.message}`);
  }
}

function injectFromFileBundle() {
  const filePath = process.env.APP_SECRETS_FILE;
  if (!filePath) return;
  if (!fs.existsSync(filePath)) {
    throw new Error(`APP_SECRETS_FILE not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  try {
    const parsed = JSON.parse(content);
    injectFromObject(parsed);
  } catch (error) {
    throw new Error(`APP_SECRETS_FILE has invalid JSON: ${error.message}`);
  }
}

async function injectFromGcpSecretManager() {
  if (process.env.SECRET_MANAGER_PROVIDER !== "gcp") return;

  const mappingsRaw = process.env.GCP_SECRET_MAPPINGS;
  const accessToken = process.env.GCP_ACCESS_TOKEN;

  if (!mappingsRaw) {
    throw new Error("GCP_SECRET_MAPPINGS is required when SECRET_MANAGER_PROVIDER=gcp");
  }
  if (!accessToken) {
    throw new Error("GCP_ACCESS_TOKEN is required when SECRET_MANAGER_PROVIDER=gcp");
  }

  let mappings;
  try {
    mappings = JSON.parse(mappingsRaw);
  } catch (error) {
    throw new Error(`GCP_SECRET_MAPPINGS is invalid JSON: ${error.message}`);
  }

  for (const [envKey, resourceName] of Object.entries(mappings)) {
    if (process.env[envKey]) continue;

    const url = `https://secretmanager.googleapis.com/v1/${resourceName}:access`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch secret ${resourceName}: ${response.status} ${text.slice(0, 200)}`);
    }

    const payload = await response.json();
    const b64 = payload?.payload?.data;
    if (!b64) {
      throw new Error(`Secret payload missing for ${resourceName}`);
    }

    process.env[envKey] = Buffer.from(b64, "base64").toString("utf8");
  }
}

export async function initializeSecrets() {
  injectFromJsonBundle();
  injectFromFileBundle();
  await injectFromGcpSecretManager();
}
