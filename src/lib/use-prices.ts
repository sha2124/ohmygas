"use client";

import { useState, useEffect, useCallback } from "react";
import { FuelPrice, ForecastData } from "./types";
import { SAMPLE_PRICES, SAMPLE_FORECAST } from "./sample-data";

interface MarketData {
  crude: { price: number; previousPrice: number | null; change: number | null; source: string } | null;
  forex: { rate: number; source: string } | null;
}

interface PriceData {
  prices: FuelPrice[];
  meta: {
    week: string;
    updated: string;
    nextAdj: string;
    dubaiCrude: string;
    usdPhp: string;
  } | null;
  forecast: ForecastData;
  market: MarketData | null;
  history: Array<{ week: string; gasoline: number; diesel: number }>;
  loading: boolean;
  error: string | null;
  isLive: boolean;
  staleWarning: string | null;
  sources: string[];
  communityCount: number;
  estimatedCount: number;
  refresh: () => void;
}

export function usePrices(): PriceData {
  const [refreshKey, setRefreshKey] = useState(0);
  const [liveNCR, setLiveNCR] = useState<FuelPrice[]>([]);
  const [meta, setMeta] = useState<PriceData["meta"]>(null);
  const [forecast, setForecast] = useState<ForecastData>(SAMPLE_FORECAST);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [history, setHistory] = useState<PriceData["history"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [staleWarning, setStaleWarning] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [communityCount, setCommunityCount] = useState(0);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      const [pricesRes, forecastRes] = await Promise.allSettled([
        fetch("/api/prices").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
        fetch("/api/forecast").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      ]);

      if (pricesRes.status === "fulfilled") {
        const data = pricesRes.value;
        if (data.prices?.length > 0) {
          const updatedDate = new Date(data.meta?.updated || "");
          const daysSinceUpdate = Math.floor(
            (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Always use live data if available, even if stale — don't silently swap to sample data
          if (data.prices.length > 0) {
            setLiveNCR(data.prices);
            if (daysSinceUpdate <= 7) {
              setIsLive(true);
            } else {
              setStaleWarning(
                `Live source last updated ${data.meta?.updated}. Prices may be outdated.`
              );
              // Still show scraped data, but mark it clearly
              setIsLive(false);
            }
          }
          setMeta(data.meta);
        }
        if (data.sources) setSources(data.sources);
        if (data.communityCount != null) setCommunityCount(data.communityCount);
      } else {
        setError("Failed to fetch prices");
      }

      if (forecastRes.status === "fulfilled") {
        const data = forecastRes.value;
        if (data.forecast) setForecast(data.forecast);
        if (data.market) setMarket(data.market);
        if (data.history) setHistory(data.history);
      }

      setLoading(false);
    }
    fetchAll();
  }, [refreshKey]);

  // Provincial prices are estimated (sample data) — always tagged
  const provincialPrices = SAMPLE_PRICES.filter((p) => p.region !== "NCR").map(
    (p) => ({ ...p, source: "estimated" as const })
  );

  let prices: FuelPrice[];
  let estimatedCount = 0;

  if (liveNCR.length > 0) {
    // Live NCR data + estimated provincial
    prices = [...liveNCR, ...provincialPrices];
    estimatedCount = provincialPrices.length;
  } else {
    // All estimated
    prices = SAMPLE_PRICES.map((p) => ({ ...p, source: "estimated" as const }));
    estimatedCount = prices.length;
  }

  return { prices, meta, forecast, market, history, loading, error, isLive, staleWarning, sources, communityCount, estimatedCount, refresh };
}
