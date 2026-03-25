import { NextResponse } from "next/server";
import { scrapeFuelPricePH } from "@/lib/scraper/fuelprice";

// Cache scraped data in memory (refreshes every 6 hours on serverless cold start,
// or on revalidation via Next.js ISR)
let cachedData: Awaited<ReturnType<typeof scrapeFuelPricePH>> | null = null;
let cachedAt: number = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  try {
    const now = Date.now();

    if (cachedData && now - cachedAt < CACHE_TTL) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
        cachedAt: new Date(cachedAt).toISOString(),
      });
    }

    const data = await scrapeFuelPricePH();
    cachedData = data;
    cachedAt = now;

    return NextResponse.json({
      ...data,
      cached: false,
      cachedAt: new Date(now).toISOString(),
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch fuel prices",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
