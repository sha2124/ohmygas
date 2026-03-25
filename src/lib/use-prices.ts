"use client";

import { useState, useEffect } from "react";
import { FuelPrice } from "./types";
import { SAMPLE_PRICES, SAMPLE_FORECAST } from "./sample-data";

interface PriceData {
  prices: FuelPrice[];
  meta: {
    week: string;
    updated: string;
    nextAdj: string;
    dubaiCrude: string;
    usdPhp: string;
  } | null;
  forecast: typeof SAMPLE_FORECAST;
  loading: boolean;
  error: string | null;
  isLive: boolean;
  staleWarning: string | null;
}

export function usePrices(): PriceData {
  const [liveNCR, setLiveNCR] = useState<FuelPrice[]>([]);
  const [meta, setMeta] = useState<PriceData["meta"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [staleWarning, setStaleWarning] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        if (data.prices && data.prices.length > 0) {
          // Check if scraped data is stale (more than 7 days old)
          const updatedDate = new Date(data.meta?.updated || "");
          const daysSinceUpdate = Math.floor(
            (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceUpdate > 7) {
            // Data source is stale — don't use it, fall back to sample data
            setStaleWarning(
              `Live source last updated ${data.meta?.updated}. Using estimated prices.`
            );
          } else {
            setLiveNCR(data.prices);
            setIsLive(true);
          }
          setMeta(data.meta);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  // Only use live NCR data if it's fresh, otherwise use sample data everywhere
  const provincialPrices = SAMPLE_PRICES.filter((p) => p.region !== "NCR");

  const prices =
    isLive && liveNCR.length > 0
      ? [...liveNCR, ...provincialPrices]
      : SAMPLE_PRICES;

  return {
    prices,
    meta,
    forecast: SAMPLE_FORECAST,
    loading,
    error,
    isLive,
    staleWarning,
  };
}
