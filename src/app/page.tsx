"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ForecastBanner from "@/components/ForecastBanner";
import Filters from "@/components/Filters";
import PriceTable from "@/components/PriceTable";
import { usePrices } from "@/lib/use-prices";
import { FuelType } from "@/lib/types";

export default function Home() {
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [brand, setBrand] = useState("all");
  const [fuelType, setFuelType] = useState<FuelType>("Diesel");

  const { prices, meta, forecast, loading, isLive, staleWarning } = usePrices();

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

  const availableCities = useMemo(() => {
    if (province === "all") return [];
    const filtered = prices.filter((p) => p.province === province);
    return [...new Set(filtered.map((p) => p.city).filter(Boolean))] as string[];
  }, [prices, province]);

  // Get brands available in the current location filter
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

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Live data indicator */}
          {!loading && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${isLive ? "bg-brand-green" : "bg-brand-yellow"}`}
                />
                <span className="text-xs text-gray-400">
                  {isLive
                    ? `Live prices — ${meta?.week ?? ""}`
                    : "Estimated prices — live data source updating"}
                </span>
              </div>
              {staleWarning && (
                <span className="text-xs text-brand-yellow">
                  {staleWarning}
                </span>
              )}
            </div>
          )}

          {/* Forecast Banner */}
          <ForecastBanner forecast={forecast} />

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

          {/* Results header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading..."
                : `${filteredPrices.length} result${filteredPrices.length !== 1 ? "s" : ""}`}
            </p>
            <p className="text-xs text-gray-400">Updated {updatedAt}</p>
          </div>

          {/* Price Table */}
          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-400">
              Fetching latest prices...
            </div>
          ) : (
            <PriceTable prices={filteredPrices} />
          )}

          {/* Market info */}
          {meta && (
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>Dubai Crude: {meta.dubaiCrude}</span>
              <span>USD/PHP: {meta.usdPhp}</span>
            </div>
          )}

          {/* Footer note */}
          <p className="pb-4 text-center text-xs text-gray-400">
            Prices are based on DOE advisories and may vary per station.
            {meta?.nextAdj && ` Next adjustment: ${meta.nextAdj}.`}
          </p>
        </div>
      </main>
    </div>
  );
}
