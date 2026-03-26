"use client";

import { useMemo, useState, useCallback } from "react";
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
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
        <span>User</span>
        {votes != null && votes > 1 && (
          <span className="text-amber-500">{votes}x</span>
        )}
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
  Diesel: "Diesel",
  "Diesel Plus": "D. Plus",
};

const FUEL_ORDER = ["Diesel", "RON 91", "RON 95", "RON 97", "Diesel Plus"];

const PAGE_SIZE = 20;

export default function PriceCards({ prices }: PriceCardsProps) {
  const [showAll, setShowAll] = useState(false);

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
    for (const g of arr) {
      g.fuels.sort(
        (a, b) => FUEL_ORDER.indexOf(a.fuelType) - FUEL_ORDER.indexOf(b.fuelType),
      );
    }
    arr.sort((a, b) => {
      const aD =
        a.fuels.find((f) => f.fuelType === "Diesel")?.price ??
        a.fuels[0]?.price ??
        999;
      const bD =
        b.fuels.find((f) => f.fuelType === "Diesel")?.price ??
        b.fuels[0]?.price ??
        999;
      return aD - bD;
    });

    return arr;
  }, [prices]);

  // Find cheapest per fuel type
  const cheapestByFuel = useMemo(() => {
    const m = new Map<string, number>();
    for (const g of groups) {
      for (const f of g.fuels) {
        const current = m.get(f.fuelType);
        if (current === undefined || f.price < current) {
          m.set(f.fuelType, f.price);
        }
      }
    }
    return m;
  }, [groups]);

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="font-medium text-gray-500">No prices found</p>
        <p className="mt-1 text-xs text-gray-400">
          Try changing your filters, or report a price to help fill this gap.
        </p>
      </div>
    );
  }

  const displayed = showAll ? groups : groups.slice(0, PAGE_SIZE);
  const hasMore = groups.length > PAGE_SIZE;

  return (
    <div className="flex flex-col gap-2">
      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm">
        {displayed.map((group, i) => (
          <BrandRow
            key={`${group.brand}-${group.city || ""}-${i}`}
            group={group}
            isTop={i === 0}
            cheapestByFuel={cheapestByFuel}
          />
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="rounded-xl bg-white py-2.5 text-center text-sm font-medium text-brand-green shadow-sm hover:bg-brand-green-light"
        >
          Show all {groups.length} brands
        </button>
      )}
    </div>
  );
}

function BrandRow({
  group,
  isTop,
  cheapestByFuel,
}: {
  group: BrandGroup;
  isTop: boolean;
  cheapestByFuel: Map<string, number>;
}) {
  const handleUpvote = useCallback(async () => {
    // Community price upvote (best-effort, no blocking UI)
    try {
      await fetch("/api/submit-price", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: group.station }), // station used as proxy
      });
    } catch {
      // silent
    }
  }, [group.station]);

  return (
    <div className={`px-4 py-3 ${isTop ? "bg-brand-green-light" : ""}`}>
      {/* Brand header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-charcoal">{group.brand}</span>
          {isTop && (
            <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Best
            </span>
          )}
          <SourceBadge source={group.source} votes={group.votes} />
        </div>
        <div className="flex items-center gap-2">
          {group.city && (
            <span className="max-w-[120px] truncate text-[11px] text-gray-400">
              {group.city}
            </span>
          )}
          {group.source === "community" && (
            <button
              onClick={handleUpvote}
              className="rounded-full bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400 hover:bg-brand-green-light hover:text-brand-green"
              title="Confirm this price"
            >
              +1
            </button>
          )}
        </div>
      </div>

      {/* Fuel prices */}
      <div className="scrollbar-hide flex gap-3 overflow-x-auto">
        {group.fuels.map((fuel) => {
          const isCheapest = cheapestByFuel.get(fuel.fuelType) === fuel.price;
          const change =
            fuel.previousPrice !== null ? fuel.price - fuel.previousPrice : null;

          return (
            <div key={fuel.fuelType} className="flex min-w-[70px] flex-col items-center">
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
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
