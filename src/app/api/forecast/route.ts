import { NextResponse } from "next/server";
import { fetchCrudePrice } from "@/lib/scraper/crude";
import { fetchUsdPhp } from "@/lib/scraper/forex";
import { scrapeFuelPricePH } from "@/lib/scraper/fuelprice";
import { generateForecast } from "@/lib/forecast";

// Cache forecast data
let cachedResult: Record<string, unknown> | null = null;
let cachedAt = 0;
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export async function GET() {
  try {
    const now = Date.now();

    if (cachedResult && now - cachedAt < CACHE_TTL) {
      return NextResponse.json({ ...cachedResult, cached: true });
    }

    // Fetch all data sources in parallel
    const [crudeResult, forexResult, fpResult] = await Promise.allSettled([
      fetchCrudePrice(),
      fetchUsdPhp(),
      scrapeFuelPricePH(),
    ]);

    const crude =
      crudeResult.status === "fulfilled" ? crudeResult.value : null;
    const forex =
      forexResult.status === "fulfilled" ? forexResult.value : null;
    const fp = fpResult.status === "fulfilled" ? fpResult.value : null;

    // Generate forecast
    const forecast = generateForecast({
      currentCrude: crude?.price ?? 0,
      previousCrude: crude?.previousPrice ?? null,
      currentForex: forex?.rate ?? 0,
      previousForex: forex?.previousRate ?? null,
      history: fp?.history ?? [],
    });

    const result = {
      forecast,
      market: {
        crude: crude
          ? {
              price: crude.price,
              previousPrice: crude.previousPrice,
              change: crude.previousPrice
                ? Math.round((crude.price - crude.previousPrice) * 100) / 100
                : null,
              source: crude.source,
              date: crude.date,
            }
          : null,
        forex: forex
          ? {
              rate: forex.rate,
              source: forex.source,
            }
          : null,
      },
      history: fp?.history ?? [],
      errors: {
        crude:
          crudeResult.status === "rejected"
            ? crudeResult.reason?.message
            : null,
        forex:
          forexResult.status === "rejected"
            ? forexResult.reason?.message
            : null,
        prices:
          fpResult.status === "rejected" ? fpResult.reason?.message : null,
      },
    };

    cachedResult = result;
    cachedAt = now;

    return NextResponse.json({ ...result, cached: false });
  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate forecast",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
