"use client";

import { FuelPrice } from "@/lib/types";

interface PriceTableProps {
  prices: FuelPrice[];
}

function SourceBadge({ source, votes }: { source?: string; votes?: number }) {
  if (source === "community") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow-light px-1.5 py-0.5 text-[10px] font-medium text-brand-yellow">
        Community
        {votes && votes > 1 && (
          <span className="text-brand-yellow/60">+{votes - 1}</span>
        )}
      </span>
    );
  }
  return null;
}

function TrendArrow({ change }: { change: number | null }) {
  if (change === null) return null;
  if (change > 0) return <span className="text-brand-red">↑</span>;
  if (change < 0) return <span className="text-brand-green">↓</span>;
  return <span className="text-gray-400">→</span>;
}

export default function PriceTable({ prices }: PriceTableProps) {
  if (prices.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-gray-400">
        No prices available for this selection.
      </div>
    );
  }

  // Sort by price (cheapest first)
  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const cheapestPrice = sorted[0]?.price;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3 text-right">Price/L</th>
            <th className="px-4 py-3 text-right">
              <div className="flex flex-col items-end">
                <span>vs Last Wk</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const change =
              p.previousPrice !== null ? p.price - p.previousPrice : null;
            const isCheapest = p.price === cheapestPrice;

            return (
              <tr
                key={`${p.brand}-${p.fuelType}-${p.source}-${i}`}
                className={`border-b border-gray-50 ${isCheapest ? "bg-brand-green-light" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brand-charcoal">
                      {p.brand}
                    </span>
                    {isCheapest && (
                      <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Cheapest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(p.city || p.station) && (
                      <p className="text-xs text-gray-400">
                        {[p.city, p.station].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <SourceBadge source={p.source} votes={p.votes} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-lg font-bold text-brand-charcoal">
                    ₱{p.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {change !== null ? (
                    <div className="flex items-center justify-end gap-1">
                      <TrendArrow change={change} />
                      <span
                        className={`text-sm font-medium ${
                          change > 0
                            ? "text-brand-red"
                            : change < 0
                              ? "text-brand-green"
                              : "text-gray-400"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        ₱{Math.abs(change).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
