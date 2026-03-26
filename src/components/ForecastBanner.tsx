"use client";

import { ForecastData } from "@/lib/types";

interface ForecastBannerProps {
  forecast: ForecastData;
}

export default function ForecastBanner({ forecast }: ForecastBannerProps) {
  const isUp = forecast.direction === "up";
  const isDown = forecast.direction === "down";

  const bgColor = isUp
    ? "bg-brand-red-light border-brand-red"
    : isDown
      ? "bg-brand-green-light border-brand-green"
      : "bg-brand-yellow-light border-brand-yellow";

  const textColor = isUp
    ? "text-brand-red"
    : isDown
      ? "text-brand-green"
      : "text-brand-yellow";

  const arrow = isUp ? "↑" : isDown ? "↓" : "→";
  const label = isUp ? "PRICE HIKE" : isDown ? "PRICE DROP" : "STEADY";

  const actionText = isUp
    ? "Consider filling up before Tuesday!"
    : isDown
      ? "You may want to wait for the price drop."
      : "Prices expected to stay about the same.";

  const formattedDate = new Date(forecast.effectiveDate).toLocaleDateString(
    "en-PH",
    { weekday: "long", month: "short", day: "numeric" }
  );

  return (
    <div className={`rounded-xl border-2 p-4 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold ${textColor}`}>{arrow}</span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${textColor}`}
              >
                {label}
              </span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-gray-500">
                {forecast.confidence} confidence
              </span>
            </div>
            <p className="mt-0.5 text-lg font-bold text-brand-charcoal">
              {isUp ? "+" : isDown ? "-" : ""}₱{forecast.estimatedChange.toFixed(2)}/L
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Expected</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{actionText}</p>
      <p className="mt-2 rounded bg-white/50 px-2 py-1 text-[11px] text-gray-500">
        Forecast based on crude oil &amp; forex trends. Actual DOE adjustments may differ.
      </p>
    </div>
  );
}
