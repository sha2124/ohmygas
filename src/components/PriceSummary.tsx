"use client";

import { useMemo } from "react";
import { FuelPrice } from "@/lib/types";

interface PriceSummaryProps {
  prices: FuelPrice[];
}

interface FuelSummary {
  fuelType: string;
  label: string;
  low: number;
  high: number;
  avg: number;
  change: number | null;
  prevAvg: number | null;
  color: string;
  bgColor: string;
}

const FUEL_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; order: number }
> = {
  Diesel: { label: "DIESEL", color: "#F5A623", bgColor: "#fef9e7", order: 0 },
  "RON 91": { label: "UNLEADED", color: "#1B7A3D", bgColor: "#e8f5ec", order: 1 },
  "RON 95": { label: "PREMIUM", color: "#6366f1", bgColor: "#eef2ff", order: 2 },
  "RON 97": { label: "SUPER", color: "#E84830", bgColor: "#fdecea", order: 3 },
  "Diesel Plus": { label: "D. PLUS", color: "#d97706", bgColor: "#fef3c7", order: 4 },
};

export default function PriceSummary({ prices }: PriceSummaryProps) {
  const summaries = useMemo(() => {
    const grouped = new Map<string, FuelPrice[]>();
    for (const p of prices) {
      const existing = grouped.get(p.fuelType) || [];
      existing.push(p);
      grouped.set(p.fuelType, existing);
    }

    const result: FuelSummary[] = [];
    for (const [fuelType, items] of grouped) {
      const config = FUEL_CONFIG[fuelType];
      if (!config) continue;

      const priceValues = items.map((p) => p.price);
      const low = Math.min(...priceValues);
      const high = Math.max(...priceValues);
      const avg = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;

      const prevPrices = items
        .filter((p) => p.previousPrice !== null)
        .map((p) => p.previousPrice as number);
      const prevAvg =
        prevPrices.length > 0
          ? prevPrices.reduce((a, b) => a + b, 0) / prevPrices.length
          : null;
      const change = prevAvg !== null ? avg - prevAvg : null;

      result.push({
        fuelType,
        label: config.label,
        low,
        high,
        avg,
        change,
        prevAvg,
        color: config.color,
        bgColor: config.bgColor,
      });
    }

    return result.sort(
      (a, b) =>
        (FUEL_CONFIG[a.fuelType]?.order ?? 99) -
        (FUEL_CONFIG[b.fuelType]?.order ?? 99),
    );
  }, [prices]);

  if (summaries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {summaries.slice(0, 3).map((s) => (
        <div
          key={s.fuelType}
          className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-sm"
        >
          {/* Color accent bar */}
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: s.color }}
          />

          <div className="mt-1 text-center">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: s.color }}
            >
              {s.label}
            </span>

            <p className="mt-2 text-2xl font-extrabold text-brand-charcoal">
              <span className="text-sm font-normal text-gray-400">₱</span>
              {s.avg.toFixed(2)}
            </p>

            <p className="text-[11px] text-gray-400">avg / litre</p>

            {s.change !== null && (
              <p className="mt-1.5 flex items-center justify-center gap-1">
                <span
                  className={`text-xs font-semibold ${
                    s.change > 0
                      ? "text-brand-red"
                      : s.change < 0
                        ? "text-brand-green"
                        : "text-gray-400"
                  }`}
                >
                  {s.change > 0 ? "▲" : s.change < 0 ? "▼" : "—"}
                  {s.change !== 0 && ` ₱${Math.abs(s.change).toFixed(2)}`}
                </span>
              </p>
            )}

            <p className="mt-1 text-[10px] text-gray-300">
              ₱{s.low.toFixed(2)} — ₱{s.high.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
