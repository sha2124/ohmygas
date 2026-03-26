import * as cheerio from "cheerio";
import { FuelPrice, FuelType } from "../types";

const EXPRESSWAY_URL = "https://www.expressway.ph/fuel-prices";

const FUEL_TYPE_MAP: Record<string, FuelType> = {
  "gasoline": "RON 91",
  "regular": "RON 91",
  "unleaded": "RON 91",
  "ron 91": "RON 91",
  "premium": "RON 95",
  "ron 95": "RON 95",
  "super premium": "RON 97",
  "ron 97": "RON 97",
  "diesel": "Diesel",
  "diesel plus": "Diesel Plus",
};

function parseFuelType(text: string): FuelType | null {
  const normalized = text.trim().toLowerCase();
  for (const [key, ft] of Object.entries(FUEL_TYPE_MAP)) {
    if (normalized.includes(key)) return ft;
  }
  return null;
}

/**
 * Scrape fuel prices from expressway.ph
 * They publish weekly NCR pump prices in server-rendered HTML tables.
 */
export async function scrapeExpressway(): Promise<{
  prices: FuelPrice[];
  updated: string;
}> {
  const response = await fetch(EXPRESSWAY_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; OhmyGas/1.0; fuel price comparison)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch expressway.ph: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const prices: FuelPrice[] = [];
  let updated = new Date().toISOString().split("T")[0];

  // Look for date in the page
  const dateText = $("time, .date, .updated").first().text().trim();
  if (dateText) {
    const parsed = new Date(dateText);
    if (!isNaN(parsed.getTime())) {
      updated = parsed.toISOString().split("T")[0];
    }
  }

  // Also check for "as of" text patterns
  $("p, span, div").each((_, el) => {
    const text = $(el).text();
    const dateMatch = text.match(
      /(?:as of|updated|effective)\s+(\w+\s+\d{1,2},?\s+\d{4})/i
    );
    if (dateMatch) {
      const parsed = new Date(dateMatch[1]);
      if (!isNaN(parsed.getTime())) {
        updated = parsed.toISOString().split("T")[0];
      }
    }
  });

  // Try to find brand-specific pages linked from the main page
  const brandLinks: string[] = [];
  $("a[href*='/fuel-prices/']").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.endsWith("/fuel-prices") && !href.endsWith("/fuel-prices/")) {
      const fullUrl = href.startsWith("http")
        ? href
        : `https://www.expressway.ph${href}`;
      brandLinks.push(fullUrl);
    }
  });

  // Parse any tables on the main page
  $("table").each((_, table) => {
    const rows = $(table).find("tr");
    rows.each((i, row) => {
      if (i === 0) return; // skip header
      const cells = $(row).find("td");
      if (cells.length >= 3) {
        const brand = $(cells[0]).text().trim();
        const fuelTypeText = $(cells[1]).text().trim();
        const priceText = $(cells[2])
          .text()
          .trim()
          .replace(/[₱,\s]/g, "");
        const prevText =
          cells.length > 3
            ? $(cells[3])
                .text()
                .trim()
                .replace(/[₱,\s]/g, "")
            : "";

        const fuelType = parseFuelType(fuelTypeText);
        const price = parseFloat(priceText);
        const prevPrice = prevText ? parseFloat(prevText) : null;

        if (brand && fuelType && !isNaN(price)) {
          prices.push({
            brand,
            region: "NCR",
            province: "Metro Manila",
            city: "Metro Manila",
            fuelType,
            price,
            previousPrice: isNaN(prevPrice as number) ? null : prevPrice,
            updatedAt: updated,
          });
        }
      }
    });
  });

  // Also try parsing card/list formats (some sites use divs instead of tables)
  if (prices.length === 0) {
    $(".brand-card, .fuel-card, .price-card, [class*='brand'], [class*='fuel']").each(
      (_, card) => {
        const brand = $(card).find("h2, h3, h4, .brand-name, .name").first().text().trim();
        $(card)
          .find(".price-row, .fuel-row, tr, li")
          .each((_, row) => {
            const text = $(row).text();
            const fuelMatch = text.match(
              /(RON\s*9[1-7]|Diesel(?:\s+Plus)?|Regular|Premium|Unleaded)/i
            );
            const priceMatch = text.match(/₱?\s*([\d.]+)/);

            if (brand && fuelMatch && priceMatch) {
              const fuelType = parseFuelType(fuelMatch[1]);
              const price = parseFloat(priceMatch[1]);
              if (fuelType && !isNaN(price) && price > 20 && price < 200) {
                prices.push({
                  brand,
                  region: "NCR",
                  province: "Metro Manila",
                  city: "Metro Manila",
                  fuelType,
                  price,
                  previousPrice: null,
                  updatedAt: updated,
                });
              }
            }
          });
      }
    );
  }

  return { prices, updated };
}
