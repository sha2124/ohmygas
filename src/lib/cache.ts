import { getDb } from "./db";

/**
 * Database-backed cache using Neon.
 * Survives across Vercel serverless cold starts.
 *
 * Table schema (auto-created):
 *   cache_store(key TEXT PK, value JSONB, expires_at TIMESTAMPTZ)
 */

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS cache_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  tableEnsured = true;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    await ensureTable();
    const sql = getDb();
    const rows = await sql`
      SELECT value FROM cache_store
      WHERE key = ${key} AND expires_at > now()
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0].value as T;
  } catch (err) {
    console.warn("[cache] get failed:", err);
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  try {
    await ensureTable();
    const sql = getDb();
    await sql`
      INSERT INTO cache_store (key, value, expires_at)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb, now() + ${ttlSeconds + " seconds"}::interval)
      ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value,
            expires_at = EXCLUDED.expires_at,
            created_at = now()
    `;
  } catch (err) {
    console.warn("[cache] set failed:", err);
  }
}
