import { FuelPrice, FuelType } from "../types";

interface FPBrandEntry {
  brand: string;
  price: number;
  prev: number;
  verified: string;
}

interface FPData {
  week: string;
  updated: string;
  nextAdj: string;
  dubaiCrude: string;
  usdPhp: string;
  prices: {
    unl91: FPBrandEntry[];
    prem95: FPBrandEntry[];
    diesel: FPBrandEntry[];
  };
  ranges: Record<string, { lo: number; hi: number; chgLo: number; chgHi: number }>;
  history: Array<{ w: string; u91: number; d: number }>;
}

const FUEL_TYPE_MAP: Record<string, FuelType> = {
  unl91: "RON 91",
  prem95: "RON 95",
  diesel: "Diesel",
};

/**
 * Fetches and parses fuel price data from fuelprice.ph
 * The site stores all data in a JS file as a global `FP` object.
 */
export async function scrapeFuelPricePH(): Promise<{
  prices: FuelPrice[];
  meta: {
    week: string;
    updated: string;
    nextAdj: string;
    dubaiCrude: string;
    usdPhp: string;
  };
  history: Array<{ week: string; gasoline: number; diesel: number }>;
}> {
  const cacheBuster = Date.now();
  const url = `https://fuelprice.ph/js/fuelprice.js?v=${cacheBuster}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; OhmyGas/1.0; fuel price comparison)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fuelprice.js: ${response.status}`);
  }

  const jsText = await response.text();
  const fpData = parseJSObject(jsText);

  const prices: FuelPrice[] = [];

  for (const [fuelKey, fuelType] of Object.entries(FUEL_TYPE_MAP)) {
    const entries = fpData.prices[fuelKey as keyof typeof fpData.prices];
    if (!entries) continue;

    for (const entry of entries) {
      prices.push({
        brand: entry.brand,
        region: "NCR",
        province: "Metro Manila",
        city: "Metro Manila",
        fuelType,
        price: entry.price,
        previousPrice: entry.prev,
        updatedAt: parseUpdatedDate(fpData.updated),
      });
    }
  }

  const history = (fpData.history || []).map((h) => ({
    week: h.w,
    gasoline: h.u91,
    diesel: h.d,
  }));

  return {
    prices,
    meta: {
      week: fpData.week,
      updated: fpData.updated,
      nextAdj: fpData.nextAdj,
      dubaiCrude: fpData.dubaiCrude,
      usdPhp: fpData.usdPhp,
    },
    history,
  };
}

/**
 * Parses the JS file content to extract the FP object.
 * The file contains `var FP = { ... };` with JS object notation
 * (unquoted keys, trailing commas, single quotes).
 */
function parseJSObject(jsText: string): FPData {
  // Extract the object between `var FP = {` and the closing `};`
  const match = jsText.match(/var\s+FP\s*=\s*\{([\s\S]*)\}\s*;?\s*$/);
  if (!match) {
    throw new Error("Could not find FP object in fuelprice.js");
  }

  let objStr = "{" + match[1] + "}";

  // Convert JS object notation to valid JSON:
  // 1. Quote unquoted keys
  objStr = objStr.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
  // 2. Replace single quotes with double quotes
  objStr = objStr.replace(/'/g, '"');
  // 3. Remove trailing commas before } or ]
  objStr = objStr.replace(/,\s*([}\]])/g, "$1");
  // 4. Remove JS comments
  objStr = objStr.replace(/\/\/[^\n]*/g, "");
  // 5. Remove function calls or non-JSON values — replace with null
  objStr = objStr.replace(/:\s*function\s*\([^)]*\)\s*\{[^}]*\}/g, ": null");

  try {
    return JSON.parse(objStr);
  } catch (e) {
    // If full parse fails, try to extract just the prices section
    return extractPricesManually(jsText);
  }
}

/**
 * Fallback: manually extract price arrays using regex
 */
function extractPricesManually(jsText: string): FPData {
  const result: FPData = {
    week: extractStringField(jsText, "week") || "",
    updated: extractStringField(jsText, "updated") || "",
    nextAdj: extractStringField(jsText, "nextAdj") || "",
    dubaiCrude: extractStringField(jsText, "dubaiCrude") || "",
    usdPhp: extractStringField(jsText, "usdPhp") || "",
    prices: {
      unl91: extractPriceArray(jsText, "unl91"),
      prem95: extractPriceArray(jsText, "prem95"),
      diesel: extractPriceArray(jsText, "diesel"),
    },
    ranges: {},
    history: [],
  };

  return result;
}

function extractStringField(js: string, field: string): string | null {
  const re = new RegExp(`${field}\\s*:\\s*['"]([^'"]+)['"]`);
  const m = js.match(re);
  return m ? m[1] : null;
}

function extractPriceArray(js: string, fuelKey: string): FPBrandEntry[] {
  // Find the array for this fuel type
  const re = new RegExp(
    `${fuelKey}\\s*:\\s*\\[([\\s\\S]*?)\\]`,
  );
  const m = js.match(re);
  if (!m) return [];

  const entries: FPBrandEntry[] = [];
  // Match each object in the array
  const objRegex = /\{([^}]+)\}/g;
  let objMatch;

  while ((objMatch = objRegex.exec(m[1])) !== null) {
    const objStr = objMatch[1];
    const brand = extractStringField(objStr, "brand");
    const price = extractNumberField(objStr, "price");
    const prev = extractNumberField(objStr, "prev");
    const verified = extractStringField(objStr, "verified");

    if (brand && price !== null) {
      entries.push({
        brand,
        price,
        prev: prev ?? 0,
        verified: verified ?? "",
      });
    }
  }

  return entries;
}

function extractNumberField(str: string, field: string): number | null {
  const re = new RegExp(`${field}\\s*:\\s*([\\d.]+)`);
  const m = str.match(re);
  return m ? parseFloat(m[1]) : null;
}

function parseUpdatedDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // fall through
  }
  return new Date().toISOString().split("T")[0];
}
