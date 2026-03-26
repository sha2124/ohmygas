import { getSupabase } from "./supabase";
import { FuelPrice, FuelType } from "./types";

/**
 * Fetch active community-submitted prices from Supabase.
 * Only returns non-expired submissions (< 7 days old).
 */
export async function fetchCrowdPrices(): Promise<FuelPrice[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("crowd_prices")
    .select("*")
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch crowd prices:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Deduplicate: for each brand+location+fuelType combo, keep the most recent
  // or the one with most votes
  const deduped = deduplicatePrices(data);

  return deduped.map((row) => ({
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

interface CrowdRow {
  id: number;
  brand: string;
  station: string | null;
  region: string;
  province: string;
  city: string | null;
  fuel_type: string;
  price: string;
  reported_by: string | null;
  votes: number;
  created_at: string;
  expires_at: string;
}

function deduplicatePrices(rows: CrowdRow[]): CrowdRow[] {
  const map = new Map<string, CrowdRow>();

  for (const row of rows) {
    const key = `${row.brand}|${row.region}|${row.province}|${row.city || ""}|${row.fuel_type}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, row);
    } else {
      // Keep the one with more votes, or the more recent one
      if (
        row.votes > existing.votes ||
        (row.votes === existing.votes &&
          new Date(row.created_at) > new Date(existing.created_at))
      ) {
        map.set(key, row);
      }
    }
  }

  return Array.from(map.values());
}
