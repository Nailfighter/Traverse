#!/usr/bin/env node
// One-time helper: derives ANON_KEY / SERVICE_ROLE_KEY from the JWT_SECRET
// already in the repo root .env. Run locally, never in CI/containers.
//
// Usage:
//   node Docker/Supabase/generate-keys.js
//
// Reads JWT_SECRET from the root .env (or the JWT_SECRET env var if set),
// prints ANON_KEY and SERVICE_ROLE_KEY to paste into .env / the GitHub
// Actions secret. No dependencies — uses Node's built-in crypto only.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signJwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${signingInput}.${signature}`;
}

function readJwtSecretFromEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return null;
  const contents = fs.readFileSync(envPath, "utf8");
  const match = contents.match(/^JWT_SECRET=(.*)$/m);
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, "");
}

const envPath = path.resolve(__dirname, "..", "..", ".env");
const jwtSecret = process.env.JWT_SECRET || readJwtSecretFromEnvFile(envPath);

if (!jwtSecret) {
  console.error(
    `Could not find JWT_SECRET. Set it as an env var or add JWT_SECRET=... to ${envPath}`
  );
  process.exit(1);
}

const now = Math.floor(Date.now() / 1000);
const tenYears = 10 * 365 * 24 * 60 * 60;

const anonKey = signJwt(
  { role: "anon", iss: "supabase", iat: now, exp: now + tenYears },
  jwtSecret
);
const serviceRoleKey = signJwt(
  { role: "service_role", iss: "supabase", iat: now, exp: now + tenYears },
  jwtSecret
);

console.log("Generated from JWT_SECRET — paste these into .env:\n");
console.log(`ANON_KEY=${anonKey}`);
console.log(`SERVICE_ROLE_KEY=${serviceRoleKey}`);
console.log("\nAlso set SUPABASE_KEY / VITE_SUPABASE_KEY to the ANON_KEY value above.");
