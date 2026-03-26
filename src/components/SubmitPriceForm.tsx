"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import { FUEL_TYPES, FUEL_TYPE_LABELS, BRANDS } from "@/lib/types";

export default function SubmitPriceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [brand, setBrand] = useState("");
  const [station, setStation] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [price, setPrice] = useState("");
  const [reportedBy, setReportedBy] = useState("");

  const selectedRegion = REGIONS.find((r) => r.code === region);
  const provinces = selectedRegion?.provinces ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/submit-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          station: station || undefined,
          region,
          province,
          city: city || undefined,
          fuelType,
          price: parseFloat(price),
          reportedBy: reportedBy || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        // Reset form
        setBrand("");
        setStation("");
        setPrice("");
        onSuccess?.();
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-brand-green/30 bg-white px-4 py-4 text-sm font-medium text-brand-green transition-colors hover:border-brand-green/50 hover:bg-brand-green-light"
      >
        + Report a Price
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-brand-green-light p-4 text-center">
        <p className="font-medium text-brand-green">{message}</p>
        <button
          onClick={() => {
            setStatus("idle");
            setOpen(false);
          }}
          className="mt-2 text-sm text-brand-green/70 underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-charcoal">Report a Price</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Brand */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
        >
          <option value="">Select Brand</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
          <option value="Other">Other</option>
        </select>

        {/* Station name (optional) */}
        <input
          type="text"
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder="Station name / address (optional)"
          maxLength={100}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal placeholder-gray-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
        />

        {/* Region */}
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setProvince("");
            setCity("");
          }}
          required
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
        >
          <option value="">Select Region</option>
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>{r.name}</option>
          ))}
        </select>

        {/* Province */}
        {provinces.length > 0 && (
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>
        )}

        {/* City (optional) */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City / Municipality (optional)"
          maxLength={100}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal placeholder-gray-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
        />

        {/* Fuel type + Price row */}
        <div className="flex gap-2">
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
          >
            <option value="">Fuel Type</option>
            {FUEL_TYPES.map((ft) => (
              <option key={ft} value={ft}>{FUEL_TYPE_LABELS[ft]}</option>
            ))}
          </select>

          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              ₱
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="30"
              max="200"
              required
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-7 pr-3 text-sm text-brand-charcoal placeholder-gray-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
            />
          </div>
        </div>

        {/* Nickname (optional) */}
        <input
          type="text"
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
          placeholder="Your nickname (optional)"
          maxLength={30}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-charcoal placeholder-gray-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none"
        />

        {status === "error" && (
          <p className="text-xs text-brand-red">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit Price"}
        </button>

        <p className="text-center text-[10px] text-gray-400">
          Community prices are shown for 7 days and marked as user-reported.
        </p>
      </form>
    </div>
  );
}
