"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ForecastBanner from "@/components/ForecastBanner";
import Filters from "@/components/Filters";
import PriceCards from "@/components/PriceCards";
import PriceSummary from "@/components/PriceSummary";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import SubscribeForm from "@/components/SubscribeForm";
import SubmitPriceForm from "@/components/SubmitPriceForm";
import Resources from "@/components/Resources";
import {
  PriceTableSkeleton,
  ForecastSkeleton,
  MarketSkeleton,
} from "@/components/Skeleton";
import { usePrices } from "@/lib/use-prices";
import { FuelType } from "@/lib/types";

export default function Home() {
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [brand, setBrand] = useState("all");
  const [fuelType, setFuelType] = useState<FuelType | "all">("all");

  const {
    prices,
    meta,
    forecast,
    market,
    history,
    loading,
    isLive,
    staleWarning,
    sources,
    communityCount,
    estimatedCount,
    refresh,
  } = usePrices();

  const hasFilters =
    region !== "all" ||
    province !== "all" ||
    city !== "all" ||
    brand !== "all" ||
    fuelType !== "all";

  function clearFilters() {
    setRegion("all");
    setProvince("all");
    setCity("all");
    setBrand("all");
    setFuelType("all");
  }

  const filteredPrices = useMemo(() => {
    return prices.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (province !== "all" && p.province !== province) return false;
      if (city !== "all" && p.city !== city) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (fuelType !== "all" && p.fuelType !== fuelType) return false;
      return true;
    });
  }, [prices, region, province, city, brand, fuelType]);

  const filteredEstimatedCount = useMemo(() => {
    return filteredPrices.filter((p) => p.source === "estimated").length;
  }, [filteredPrices]);

  const availableCities = useMemo(() => {
    if (province === "all") return [];
    const filtered = prices.filter((p) => p.province === province);
    return [...new Set(filtered.map((p) => p.city).filter(Boolean))] as string[];
  }, [prices, province]);

  const availableBrands = useMemo(() => {
    let filtered = prices;
    if (region !== "all") filtered = filtered.filter((p) => p.region === region);
    if (province !== "all")
      filtered = filtered.filter((p) => p.province === province);
    if (city !== "all") filtered = filtered.filter((p) => p.city === city);
    return [...new Set(filtered.map((p) => p.brand))];
  }, [prices, region, province, city]);

  const updatedAt = meta?.updated
    ? new Date(meta.updated).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : prices[0]?.updatedAt
      ? new Date(prices[0].updatedAt).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const brandCount = useMemo(() => {
    return new Set(filteredPrices.map((p) => `${p.brand}|${p.city || ""}`)).size;
  }, [filteredPrices]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4" role="main">
        <div className="flex flex-col gap-3">
          {/* Status bar */}
          {!loading && (
            <div
              className="flex items-center justify-between"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${isLive ? "animate-pulse bg-brand-green" : "bg-brand-yellow"}`}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-500">
                  {isLive ? "Live" : "Estimated"}
                </span>
                {sources.length > 0 && (
                  <span className="text-[10px] text-gray-300">
                    via {sources.join(", ")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {communityCount > 0 && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600">
                    {communityCount} community
                  </span>
                )}
                <button
                  onClick={refresh}
                  className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  title="Refresh prices"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>
          )}

          {staleWarning && (
            <p className="text-center text-xs text-yellow-600">{staleWarning}</p>
          )}

          {/* Forecast */}
          {loading ? (
            <ForecastSkeleton />
          ) : (
            <ForecastBanner forecast={forecast} />
          )}

          {/* Market indicators */}
          {loading ? (
            <MarketSkeleton />
          ) : market && (market.crude || market.forex) ? (
            <div className="flex justify-center gap-4 rounded-xl bg-white px-4 py-2.5 text-xs shadow-sm">
              {market.crude && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Crude:</span>
                  <span className="font-semibold text-brand-charcoal">
                    ${market.crude.price.toFixed(2)}
                  </span>
                  {market.crude.change !== null && (
                    <span
                      className={`font-semibold ${
                        market.crude.change > 0
                          ? "text-brand-red"
                          : market.crude.change < 0
                            ? "text-brand-green"
                            : "text-gray-400"
                      }`}
                    >
                      {market.crude.change > 0 ? "+" : ""}
                      {market.crude.change.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
              {market.forex && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">USD/PHP:</span>
                  <span className="font-semibold text-brand-charcoal">
                    ₱{market.forex.rate.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {/* Filters */}
          <Filters
            selectedRegion={region}
            selectedProvince={province}
            selectedCity={city}
            selectedBrand={brand}
            selectedFuelType={fuelType as FuelType}
            onRegionChange={setRegion}
            onProvinceChange={setProvince}
            onCityChange={setCity}
            onBrandChange={setBrand}
            onFuelTypeChange={(ft) => setFuelType(ft)}
            availableCities={availableCities}
            availableBrands={availableBrands}
            showAllFuelOption
          />

          {/* Results count + meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `${brandCount} brand${brandCount !== 1 ? "s" : ""}`}
              </p>
              {!loading && filteredEstimatedCount > 0 && (
                <span className="text-[10px] text-gray-400">
                  (
                  {Math.round(
                    (filteredEstimatedCount / (filteredPrices.length || 1)) * 100,
                  )}
                  % estimated)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-brand-green hover:underline"
                >
                  Clear
                </button>
              )}
              {updatedAt && (
                <p className="text-[10px] text-gray-400">{updatedAt}</p>
              )}
            </div>
          </div>

          {/* Estimated data notice */}
          {!loading &&
            filteredEstimatedCount > 0 &&
            filteredEstimatedCount === filteredPrices.length && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Estimated prices based on regional averages. Help make them
                accurate — report a price you see at a station near you.
              </div>
            )}

          {/* Price Summary */}
          {!loading && filteredPrices.length > 0 && (
            <PriceSummary prices={filteredPrices} />
          )}

          {/* Price Cards */}
          {loading ? <PriceTableSkeleton /> : <PriceCards prices={filteredPrices} />}

          {/* Price History */}
          {history.length > 0 && <PriceHistoryChart history={history} />}

          {/* Community submit */}
          <SubmitPriceForm />

          {/* Subscribe */}
          <SubscribeForm />

          {/* Resources */}
          <Resources />

          {/* Footer */}
          <footer className="flex flex-col items-center gap-1 pb-6 pt-2">
            <p className="text-[10px] text-gray-400">
              Prices based on DOE advisories &amp; community reports. May vary
              per station.
            </p>
            <p className="text-[10px] text-gray-300">
              OhmyGas · Made in the Philippines
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
