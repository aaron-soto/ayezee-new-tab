import * as schema from "./schema";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

let _migrationConnection: Sql | undefined;
let _db: PostgresJsDatabase<typeof schema> | undefined;

/**
 * Get or create the migration connection
 */
export function getMigrationConnection(): Sql {
  if (_migrationConnection) return _migrationConnection;

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const isNeon = /neon\.tech/.test(DATABASE_URL);

  _migrationConnection = postgres(DATABASE_URL, {
    max: 1, // Small pool for scripts
    ssl: isNeon ? "require" : undefined,
    idle_timeout: 5,
  });

  return _migrationConnection;
}

/**
 * Get or create the drizzle instance for scripts
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (_db) return _db;

  const connection = getMigrationConnection();
  _db = drizzle(connection, { schema });

  return _db;
}

// Export for convenience
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});

/**
 * Helper to close connection
 */
export async function closeDb() {
  if (_migrationConnection) {
    await _migrationConnection.end({ timeout: 5 });
    _migrationConnection = undefined;
    _db = undefined;
  }
}
