"use client";

import { useMemo } from "react";
import { FuelPrice } from "@/lib/types";

interface PriceCardsProps {
  prices: FuelPrice[];
}

interface BrandGroup {
  brand: string;
  city?: string;
  station?: string;
  source?: string;
  votes?: number;
  fuels: {
    fuelType: string;
    price: number;
    previousPrice: number | null;
  }[];
}

function SourceBadge({ source }: { source?: string }) {
  if (source === "community") {
    return (
      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
        User
      </span>
    );
  }
  if (source === "estimated") {
    return (
      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
        Est.
      </span>
    );
  }
  return null;
}

const FUEL_LABELS: Record<string, string> = {
  "RON 91": "Regular",
  "RON 95": "Premium",
  "RON 97": "Super",
  "Diesel": "Diesel",
  "Diesel Plus": "D. Plus",
};

const FUEL_ORDER = ["Diesel", "RON 91", "RON 95", "RON 97", "Diesel Plus"];

export default function PriceCards({ prices }: PriceCardsProps) {
  const groups = useMemo(() => {
    const map = new Map<string, BrandGroup>();

    for (const p of prices) {
      const key = `${p.brand}|${p.region}|${p.province}|${p.city || ""}`;
      let group = map.get(key);
      if (!group) {
        group = {
          brand: p.brand,
          city: p.city,
          station: p.station,
          source: p.source,
          votes: p.votes,
          fuels: [],
        };
        map.set(key, group);
      }
      group.fuels.push({
        fuelType: p.fuelType,
        price: p.price,
        previousPrice: p.previousPrice,
      });
    }

    const arr = Array.from(map.values());
    // Sort fuels within each group
    for (const g of arr) {
      g.fuels.sort(
        (a, b) => FUEL_ORDER.indexOf(a.fuelType) - FUEL_ORDER.indexOf(b.fuelType)
      );
    }
    // Sort groups by cheapest diesel/first fuel
    arr.sort((a, b) => {
      const aD = a.fuels.find((f) => f.fuelType === "Diesel")?.price ?? a.fuels[0]?.price ?? 999;
      const bD = b.fuels.find((f) => f.fuelType === "Diesel")?.price ?? b.fuels[0]?.price ?? 999;
      return aD - bD;
    });

    return arr;
  }, [prices]);

  if (groups.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center">
        <p className="font-medium text-gray-500">No prices found</p>
        <p className="mt-1 text-xs text-gray-400">
          Try changing your filters, or report a price to help fill this gap.
        </p>
      </div>
    );
  }

  // Find cheapest per fuel type
  const cheapestByFuel = new Map<string, number>();
  for (const g of groups) {
    for (const f of g.fuels) {
      const current = cheapestByFuel.get(f.fuelType);
      if (current === undefined || f.price < current) {
        cheapestByFuel.set(f.fuelType, f.price);
      }
    }
  }

  const PAGE_SIZE = 20;
  const displayed = groups.slice(0, PAGE_SIZE);
  const hasMore = groups.length > PAGE_SIZE;

  return (
    <div className="flex flex-col gap-2">
      {/* Compact brand rows */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm divide-y divide-gray-50">
        {displayed.map((group, i) => {
          const isTop = i === 0;
          return (
            <div
              key={`${group.brand}-${group.city || ""}-${i}`}
              className={`px-4 py-3 ${isTop ? "bg-brand-green-light" : ""}`}
            >
              {/* Brand header row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-charcoal">{group.brand}</span>
                  {isTop && (
                    <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Best
                    </span>
                  )}
                  <SourceBadge source={group.source} />
                </div>
                {group.city && (
                  <span className="text-[11px] text-gray-400 truncate ml-2 max-w-[120px]">
                    {group.city}
                  </span>
                )}
              </div>

              {/* Fuel prices row */}
              <div className="flex gap-3 overflow-x-auto">
                {group.fuels.map((fuel) => {
                  const isCheapest = cheapestByFuel.get(fuel.fuelType) === fuel.price;
                  const change =
                    fuel.previousPrice !== null ? fuel.price - fuel.previousPrice : null;

                  return (
                    <div key={fuel.fuelType} className="flex flex-col items-center min-w-[70px]">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {FUEL_LABELS[fuel.fuelType] || fuel.fuelType}
                      </span>
                      <span
                        className={`text-base font-bold ${
                          isCheapest ? "text-brand-green" : "text-brand-charcoal"
                        }`}
                      >
                        ₱{fuel.price.toFixed(2)}
                      </span>
                      {change !== null && (
                        <span
                          className={`text-[10px] font-medium ${
                            change > 0
                              ? "text-brand-red"
                              : change < 0
                                ? "text-brand-green"
                                : "text-gray-300"
                          }`}
                        >
                          {change > 0 ? "↑" : change < 0 ? "↓" : "—"}
                          {change !== 0 && `₱${Math.abs(change).toFixed(2)}`}
                          {fuel.previousPrice !== null && (
                            <span className="text-gray-300">
                              {" "}prev ₱{fuel.previousPrice.toFixed(2)}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <p className="text-center text-xs text-gray-400 py-1">
          Showing {PAGE_SIZE} of {groups.length} brands. Filter by region or province to see more.
        </p>
      )}
    </div>
  );
}
