import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * Run database migrations.
 * POST /api/migrate?secret=<CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const results: string[] = [];

  // Add flagged column to crowd_prices if it doesn't exist
  try {
    await sql`
      ALTER TABLE crowd_prices
      ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false
    `;
    results.push("Added flagged column to crowd_prices");
  } catch (e) {
    results.push(`flagged column: ${e instanceof Error ? e.message : "skipped"}`);
  }

  // Create cache_store table
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cache_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    results.push("Created cache_store table");
  } catch (e) {
    results.push(`cache_store: ${e instanceof Error ? e.message : "skipped"}`);
  }

  return NextResponse.json({ results });
}
