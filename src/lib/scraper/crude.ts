/**
 * Fetches crude oil price data from free sources.
 * Uses multiple fallbacks since free crude oil APIs are limited.
 */

interface CrudePrice {
  price: number;
  previousPrice: number | null;
  currency: string;
  source: string;
  date: string;
}

/**
 * Fetches Brent crude price from a free data source.
 * Note: Dubai crude (used for PH pricing) closely tracks Brent
 * with a small discount (~$1-3). We use Brent as a proxy.
 */
export async function fetchCrudePrice(): Promise<CrudePrice> {
  // Try fetching from the free commodity data endpoint
  const errors: string[] = [];

  // Attempt 1: Yahoo Finance API (unofficial but reliable)
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/BZ=F?interval=1d&range=5d",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; OhmyGas/1.0)",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const result = data.chart?.result?.[0];
      const closes = result?.indicators?.quote?.[0]?.close;

      if (closes && closes.length >= 2) {
        const validCloses = closes.filter((c: number | null) => c !== null);
        const current = validCloses[validCloses.length - 1];
        const previous = validCloses[validCloses.length - 2];

        return {
          price: Math.round(current * 100) / 100,
          previousPrice: Math.round(previous * 100) / 100,
          currency: "USD",
          source: "Yahoo Finance (Brent)",
          date: new Date().toISOString().split("T")[0],
        };
      }
    }
  } catch (e) {
    errors.push(`Yahoo: ${e instanceof Error ? e.message : "failed"}`);
  }

  // Attempt 2: Use the data we already have from fuelprice.ph scraper
  try {
    const { scrapeFuelPricePH } = await import("./fuelprice");
    const fpData = await scrapeFuelPricePH();
    const crudeStr = fpData.meta.dubaiCrude;
    const price = parseFloat(crudeStr.replace(/[^0-9.]/g, ""));

    if (price > 0) {
      return {
        price,
        previousPrice: null,
        currency: "USD",
        source: "fuelprice.ph (Dubai Crude)",
        date: fpData.meta.updated,
      };
    }
  } catch (e) {
    errors.push(`fuelprice.ph: ${e instanceof Error ? e.message : "failed"}`);
  }

  throw new Error(
    `Could not fetch crude oil price. Errors: ${errors.join("; ")}`
  );
}
