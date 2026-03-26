"use client";

export function PriceTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
      <div className="border-b border-gray-100 px-4 py-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="h-3 w-12 rounded bg-gray-200" />
        <div className="h-3 w-16 rounded bg-gray-200" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border-b border-gray-50 px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-4 w-14 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gray-200" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-5 w-28 rounded bg-gray-200" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function MarketSkeleton() {
  return (
    <div className="flex justify-center gap-4 rounded-lg bg-white px-4 py-3 shadow-sm animate-pulse">
      <div className="h-3 w-32 rounded bg-gray-200" />
      <div className="h-3 w-28 rounded bg-gray-200" />
    </div>
  );
}
