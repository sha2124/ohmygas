export type PriceSource = "official" | "scraped" | "community";

export interface FuelPrice {
  brand: string;
  station?: string;
  region: string;
  province: string;
  city?: string;
  fuelType: FuelType;
  price: number;
  previousPrice: number | null;
  updatedAt: string; // ISO date
  source?: PriceSource;
  reportedBy?: string; // for community submissions
  votes?: number; // upvotes confirming community price
}

export type FuelType = "RON 91" | "RON 95" | "RON 97" | "Diesel" | "Diesel Plus";

export interface Region {
  code: string;
  name: string;
  provinces: Province[];
}

export interface Province {
  code: string;
  name: string;
  regionCode: string;
}

export interface ForecastData {
  direction: "up" | "down" | "steady";
  estimatedChange: number; // peso per liter
  confidence: "low" | "medium" | "high";
  effectiveDate: string;
  factors: {
    crudeDelta: number;
    forexDelta: number;
  };
}

export const BRANDS = [
  "Shell",
  "Petron",
  "Caltex",
  "Seaoil",
  "Phoenix",
  "Unioil",
  "Cleanfuel",
  "PTT",
  "Jetti",
  "Flying V",
] as const;

export type Brand = (typeof BRANDS)[number];

export const FUEL_TYPES: FuelType[] = [
  "RON 91",
  "RON 95",
  "RON 97",
  "Diesel",
  "Diesel Plus",
];

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  "RON 91": "Regular",
  "RON 95": "Premium",
  "RON 97": "Super Premium",
  "Diesel": "Diesel",
  "Diesel Plus": "Diesel Plus",
};
