import { Region } from "./types";

// Based on Philippine Standard Geographic Code (PSGC)
// Source: https://psgc.gitlab.io/api/
export const REGIONS: Region[] = [
  {
    code: "NCR",
    name: "NCR",
    provinces: [
      { code: "NCR-1", name: "Metro Manila", regionCode: "NCR" },
    ],
  },
  {
    code: "I",
    name: "Region I — Ilocos",
    provinces: [
      { code: "I-01", name: "Ilocos Norte", regionCode: "I" },
      { code: "I-02", name: "Ilocos Sur", regionCode: "I" },
      { code: "I-03", name: "La Union", regionCode: "I" },
      { code: "I-04", name: "Pangasinan", regionCode: "I" },
    ],
  },
  {
    code: "II",
    name: "Region II — Cagayan Valley",
    provinces: [
      { code: "II-01", name: "Batanes", regionCode: "II" },
      { code: "II-02", name: "Cagayan", regionCode: "II" },
      { code: "II-03", name: "Isabela", regionCode: "II" },
      { code: "II-04", name: "Nueva Vizcaya", regionCode: "II" },
      { code: "II-05", name: "Quirino", regionCode: "II" },
    ],
  },
  {
    code: "III",
    name: "Region III — Central Luzon",
    provinces: [
      { code: "III-01", name: "Aurora", regionCode: "III" },
      { code: "III-02", name: "Bataan", regionCode: "III" },
      { code: "III-03", name: "Bulacan", regionCode: "III" },
      { code: "III-04", name: "Nueva Ecija", regionCode: "III" },
      { code: "III-05", name: "Pampanga", regionCode: "III" },
      { code: "III-06", name: "Tarlac", regionCode: "III" },
      { code: "III-07", name: "Zambales", regionCode: "III" },
    ],
  },
  {
    code: "IV-A",
    name: "Region IV-A — CALABARZON",
    provinces: [
      { code: "IV-A-01", name: "Batangas", regionCode: "IV-A" },
      { code: "IV-A-02", name: "Cavite", regionCode: "IV-A" },
      { code: "IV-A-03", name: "Laguna", regionCode: "IV-A" },
      { code: "IV-A-04", name: "Quezon", regionCode: "IV-A" },
      { code: "IV-A-05", name: "Rizal", regionCode: "IV-A" },
    ],
  },
  {
    code: "IV-B",
    name: "MIMAROPA",
    provinces: [
      { code: "IV-B-01", name: "Marinduque", regionCode: "IV-B" },
      { code: "IV-B-02", name: "Occidental Mindoro", regionCode: "IV-B" },
      { code: "IV-B-03", name: "Oriental Mindoro", regionCode: "IV-B" },
      { code: "IV-B-04", name: "Palawan", regionCode: "IV-B" },
      { code: "IV-B-05", name: "Romblon", regionCode: "IV-B" },
    ],
  },
  {
    code: "V",
    name: "Region V — Bicol",
    provinces: [
      { code: "V-01", name: "Albay", regionCode: "V" },
      { code: "V-02", name: "Camarines Norte", regionCode: "V" },
      { code: "V-03", name: "Camarines Sur", regionCode: "V" },
      { code: "V-04", name: "Catanduanes", regionCode: "V" },
      { code: "V-05", name: "Masbate", regionCode: "V" },
      { code: "V-06", name: "Sorsogon", regionCode: "V" },
    ],
  },
  {
    code: "VI",
    name: "Region VI — Western Visayas",
    provinces: [
      { code: "VI-01", name: "Aklan", regionCode: "VI" },
      { code: "VI-02", name: "Antique", regionCode: "VI" },
      { code: "VI-03", name: "Capiz", regionCode: "VI" },
      { code: "VI-04", name: "Guimaras", regionCode: "VI" },
      { code: "VI-05", name: "Iloilo", regionCode: "VI" },
      { code: "VI-06", name: "Negros Occidental", regionCode: "VI" },
    ],
  },
  {
    code: "VII",
    name: "Region VII — Central Visayas",
    provinces: [
      { code: "VII-01", name: "Bohol", regionCode: "VII" },
      { code: "VII-02", name: "Cebu", regionCode: "VII" },
      { code: "VII-03", name: "Negros Oriental", regionCode: "VII" },
      { code: "VII-04", name: "Siquijor", regionCode: "VII" },
    ],
  },
  {
    code: "VIII",
    name: "Region VIII — Eastern Visayas",
    provinces: [
      { code: "VIII-01", name: "Biliran", regionCode: "VIII" },
      { code: "VIII-02", name: "Eastern Samar", regionCode: "VIII" },
      { code: "VIII-03", name: "Leyte", regionCode: "VIII" },
      { code: "VIII-04", name: "Northern Samar", regionCode: "VIII" },
      { code: "VIII-05", name: "Samar", regionCode: "VIII" },
      { code: "VIII-06", name: "Southern Leyte", regionCode: "VIII" },
    ],
  },
  {
    code: "IX",
    name: "Region IX — Zamboanga",
    provinces: [
      { code: "IX-01", name: "Zamboanga del Norte", regionCode: "IX" },
      { code: "IX-02", name: "Zamboanga del Sur", regionCode: "IX" },
      { code: "IX-03", name: "Zamboanga Sibugay", regionCode: "IX" },
    ],
  },
  {
    code: "X",
    name: "Region X — Northern Mindanao",
    provinces: [
      { code: "X-01", name: "Bukidnon", regionCode: "X" },
      { code: "X-02", name: "Camiguin", regionCode: "X" },
      { code: "X-03", name: "Lanao del Norte", regionCode: "X" },
      { code: "X-04", name: "Misamis Occidental", regionCode: "X" },
      { code: "X-05", name: "Misamis Oriental", regionCode: "X" },
    ],
  },
  {
    code: "XI",
    name: "Region XI — Davao",
    provinces: [
      { code: "XI-01", name: "Davao de Oro", regionCode: "XI" },
      { code: "XI-02", name: "Davao del Norte", regionCode: "XI" },
      { code: "XI-03", name: "Davao del Sur", regionCode: "XI" },
      { code: "XI-04", name: "Davao Occidental", regionCode: "XI" },
      { code: "XI-05", name: "Davao Oriental", regionCode: "XI" },
    ],
  },
  {
    code: "XII",
    name: "Region XII — SOCCSKSARGEN",
    provinces: [
      { code: "XII-01", name: "Cotabato", regionCode: "XII" },
      { code: "XII-02", name: "Sarangani", regionCode: "XII" },
      { code: "XII-03", name: "South Cotabato", regionCode: "XII" },
      { code: "XII-04", name: "Sultan Kudarat", regionCode: "XII" },
    ],
  },
  {
    code: "XIII",
    name: "Region XIII — Caraga",
    provinces: [
      { code: "XIII-01", name: "Agusan del Norte", regionCode: "XIII" },
      { code: "XIII-02", name: "Agusan del Sur", regionCode: "XIII" },
      { code: "XIII-03", name: "Dinagat Islands", regionCode: "XIII" },
      { code: "XIII-04", name: "Surigao del Norte", regionCode: "XIII" },
      { code: "XIII-05", name: "Surigao del Sur", regionCode: "XIII" },
    ],
  },
  {
    code: "CAR",
    name: "CAR — Cordillera",
    provinces: [
      { code: "CAR-01", name: "Abra", regionCode: "CAR" },
      { code: "CAR-02", name: "Apayao", regionCode: "CAR" },
      { code: "CAR-03", name: "Benguet", regionCode: "CAR" },
      { code: "CAR-04", name: "Ifugao", regionCode: "CAR" },
      { code: "CAR-05", name: "Kalinga", regionCode: "CAR" },
      { code: "CAR-06", name: "Mountain Province", regionCode: "CAR" },
    ],
  },
  {
    code: "BARMM",
    name: "BARMM",
    provinces: [
      { code: "BARMM-01", name: "Basilan", regionCode: "BARMM" },
      { code: "BARMM-02", name: "Lanao del Sur", regionCode: "BARMM" },
      { code: "BARMM-03", name: "Maguindanao del Norte", regionCode: "BARMM" },
      { code: "BARMM-04", name: "Maguindanao del Sur", regionCode: "BARMM" },
      { code: "BARMM-05", name: "Sulu", regionCode: "BARMM" },
      { code: "BARMM-06", name: "Tawi-Tawi", regionCode: "BARMM" },
    ],
  },
];

export function getAllProvinces() {
  return REGIONS.flatMap((r) => r.provinces);
}

export function getProvincesByRegion(regionCode: string) {
  return REGIONS.find((r) => r.code === regionCode)?.provinces ?? [];
}
