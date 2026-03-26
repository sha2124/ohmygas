/**
 * Fetches the current USD/PHP exchange rate.
 * Tracks previous rate in memory so forecast model can calculate forex impact.
 */

let lastRate: number | null = null;
let lastFetchedAt: number = 0;

export async function fetchUsdPhp(): Promise<{
  rate: number;
  previousRate: number | null;
  source: string;
}> {
  // Try ExchangeRate API (free tier: 1,500 req/month)
  const res = await fetch(
    "https://open.er-api.com/v6/latest/USD",
    { next: { revalidate: 3600 } } // cache for 1 hour
  );

  if (!res.ok) {
    throw new Error(`Forex API returned ${res.status}`);
  }

  const data = await res.json();
  const rate = data.rates?.PHP;

  if (!rate || rate < 40 || rate > 120) {
    throw new Error("PHP rate not found or out of range in response");
  }

  // Store previous rate for delta calculation
  const previousRate = lastRate;
  const now = Date.now();

  // Only update stored rate if enough time has passed (> 12 hours)
  // so we get a meaningful delta instead of noise
  if (now - lastFetchedAt > 12 * 60 * 60 * 1000) {
    lastRate = rate;
    lastFetchedAt = now;
  }

  return {
    rate,
    previousRate,
    source: "open.er-api.com",
  };
}
