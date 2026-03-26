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

function SourceBadge({ source, votes }: { source?: string; votes?: number }) {
  if (source === "community") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        User-reported{votes && votes > 1 ? ` · ${votes} confirmed` : ""}
      </span>
    );
  }
  if (source === "estimated") {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-400">
        Estimated
      </span>
    );
  }
  return null;
}

function FuelChip({
  label,
  price,
  previousPrice,
  isCheapest,
}: {
  label: string;
  price: number;
  previousPrice: number | null;
  isCheapest: boolean;
}) {
  const change = previousPrice !== null ? price - previousPrice : null;

  return (
    <div
      className={`flex flex-col items-center rounded-lg px-2 py-2.5 ${
        isCheapest ? "bg-brand-green/5 ring-1 ring-brand-green/20" : "bg-gray-50"
      }`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span className="mt-1 text-xl font-bold text-brand-charcoal">
        <span className="text-sm font-normal text-gray-400">₱</span>
        {price.toFixed(2)}
      </span>
      {change !== null ? (
        <div className="mt-1 flex items-center gap-1">
          <span
            className={`text-[11px] font-semibold ${
              change > 0 ? "text-brand-red" : change < 0 ? "text-brand-green" : "text-gray-400"
            }`}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : "—"}
            {change !== 0 && ` ₱${Math.abs(change).toFixed(2)}`}
          </span>
          {previousPrice !== null && (
            <span className="text-[10px] text-gray-300">
              prev ₱{previousPrice.toFixed(2)}
            </span>
          )}
        </div>
      ) : (
        <span className="mt-1 text-[11px] text-gray-300">—</span>
      )}
    </div>
  );
}

const FUEL_LABELS: Record<string, string> = {
  "RON 91": "Regular",
  "RON 95": "Premium",
  "RON 97": "Super",
  "Diesel": "Diesel",
  "Diesel Plus": "D. Plus",
};

// Display order
const FUEL_ORDER = ["Diesel", "RON 91", "RON 95", "RON 97", "Diesel Plus"];

export default function PriceCards({ prices }: PriceCardsProps) {
  // Group prices by brand + location
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

    // Sort by cheapest diesel or first fuel
    const arr = Array.from(map.values());
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

  // Find cheapest per fuel type across all groups
  const cheapestByFuel = new Map<string, number>();
  for (const g of groups) {
    for (const f of g.fuels) {
      const current = cheapestByFuel.get(f.fuelType);
      if (current === undefined || f.price < current) {
        cheapestByFuel.set(f.fuelType, f.price);
      }
    }
  }

  // Paginate
  const PAGE_SIZE = 20;
  const displayed = groups.slice(0, PAGE_SIZE);
  const hasMore = groups.length > PAGE_SIZE;

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Fuel prices by brand">
      {displayed.map((group, i) => {
        const isTopResult = i === 0;
        // Sort fuels by display order
        const sortedFuels = [...group.fuels].sort(
          (a, b) => FUEL_ORDER.indexOf(a.fuelType) - FUEL_ORDER.indexOf(b.fuelType)
        );

        return (
          <div
            key={`${group.brand}-${group.city || ""}-${i}`}
            className={`rounded-xl bg-white p-4 shadow-sm ${
              isTopResult ? "ring-2 ring-brand-green/30" : ""
            }`}
            role="listitem"
          >
            {/* Brand header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-brand-charcoal">
                  {group.brand}
                </span>
                {isTopResult && (
                  <span className="rounded-full bg-brand-green px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                    Best Price
                  </span>
                )}
                <SourceBadge source={group.source} votes={group.votes} />
              </div>
              {group.city && (
                <span className="text-xs text-gray-400">{group.city}</span>
              )}
            </div>

            {/* Fuel type cards grid */}
            <div
              className={`grid gap-2 ${
                sortedFuels.length <= 2
                  ? "grid-cols-2"
                  : sortedFuels.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
              }`}
            >
              {sortedFuels.map((fuel) => (
                <FuelChip
                  key={fuel.fuelType}
                  label={FUEL_LABELS[fuel.fuelType] || fuel.fuelType}
                  price={fuel.price}
                  previousPrice={fuel.previousPrice}
                  isCheapest={cheapestByFuel.get(fuel.fuelType) === fuel.price}
                />
              ))}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <p className="text-center text-xs text-gray-400 py-2">
          Showing {PAGE_SIZE} of {groups.length} brands. Filter by region or province to narrow down.
        </p>
      )}
    </div>
  );
}
