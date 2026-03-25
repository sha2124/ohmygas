"use client";

import { REGIONS } from "@/lib/regions";
import { FUEL_TYPES, FuelType } from "@/lib/types";

interface FiltersProps {
  selectedRegion: string;
  selectedProvince: string;
  selectedCity: string;
  selectedFuelType: FuelType;
  onRegionChange: (region: string) => void;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onFuelTypeChange: (fuelType: FuelType) => void;
  availableCities: string[];
}

export default function Filters({
  selectedRegion,
  selectedProvince,
  selectedCity,
  selectedFuelType,
  onRegionChange,
  onProvinceChange,
  onCityChange,
  onFuelTypeChange,
  availableCities,
}: FiltersProps) {
  const region = REGIONS.find((r) => r.code === selectedRegion);
  const provinces = region?.provinces ?? [];

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

      {/* Province selector (shows all provinces for selected region) */}
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

      {/* City selector (shows when province is selected and cities exist) */}
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
              {ft}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
