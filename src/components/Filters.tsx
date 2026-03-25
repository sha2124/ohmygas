"use client";

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
}: FiltersProps) {
  const region = REGIONS.find((r) => r.code === selectedRegion);
  const provinces = region?.provinces ?? [];

  // Show brands in the order defined in BRANDS, filtered to what's available
  const brandsToShow = BRANDS.filter((b) => availableBrands.includes(b));

  return (
    <div className="flex flex-col gap-3">
      {/* Region selector */}
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
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

      {/* Province selector */}
      {selectedRegion !== "all" && provinces.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
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

      {/* City selector */}
      {selectedProvince !== "all" && availableCities.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
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

      {/* Brand filter */}
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
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

      {/* Fuel type tabs */}
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
          Fuel Type
        </label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((ft) => (
            <button
              key={ft}
              onClick={() => onFuelTypeChange(ft)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedFuelType === ft
                  ? "bg-brand-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {FUEL_TYPE_LABELS[ft]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
