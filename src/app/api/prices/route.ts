import { NextResponse } from "next/server";
import { scrapeFuelPricePH } from "@/lib/scraper/fuelprice";
import { scrapeExpressway } from "@/lib/scraper/expressway";
import { fetchCrowdPrices } from "@/lib/crowd-prices";
import { FuelPrice } from "@/lib/types";

// Cache scraped data in memory (refreshes every 6 hours)
let cachedData: {
  prices: FuelPrice[];
  meta: Record<string, string>;
  history: Array<{ week: string; gasoline: number; diesel: number }>;
  sources: string[];
} | null = null;
let cachedAt: number = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  try {
    const now = Date.now();
    const useCache = cachedData && now - cachedAt < CACHE_TTL;

    // Always fetch community prices fresh (not cached, fast Supabase query)
    let crowdPrices: FuelPrice[] = [];
    try {
      crowdPrices = await fetchCrowdPrices();
    } catch (e) {
      console.error("Crowd prices fetch failed:", e);
    }

    if (useCache && cachedData) {
      const merged = mergePrices(cachedData.prices, crowdPrices);
      return NextResponse.json(
        {
          prices: merged,
          meta: cachedData.meta,
          history: cachedData.history,
          sources: cachedData.sources,
          communityCount: crowdPrices.length,
          cached: true,
          cachedAt: new Date(cachedAt).toISOString(),
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    // Fetch from all scraped sources in parallel
    const [fpResult, ewResult] = await Promise.allSettled([
      scrapeFuelPricePH(),
      scrapeExpressway(),
    ]);

    const activeSources: string[] = [];
    let officialPrices: FuelPrice[] = [];
    let meta: Record<string, string> = {};
    let history: Array<{ week: string; gasoline: number; diesel: number }> = [];

    // fuelprice.ph — primary NCR source
    if (fpResult.status === "fulfilled" && fpResult.value.prices.length > 0) {
      const fpPrices = fpResult.value.prices.map((p) => ({
        ...p,
        source: "official" as const,
      }));
      officialPrices.push(...fpPrices);
      meta = fpResult.value.meta as unknown as Record<string, string>;
      history = fpResult.value.history;
      activeSources.push("fuelprice.ph");
    }

    // expressway.ph — secondary NCR source (use if fuelprice.ph is empty or stale)
    if (ewResult.status === "fulfilled" && ewResult.value.prices.length > 0) {
      const ewPrices = ewResult.value.prices.map((p) => ({
        ...p,
        source: "scraped" as const,
      }));

      if (officialPrices.length === 0) {
        // Use expressway as primary if fuelprice.ph failed
        officialPrices.push(...ewPrices);
        meta.updated = ewResult.value.updated;
      } else {
        // Merge: add any brands from expressway not already in fuelprice.ph
        const existingBrands = new Set(
          officialPrices.map((p) => `${p.brand}|${p.fuelType}`)
        );
        for (const p of ewPrices) {
          if (!existingBrands.has(`${p.brand}|${p.fuelType}`)) {
            officialPrices.push(p);
          }
        }
      }
      activeSources.push("expressway.ph");
    }

    // Tag all official prices
    officialPrices = officialPrices.map((p) => ({
      ...p,
      source: p.source || ("official" as const),
    }));

    // Merge official + community
    const merged = mergePrices(officialPrices, crowdPrices);

    // Cache the official/scraped data (not community — that's always fresh)
    cachedData = {
      prices: officialPrices,
      meta,
      history,
      sources: activeSources,
    };
    cachedAt = now;

    return NextResponse.json(
      {
        prices: merged,
        meta,
        history,
        sources: activeSources,
        communityCount: crowdPrices.length,
        cached: false,
        cachedAt: new Date(now).toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Prices API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch fuel prices",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Merge official and community prices.
 * Official prices take priority. Community prices fill gaps
 * (locations/brands not covered by official sources).
 */
function mergePrices(
  official: FuelPrice[],
  community: FuelPrice[]
): FuelPrice[] {
  // Build a set of what official data covers
  const officialKeys = new Set(
    official.map(
      (p) => `${p.brand}|${p.region}|${p.province}|${p.city || ""}|${p.fuelType}`
    )
  );

  // Include all official prices, plus community prices that fill gaps
  const result = [...official];

  for (const cp of community) {
    const key = `${cp.brand}|${cp.region}|${cp.province}|${cp.city || ""}|${cp.fuelType}`;
    if (!officialKeys.has(key)) {
      result.push(cp);
    }
  }

  return result;
}
