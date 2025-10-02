import "server-only"; // make sure this never hits the browser bundle

import * as schema from "./schema";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

// For scripts (migrate/seed) that call dotenv manually, leave env reads here
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const isNeon = /neon\.tech/.test(DATABASE_URL);

/**
 * 1) Migration client (used ONLY by scripts like migrate/seed)
 * Keep pool size low and force SSL on Neon.
 */
export const migrationConnection: Sql = postgres(DATABASE_URL, {
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : 5, // small pool for scripts
  ssl: isNeon ? "require" : undefined,
  idle_timeout: 5,
  // onnotice: () => {}, // uncomment to silence PG notices
});

/**
 * 2) Runtime client as a hot-reload-safe singleton
 */
declare global {
  var __pgClient: Sql | undefined;
  var __db: PostgresJsDatabase<typeof schema> | undefined;
}

const client: Sql =
  globalThis.__pgClient ??
  postgres(DATABASE_URL, {
    max: 10,
    ssl: isNeon ? "require" : undefined,
    idle_timeout: 5,
  });
if (!globalThis.__pgClient) globalThis.__pgClient = client;

/**
 * 3) Drizzle instance, also singleton
 */
export const db: PostgresJsDatabase<typeof schema> = globalThis.__db ?? drizzle(client, { schema });
if (!globalThis.__db) globalThis.__db = db;

/**
 * 4) Helper to close (useful in scripts/tests)
 */
export async function closeDb() {
  await client.end({ timeout: 5 });
}
