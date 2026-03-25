"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ForecastBanner from "@/components/ForecastBanner";
import Filters from "@/components/Filters";
import PriceTable from "@/components/PriceTable";
import { SAMPLE_PRICES, SAMPLE_FORECAST } from "@/lib/sample-data";
import { FuelType } from "@/lib/types";

export default function Home() {
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [fuelType, setFuelType] = useState<FuelType>("Diesel");

  const filteredPrices = useMemo(() => {
    return SAMPLE_PRICES.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (province !== "all" && p.province !== province) return false;
      if (city !== "all" && p.city !== city) return false;
      if (p.fuelType !== fuelType) return false;
      return true;
    });
  }, [region, province, city, fuelType]);

  // Get available cities from data for the selected province
  const availableCities = useMemo(() => {
    if (province === "all") return [];
    const prices = SAMPLE_PRICES.filter((p) => p.province === province);
    return [...new Set(prices.map((p) => p.city).filter(Boolean))] as string[];
  }, [province]);

  const updatedAt = SAMPLE_PRICES[0]?.updatedAt
    ? new Date(SAMPLE_PRICES[0].updatedAt).toLocaleDateString("en-PH", {
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
          {/* Forecast Banner */}
          <ForecastBanner forecast={SAMPLE_FORECAST} />

          {/* Filters */}
          <Filters
            selectedRegion={region}
            selectedProvince={province}
            selectedCity={city}
            selectedFuelType={fuelType}
            onRegionChange={setRegion}
            onProvinceChange={setProvince}
            onCityChange={setCity}
            onFuelTypeChange={setFuelType}
            availableCities={availableCities}
          />

          {/* Results header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredPrices.length} result{filteredPrices.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">Updated {updatedAt}</p>
          </div>

          {/* Price Table */}
          <PriceTable prices={filteredPrices} />

          {/* Footer note */}
          <p className="pb-4 text-center text-xs text-gray-400">
            Prices are based on DOE advisories and may vary per station.
          </p>
        </div>
      </main>
    </div>
  );
}
