import * as cheerio from "cheerio";
import { FuelPrice, FuelType } from "../types";
import { fetchWithTimeout, withRetry } from "./utils";

/**
 * Scrape DOE prevailing retail pump prices.
 * DOE publishes weekly price data at:
 *   https://www.doe.gov.ph/retail-pump-prices-metro-manila
 *   https://www.doe.gov.ph/retail-pump-prices-visayas
 *   https://www.doe.gov.ph/retail-pump-prices-mindanao
 *
 * Falls back gracefully — this is a best-effort provincial data source.
 */

const DOE_PAGES = [
  {
    url: "https://www.doe.gov.ph/retail-pump-prices-metro-manila",
    region: "NCR",
    province: "Metro Manila",
  },
  {
    url: "https://www.doe.gov.ph/retail-pump-prices-visayas",
    region: "Visayas",
    province: "Visayas",
  },
  {
    url: "https://www.doe.gov.ph/retail-pump-prices-mindanao",
    region: "Mindanao",
    province: "Mindanao",
  },
];

const FUEL_TYPE_MAP: Record<string, FuelType> = {
  gasoline: "RON 91",
  "ron 91": "RON 91",
  "ron 95": "RON 95",
  "ron 97": "RON 97",
  unleaded: "RON 91",
  premium: "RON 95",
  diesel: "Diesel",
  "diesel plus": "Diesel Plus",
  "auto lpg": "Diesel", // fallback
};

function matchFuelType(text: string): FuelType | null {
  const lower = text.trim().toLowerCase();
  for (const [key, ft] of Object.entries(FUEL_TYPE_MAP)) {
    if (lower.includes(key)) return ft;
  }
  return null;
}

export async function scrapeDOE(): Promise<{
  prices: FuelPrice[];
  updated: string;
}> {
  const allPrices: FuelPrice[] = [];
  let updated = new Date().toISOString().split("T")[0];

  // Try each DOE page in parallel
  const results = await Promise.allSettled(
    DOE_PAGES.map(async (page) => {
      const response = await withRetry(
        () =>
          fetchWithTimeout(page.url, {
            timeoutMs: 15_000,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (compatible; OhmyGas/1.0; fuel price comparison)",
            },
          }),
        { label: `doe:${page.region}`, maxRetries: 1 },
      );

      if (!response.ok) return { prices: [] as FuelPrice[], updated };

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try to find update date
      $("p, span, div, time").each((_, el) => {
        const text = $(el).text();
        const dateMatch = text.match(
          /(?:as of|effective|dated?)\s+(\w+\s+\d{1,2},?\s+\d{4})/i,
        );
        if (dateMatch) {
          const parsed = new Date(dateMatch[1]);
          if (!isNaN(parsed.getTime())) {
            updated = parsed.toISOString().split("T")[0];
          }
        }
      });

      const prices: FuelPrice[] = [];

      // Parse tables — DOE uses various table formats
      $("table").each((_, table) => {
        const headers: string[] = [];
        $(table)
          .find("thead tr th, thead tr td, tr:first-child th, tr:first-child td")
          .each((_, cell) => {
            headers.push($(cell).text().trim().toLowerCase());
          });

        // Find which columns are fuel types
        const fuelCols: { index: number; fuelType: FuelType }[] = [];
        headers.forEach((h, i) => {
          const ft = matchFuelType(h);
          if (ft) fuelCols.push({ index: i, fuelType: ft });
        });

        if (fuelCols.length === 0) return;

        // Parse data rows
        $(table)
          .find("tbody tr, tr")
          .each((rowIdx, row) => {
            if (rowIdx === 0 && fuelCols.length > 0) return; // skip header

            const cells = $(row).find("td");
            if (cells.length < 2) return;

            const brandOrArea = $(cells[0]).text().trim();
            if (!brandOrArea || brandOrArea.toLowerCase().includes("average"))
              return;

            for (const col of fuelCols) {
              if (col.index >= cells.length) continue;
              const priceText = $(cells[col.index])
                .text()
                .trim()
                .replace(/[₱,\s]/g, "");
              const price = parseFloat(priceText);

              if (!isNaN(price) && price > 20 && price < 200) {
                prices.push({
                  brand: brandOrArea,
                  region: page.region,
                  province: page.province,
                  fuelType: col.fuelType,
                  price,
                  previousPrice: null,
                  updatedAt: updated,
                  source: "official",
                });
              }
            }
          });
      });

      return { prices, updated };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.prices.length > 0) {
      allPrices.push(...result.value.prices);
      updated = result.value.updated;
    }
  }

  return { prices: allPrices, updated };
}
