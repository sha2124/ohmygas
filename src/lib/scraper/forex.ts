/**
 * Fetches the current USD/PHP exchange rate from a free API.
 */
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

  if (!rate) {
    throw new Error("PHP rate not found in response");
  }

  return {
    rate,
    previousRate: null, // free API doesn't provide historical; we'll track over time
    source: "open.er-api.com",
  };
}
