"use client";

import { useState, useEffect } from "react";
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
}

export function usePrices(): PriceData {
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

  useEffect(() => {
    async function fetchAll() {
      // Fetch prices and forecast in parallel
      const [pricesRes, forecastRes] = await Promise.allSettled([
        fetch("/api/prices").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
        fetch("/api/forecast").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      ]);

      // Handle prices
      if (pricesRes.status === "fulfilled") {
        const data = pricesRes.value;
        if (data.prices?.length > 0) {
          const updatedDate = new Date(data.meta?.updated || "");
          const daysSinceUpdate = Math.floor(
            (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceUpdate > 7) {
            setStaleWarning(
              `Live source last updated ${data.meta?.updated}. Using estimated prices.`
            );
          } else {
            setLiveNCR(data.prices);
            setIsLive(true);
          }
          setMeta(data.meta);
        }
        if (data.sources) setSources(data.sources);
        if (data.communityCount != null) setCommunityCount(data.communityCount);
      } else {
        setError("Failed to fetch prices");
      }

      // Handle forecast
      if (forecastRes.status === "fulfilled") {
        const data = forecastRes.value;
        if (data.forecast) setForecast(data.forecast);
        if (data.market) setMarket(data.market);
        if (data.history) setHistory(data.history);
      }

      setLoading(false);
    }
    fetchAll();
  }, []);

  const provincialPrices = SAMPLE_PRICES.filter((p) => p.region !== "NCR").map(
    (p) => ({ ...p, source: "scraped" as const })
  );
  const prices =
    isLive && liveNCR.length > 0
      ? [...liveNCR, ...provincialPrices]
      : SAMPLE_PRICES.map((p) => ({ ...p, source: "scraped" as const }));

  return { prices, meta, forecast, market, history, loading, error, isLive, staleWarning, sources, communityCount };
}
