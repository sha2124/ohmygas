"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ForecastBanner from "@/components/ForecastBanner";
import Filters from "@/components/Filters";
import PriceTable from "@/components/PriceTable";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import SubscribeForm from "@/components/SubscribeForm";
import SubmitPriceForm from "@/components/SubmitPriceForm";
import Resources from "@/components/Resources";
import { PriceTableSkeleton, ForecastSkeleton, MarketSkeleton } from "@/components/Skeleton";
import { usePrices } from "@/lib/use-prices";
import { FuelType } from "@/lib/types";

export default function Home() {
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [brand, setBrand] = useState("all");
  const [fuelType, setFuelType] = useState<FuelType>("Diesel");

  const { prices, meta, forecast, market, history, loading, isLive, staleWarning, sources, communityCount, estimatedCount } =
    usePrices();

  const hasFilters = region !== "all" || province !== "all" || city !== "all" || brand !== "all";

  function clearFilters() {
    setRegion("all");
    setProvince("all");
    setCity("all");
    setBrand("all");
  }

  const filteredPrices = useMemo(() => {
    return prices.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (province !== "all" && p.province !== province) return false;
      if (city !== "all" && p.city !== city) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (p.fuelType !== fuelType) return false;
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
    if (province !== "all") filtered = filtered.filter((p) => p.province === province);
    if (city !== "all") filtered = filtered.filter((p) => p.city === city);
    return [...new Set(filtered.map((p) => p.brand))];
  }, [prices, region, province, city]);

  const updatedAt = meta?.updated
    ? meta.updated
    : prices[0]?.updatedAt
      ? new Date(prices[0].updatedAt).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4" role="main">
        <div className="flex flex-col gap-4">
          {/* Status indicator */}
          {!loading && (
            <div className="flex flex-col items-center gap-1" role="status" aria-live="polite">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${isLive ? "bg-brand-green" : "bg-brand-yellow"}`}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-500">
                  {isLive
                    ? `Live prices — ${meta?.week ?? ""}`
                    : "Estimated prices — live data source updating"}
                </span>
              </div>
              {staleWarning && (
                <span className="text-xs text-yellow-600">{staleWarning}</span>
              )}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
                {sources.length > 0 && (
                  <span>Sources: {sources.join(", ")}</span>
                )}
                {communityCount > 0 && (
                  <span className="rounded-full bg-brand-yellow-light px-2 py-0.5 text-yellow-700">
                    {communityCount} community report{communityCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Forecast Banner */}
          {loading ? <ForecastSkeleton /> : <ForecastBanner forecast={forecast} />}

          {/* Market indicators */}
          {loading ? (
            <MarketSkeleton />
          ) : market && (market.crude || market.forex) ? (
            <div className="flex justify-center gap-4 rounded-lg bg-white px-4 py-2 text-xs shadow-sm">
              {market.crude && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Crude Oil:</span>
                  <span className="font-medium text-brand-charcoal">
                    ${market.crude.price.toFixed(2)}
                  </span>
                  {market.crude.change !== null && (
                    <span
                      className={`font-medium ${market.crude.change > 0 ? "text-brand-red" : market.crude.change < 0 ? "text-brand-green" : "text-gray-400"}`}
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
                  <span className="font-medium text-brand-charcoal">
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
            selectedFuelType={fuelType}
            onRegionChange={setRegion}
            onProvinceChange={setProvince}
            onCityChange={setCity}
            onBrandChange={setBrand}
            onFuelTypeChange={setFuelType}
            availableCities={availableCities}
            availableBrands={availableBrands}
          />

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="self-start text-xs font-medium text-brand-green hover:underline"
            >
              Clear all filters
            </button>
          )}

          {/* Results header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading..."
                  : `${filteredPrices.length} result${filteredPrices.length !== 1 ? "s" : ""}`}
              </p>
              {!loading && filteredEstimatedCount > 0 && (
                <span className="text-[11px] text-gray-400">
                  ({filteredEstimatedCount} estimated)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Updated {updatedAt}</p>
          </div>

          {/* Estimated data notice */}
          {!loading && filteredEstimatedCount > 0 && filteredEstimatedCount === filteredPrices.length && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-700">
              These are estimated prices based on regional averages. Help make them accurate —{" "}
              <span className="font-medium">report a price</span> you see at a station near you.
            </div>
          )}

          {/* Price Table */}
          {loading ? <PriceTableSkeleton /> : <PriceTable prices={filteredPrices} />}

          {/* Price History Chart */}
          {history.length > 0 && <PriceHistoryChart history={history} />}

          {/* Submit a community price */}
          <SubmitPriceForm />

          {/* Subscribe for alerts */}
          <SubscribeForm />

          {/* Resources */}
          <Resources />

          {/* Footer */}
          <p className="pb-4 text-center text-xs text-gray-400">
            Prices are based on DOE advisories and community reports. May vary per station.
          </p>
        </div>
      </main>
    </div>
  );
}
