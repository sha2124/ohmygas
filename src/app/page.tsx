"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ForecastBanner from "@/components/ForecastBanner";
import Filters from "@/components/Filters";
import PriceTable from "@/components/PriceTable";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import SubscribeForm from "@/components/SubscribeForm";
import SubmitPriceForm from "@/components/SubmitPriceForm";
import { usePrices } from "@/lib/use-prices";
import { FuelType } from "@/lib/types";

export default function Home() {
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [brand, setBrand] = useState("all");
  const [fuelType, setFuelType] = useState<FuelType>("Diesel");

  const { prices, meta, forecast, market, history, loading, isLive, staleWarning, sources, communityCount } =
    usePrices();

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
                <span className="text-xs text-brand-yellow">{staleWarning}</span>
              )}
              {/* Source + community count */}
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                {sources.length > 0 && (
                  <span>Sources: {sources.join(", ")}</span>
                )}
                {communityCount > 0 && (
                  <span className="rounded-full bg-brand-yellow-light px-2 py-0.5 text-brand-yellow">
                    {communityCount} community report{communityCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Forecast Banner */}
          <ForecastBanner forecast={forecast} />

          {/* Market indicators */}
          {market && (market.crude || market.forex) && (
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
          )}

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

          {/* Price History Chart */}
          {history.length > 0 && <PriceHistoryChart history={history} />}

          {/* Submit a community price */}
          <SubmitPriceForm />

          {/* Subscribe for alerts */}
          <SubscribeForm />

          {/* Footer note */}
          <p className="pb-4 text-center text-xs text-gray-400">
            Prices are based on DOE advisories and community reports. May vary per station.
          </p>
        </div>
      </main>
    </div>
  );
}
