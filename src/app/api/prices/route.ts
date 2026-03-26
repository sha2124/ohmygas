import { NextResponse } from "next/server";
import { scrapeFuelPricePH } from "@/lib/scraper/fuelprice";
import { scrapeExpressway } from "@/lib/scraper/expressway";
import { scrapeDOE } from "@/lib/scraper/doe";
import { fetchCrowdPrices } from "@/lib/crowd-prices";
import { cacheGet, cacheSet } from "@/lib/cache";
import { FuelPrice } from "@/lib/types";

const CACHE_KEY = "prices_v1";
const CACHE_TTL = 6 * 60 * 60; // 6 hours in seconds

interface CachedPrices {
  prices: FuelPrice[];
  meta: Record<string, string>;
  history: Array<{ week: string; gasoline: number; diesel: number }>;
  sources: string[];
}

export async function GET() {
  try {
    // Always fetch community prices fresh (fast Neon query)
    let crowdPrices: FuelPrice[] = [];
    try {
      crowdPrices = await fetchCrowdPrices();
    } catch (e) {
      console.error("Crowd prices fetch failed:", e);
    }

    // Try DB-backed cache first (survives across serverless instances)
    const cached = await cacheGet<CachedPrices>(CACHE_KEY);
    if (cached) {
      const merged = mergePrices(cached.prices, crowdPrices);
      return NextResponse.json(
        {
          prices: merged,
          meta: cached.meta,
          history: cached.history,
          sources: cached.sources,
          communityCount: crowdPrices.length,
          cached: true,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        },
      );
    }

    // Fetch from all scraped sources in parallel
    const [fpResult, ewResult, doeResult] = await Promise.allSettled([
      scrapeFuelPricePH(),
      scrapeExpressway(),
      scrapeDOE(),
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

    // expressway.ph — secondary NCR source
    if (ewResult.status === "fulfilled" && ewResult.value.prices.length > 0) {
      const ewPrices = ewResult.value.prices.map((p) => ({
        ...p,
        source: "scraped" as const,
      }));

      if (officialPrices.length === 0) {
        officialPrices.push(...ewPrices);
        meta.updated = ewResult.value.updated;
      } else {
        const existingBrands = new Set(
          officialPrices.map((p) => `${p.brand}|${p.fuelType}`),
        );
        for (const p of ewPrices) {
          if (!existingBrands.has(`${p.brand}|${p.fuelType}`)) {
            officialPrices.push(p);
          }
        }
      }
      activeSources.push("expressway.ph");
    }

    // DOE — additional source for regional/provincial data
    if (doeResult.status === "fulfilled" && doeResult.value.prices.length > 0) {
      const doePrices = doeResult.value.prices.map((p) => ({
        ...p,
        source: "official" as const,
      }));
      const existingKeys = new Set(
        officialPrices.map((p) => `${p.brand}|${p.region}|${p.fuelType}`),
      );
      for (const p of doePrices) {
        if (!existingKeys.has(`${p.brand}|${p.region}|${p.fuelType}`)) {
          officialPrices.push(p);
        }
      }
      activeSources.push("doe.gov.ph");
    }

    officialPrices = officialPrices.map((p) => ({
      ...p,
      source: p.source || ("official" as const),
    }));

    const merged = mergePrices(officialPrices, crowdPrices);

    // Write to DB cache (shared across all serverless instances)
    await cacheSet<CachedPrices>(
      CACHE_KEY,
      { prices: officialPrices, meta, history, sources: activeSources },
      CACHE_TTL,
    );

    return NextResponse.json(
      {
        prices: merged,
        meta,
        history,
        sources: activeSources,
        communityCount: crowdPrices.length,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Prices API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch fuel prices",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Merge official and community prices.
 * Official prices take priority. Community prices fill gaps.
 */
function mergePrices(
  official: FuelPrice[],
  community: FuelPrice[],
): FuelPrice[] {
  const officialKeys = new Set(
    official.map(
      (p) => `${p.brand}|${p.region}|${p.province}|${p.city || ""}|${p.fuelType}`,
    ),
  );

  const result = [...official];
  for (const cp of community) {
    const key = `${cp.brand}|${cp.region}|${cp.province}|${cp.city || ""}|${cp.fuelType}`;
    if (!officialKeys.has(key)) {
      result.push(cp);
    }
  }

  return result;
}
