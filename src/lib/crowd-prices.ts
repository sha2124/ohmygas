import { getDb } from "./db";
import { FuelPrice, FuelType } from "./types";

/**
 * Fetch active community-submitted prices from Neon.
 * Only returns non-expired submissions (< 7 days old).
 */
export async function fetchCrowdPrices(): Promise<FuelPrice[]> {
  const sql = getDb();

  const rows = await sql`
    SELECT DISTINCT ON (brand, region, province, city, fuel_type)
      id, brand, station, region, province, city, fuel_type,
      price, reported_by, votes, created_at
    FROM crowd_prices
    WHERE expires_at > now()
    ORDER BY brand, region, province, city, fuel_type, votes DESC, created_at DESC
  `;

  return rows.map((row) => ({
    brand: row.brand,
    station: row.station || undefined,
    region: row.region,
    province: row.province,
    city: row.city || undefined,
    fuelType: row.fuel_type as FuelType,
    price: parseFloat(row.price),
    previousPrice: null,
    updatedAt: new Date(row.created_at).toISOString().split("T")[0],
    source: "community" as const,
    reportedBy: row.reported_by || undefined,
    votes: row.votes || 1,
  }));
}
