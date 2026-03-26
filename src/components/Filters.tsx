"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import { FUEL_TYPES, FUEL_TYPE_LABELS, BRANDS, FuelType } from "@/lib/types";

interface FiltersProps {
  selectedRegion: string;
  selectedProvince: string;
  selectedCity: string;
  selectedBrand: string;
  selectedFuelType: FuelType;
  onRegionChange: (region: string) => void;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onBrandChange: (brand: string) => void;
  onFuelTypeChange: (fuelType: FuelType) => void;
  availableCities: string[];
  availableBrands: string[];
  showAllFuelOption?: boolean;
}

export default function Filters({
  selectedRegion,
  selectedProvince,
  selectedCity,
  selectedBrand,
  selectedFuelType,
  onRegionChange,
  onProvinceChange,
  onCityChange,
  onBrandChange,
  onFuelTypeChange,
  availableCities,
  availableBrands,
  showAllFuelOption,
}: FiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const region = REGIONS.find((r) => r.code === selectedRegion);
  const provinces = region?.provinces ?? [];
  const brandsToShow = BRANDS.filter((b) => availableBrands.includes(b));

  const hasActiveFilters =
    selectedRegion !== "all" || selectedBrand !== "all";

  return (
    <div className="flex flex-col gap-3">
      {/* Fuel type tabs — always visible */}
      <div
        className="scrollbar-hide flex gap-2 overflow-x-auto"
        role="radiogroup"
        aria-label="Fuel type"
      >
        {showAllFuelOption && (
          <button
            onClick={() => onFuelTypeChange("all" as FuelType)}
            role="radio"
            aria-checked={selectedFuelType === ("all" as FuelType)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              selectedFuelType === ("all" as FuelType)
                ? "bg-brand-green text-white shadow-sm"
                : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            }`}
          >
            All
          </button>
        )}
        {FUEL_TYPES.map((ft) => (
          <button
            key={ft}
            onClick={() => onFuelTypeChange(ft)}
            role="radio"
            aria-checked={selectedFuelType === ft}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              selectedFuelType === ft
                ? "bg-brand-green text-white shadow-sm"
                : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            }`}
          >
            {FUEL_TYPE_LABELS[ft]}
          </button>
        ))}
      </div>

      {/* Collapsible location/brand filters */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm"
      >
        <span className="text-gray-500">
          {hasActiveFilters ? (
            <span className="font-medium text-brand-charcoal">
              {selectedRegion !== "all"
                ? region?.name || selectedRegion
                : "All Regions"}
              {selectedBrand !== "all" && ` · ${selectedBrand}`}
            </span>
          ) : (
            "Filter by region / brand"
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
          {/* Region */}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                onRegionChange(e.target.value);
                onProvinceChange("all");
                onCityChange("all");
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
            >
              <option value="all">All Regions</option>
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          {selectedRegion !== "all" && provinces.length > 0 && (
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Province
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  onProvinceChange(e.target.value);
                  onCityChange("all");
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
              >
                <option value="all">All Provinces</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City */}
          {selectedProvince !== "all" && availableCities.length > 0 && (
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                City / Municipality
              </label>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
              >
                <option value="all">All Cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Brand */}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
            >
              <option value="all">All Brands</option>
              {brandsToShow.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
