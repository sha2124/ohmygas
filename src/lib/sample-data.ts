import { FuelPrice, ForecastData } from "./types";

const today = new Date().toISOString().split("T")[0];

// Helper to generate prices for a location with slight variation per brand
function loc(
  region: string,
  province: string,
  city: string,
  baseG: number,
  baseD: number,
): FuelPrice[] {
  return [
    { brand: "Shell", region, province, city, fuelType: "RON 91", price: baseG + 2.46, previousPrice: baseG + 1.46, updatedAt: today },
    { brand: "Shell", region, province, city, fuelType: "RON 95", price: baseG + 13.46, previousPrice: baseG + 12.46, updatedAt: today },
    { brand: "Shell", region, province, city, fuelType: "Diesel", price: baseD + 2.81, previousPrice: baseD + 1.81, updatedAt: today },
    { brand: "Petron", region, province, city, fuelType: "RON 91", price: baseG + 2.36, previousPrice: baseG + 1.36, updatedAt: today },
    { brand: "Petron", region, province, city, fuelType: "RON 95", price: baseG + 12.76, previousPrice: baseG + 11.76, updatedAt: today },
    { brand: "Petron", region, province, city, fuelType: "Diesel", price: baseD + 2.51, previousPrice: baseD + 1.51, updatedAt: today },
    { brand: "Caltex", region, province, city, fuelType: "RON 91", price: baseG + 2.51, previousPrice: baseG + 1.51, updatedAt: today },
    { brand: "Caltex", region, province, city, fuelType: "Diesel", price: baseD + 2.76, previousPrice: baseD + 1.76, updatedAt: today },
    { brand: "Seaoil", region, province, city, fuelType: "RON 91", price: baseG, previousPrice: baseG - 1, updatedAt: today },
    { brand: "Seaoil", region, province, city, fuelType: "Diesel", price: baseD + 0.50, previousPrice: baseD - 0.50, updatedAt: today },
    { brand: "Phoenix", region, province, city, fuelType: "RON 91", price: baseG + 0.85, previousPrice: baseG - 0.15, updatedAt: today },
    { brand: "Phoenix", region, province, city, fuelType: "Diesel", price: baseD + 0.90, previousPrice: baseD - 0.10, updatedAt: today },
    { brand: "Unioil", region, province, city, fuelType: "RON 91", price: baseG - 0.11, previousPrice: baseG - 1.11, updatedAt: today },
    { brand: "Unioil", region, province, city, fuelType: "Diesel", price: baseD + 0.29, previousPrice: baseD - 0.71, updatedAt: today },
    { brand: "Cleanfuel", region, province, city, fuelType: "RON 91", price: baseG - 0.50, previousPrice: baseG - 1.50, updatedAt: today },
    { brand: "Cleanfuel", region, province, city, fuelType: "Diesel", price: baseD - 0.10, previousPrice: baseD - 1.10, updatedAt: today },
  ];
}

export const SAMPLE_PRICES: FuelPrice[] = [
  // =============================================
  // NCR
  // =============================================
  ...loc("NCR", "Metro Manila", "Quezon City", 60, 53),
  ...loc("NCR", "Metro Manila", "Makati", 60.5, 53.5),
  ...loc("NCR", "Metro Manila", "Manila", 60.2, 53.2),
  ...loc("NCR", "Metro Manila", "Pasig", 60.3, 53.3),
  ...loc("NCR", "Metro Manila", "Taguig", 60.8, 53.8),
  ...loc("NCR", "Metro Manila", "Parañaque", 60.1, 53.1),
  ...loc("NCR", "Metro Manila", "Caloocan", 59.8, 52.8),
  ...loc("NCR", "Metro Manila", "Valenzuela", 59.9, 52.9),
  ...loc("NCR", "Metro Manila", "Las Piñas", 60.0, 53.0),
  ...loc("NCR", "Metro Manila", "Marikina", 60.2, 53.2),
  ...loc("NCR", "Metro Manila", "Muntinlupa", 60.4, 53.4),
  ...loc("NCR", "Metro Manila", "San Juan", 60.6, 53.6),
  ...loc("NCR", "Metro Manila", "Mandaluyong", 60.5, 53.5),
  ...loc("NCR", "Metro Manila", "Navotas", 59.7, 52.7),
  ...loc("NCR", "Metro Manila", "Malabon", 59.8, 52.8),
  ...loc("NCR", "Metro Manila", "Pasay", 60.3, 53.3),
  ...loc("NCR", "Metro Manila", "Pateros", 60.4, 53.4),

  // =============================================
  // Region I — Ilocos
  // =============================================
  ...loc("I", "Ilocos Norte", "Laoag", 62, 55),
  ...loc("I", "Ilocos Norte", "Batac", 62.3, 55.3),
  ...loc("I", "Ilocos Sur", "Vigan", 62.5, 55.5),
  ...loc("I", "Ilocos Sur", "Candon", 62.7, 55.7),
  ...loc("I", "La Union", "San Fernando", 61.5, 54.5),
  ...loc("I", "La Union", "Bauang", 61.7, 54.7),
  ...loc("I", "Pangasinan", "Dagupan", 61, 54),
  ...loc("I", "Pangasinan", "Urdaneta", 61.2, 54.2),
  ...loc("I", "Pangasinan", "Lingayen", 61.3, 54.3),
  ...loc("I", "Pangasinan", "San Carlos", 61.5, 54.5),
  ...loc("I", "Pangasinan", "Alaminos", 61.8, 54.8),

  // =============================================
  // Region II — Cagayan Valley
  // =============================================
  ...loc("II", "Batanes", "Basco", 68, 61),
  ...loc("II", "Cagayan", "Tuguegarao", 63, 56),
  ...loc("II", "Cagayan", "Aparri", 63.5, 56.5),
  ...loc("II", "Isabela", "Ilagan", 63.2, 56.2),
  ...loc("II", "Isabela", "Santiago", 62.8, 55.8),
  ...loc("II", "Isabela", "Cauayan", 63, 56),
  ...loc("II", "Nueva Vizcaya", "Bayombong", 63.5, 56.5),
  ...loc("II", "Nueva Vizcaya", "Solano", 63.7, 56.7),
  ...loc("II", "Quirino", "Cabarroguis", 64, 57),

  // =============================================
  // Region III — Central Luzon
  // =============================================
  ...loc("III", "Aurora", "Baler", 63, 56),
  ...loc("III", "Bataan", "Balanga", 61.5, 54.5),
  ...loc("III", "Bataan", "Mariveles", 61.8, 54.8),
  ...loc("III", "Bulacan", "Malolos", 60.5, 53.5),
  ...loc("III", "Bulacan", "Meycauayan", 60.3, 53.3),
  ...loc("III", "Bulacan", "San Jose del Monte", 60.4, 53.4),
  ...loc("III", "Bulacan", "Santa Maria", 60.5, 53.5),
  ...loc("III", "Nueva Ecija", "Cabanatuan", 61.8, 54.8),
  ...loc("III", "Nueva Ecija", "Palayan", 62, 55),
  ...loc("III", "Nueva Ecija", "San Jose", 62.2, 55.2),
  ...loc("III", "Nueva Ecija", "Gapan", 61.5, 54.5),
  ...loc("III", "Pampanga", "San Fernando", 61, 54),
  ...loc("III", "Pampanga", "Angeles", 60.8, 53.8),
  ...loc("III", "Pampanga", "Mabalacat", 61.2, 54.2),
  ...loc("III", "Tarlac", "Tarlac City", 61.5, 54.5),
  ...loc("III", "Tarlac", "Concepcion", 62, 55),
  ...loc("III", "Zambales", "Olongapo", 61.3, 54.3),
  ...loc("III", "Zambales", "Iba", 62, 55),

  // =============================================
  // Region IV-A — CALABARZON
  // =============================================
  ...loc("IV-A", "Batangas", "Batangas City", 61.5, 54.5),
  ...loc("IV-A", "Batangas", "Lipa", 61.3, 54.3),
  ...loc("IV-A", "Batangas", "Tanauan", 61, 54),
  ...loc("IV-A", "Batangas", "Nasugbu", 62, 55),
  ...loc("IV-A", "Cavite", "Bacoor", 60.5, 53.5),
  ...loc("IV-A", "Cavite", "Imus", 60.6, 53.6),
  ...loc("IV-A", "Cavite", "Dasmariñas", 60.8, 53.8),
  ...loc("IV-A", "Cavite", "General Trias", 60.9, 53.9),
  ...loc("IV-A", "Cavite", "Cavite City", 61, 54),
  ...loc("IV-A", "Laguna", "Santa Rosa", 60.8, 53.8),
  ...loc("IV-A", "Laguna", "Calamba", 61, 54),
  ...loc("IV-A", "Laguna", "San Pablo", 61.5, 54.5),
  ...loc("IV-A", "Laguna", "Biñan", 60.7, 53.7),
  ...loc("IV-A", "Quezon", "Lucena", 62, 55),
  ...loc("IV-A", "Quezon", "Tayabas", 62.3, 55.3),
  ...loc("IV-A", "Rizal", "Antipolo", 60.5, 53.5),
  ...loc("IV-A", "Rizal", "Cainta", 60.3, 53.3),
  ...loc("IV-A", "Rizal", "Taytay", 60.4, 53.4),

  // =============================================
  // MIMAROPA
  // =============================================
  ...loc("IV-B", "Marinduque", "Boac", 65.5, 58.5),
  ...loc("IV-B", "Occidental Mindoro", "Mamburao", 64.5, 57.5),
  ...loc("IV-B", "Occidental Mindoro", "San Jose", 64.8, 57.8),
  ...loc("IV-B", "Oriental Mindoro", "Calapan", 64, 57),
  ...loc("IV-B", "Oriental Mindoro", "Puerto Galera", 64.5, 57.5),
  ...loc("IV-B", "Palawan", "Puerto Princesa", 65, 58),
  ...loc("IV-B", "Palawan", "Coron", 67, 60),
  ...loc("IV-B", "Palawan", "El Nido", 67.5, 60.5),
  ...loc("IV-B", "Romblon", "Romblon", 66, 59),

  // =============================================
  // Region V — Bicol
  // =============================================
  ...loc("V", "Albay", "Legazpi", 63.5, 56.5),
  ...loc("V", "Albay", "Tabaco", 63.8, 56.8),
  ...loc("V", "Camarines Norte", "Daet", 63.5, 56.5),
  ...loc("V", "Camarines Sur", "Naga", 63, 56),
  ...loc("V", "Camarines Sur", "Iriga", 63.5, 56.5),
  ...loc("V", "Catanduanes", "Virac", 66, 59),
  ...loc("V", "Masbate", "Masbate City", 65, 58),
  ...loc("V", "Sorsogon", "Sorsogon City", 64, 57),

  // =============================================
  // Region VI — Western Visayas
  // =============================================
  ...loc("VI", "Aklan", "Kalibo", 64, 57),
  ...loc("VI", "Antique", "San Jose de Buenavista", 64.5, 57.5),
  ...loc("VI", "Capiz", "Roxas", 63.5, 56.5),
  ...loc("VI", "Guimaras", "Jordan", 64, 57),
  ...loc("VI", "Iloilo", "Iloilo City", 63, 56),
  ...loc("VI", "Iloilo", "Passi", 63.5, 56.5),
  ...loc("VI", "Negros Occidental", "Bacolod", 62.5, 55.5),
  ...loc("VI", "Negros Occidental", "Silay", 63, 56),
  ...loc("VI", "Negros Occidental", "Talisay", 62.8, 55.8),
  ...loc("VI", "Negros Occidental", "Kabankalan", 63.5, 56.5),

  // =============================================
  // Region VII — Central Visayas
  // =============================================
  ...loc("VII", "Bohol", "Tagbilaran", 64, 57),
  ...loc("VII", "Bohol", "Ubay", 64.5, 57.5),
  ...loc("VII", "Cebu", "Cebu City", 63, 56),
  ...loc("VII", "Cebu", "Mandaue", 62.8, 55.8),
  ...loc("VII", "Cebu", "Lapu-Lapu", 63.2, 56.2),
  ...loc("VII", "Cebu", "Talisay", 63, 56),
  ...loc("VII", "Cebu", "Toledo", 63.5, 56.5),
  ...loc("VII", "Negros Oriental", "Dumaguete", 63.5, 56.5),
  ...loc("VII", "Negros Oriental", "Bayawan", 64, 57),
  ...loc("VII", "Siquijor", "Siquijor", 66, 59),

  // =============================================
  // Region VIII — Eastern Visayas
  // =============================================
  ...loc("VIII", "Biliran", "Naval", 65, 58),
  ...loc("VIII", "Eastern Samar", "Borongan", 65.5, 58.5),
  ...loc("VIII", "Leyte", "Tacloban", 64, 57),
  ...loc("VIII", "Leyte", "Ormoc", 64.5, 57.5),
  ...loc("VIII", "Northern Samar", "Catarman", 65.5, 58.5),
  ...loc("VIII", "Samar", "Catbalogan", 65, 58),
  ...loc("VIII", "Southern Leyte", "Maasin", 65, 58),

  // =============================================
  // Region IX — Zamboanga
  // =============================================
  ...loc("IX", "Zamboanga del Norte", "Dipolog", 64.5, 57.5),
  ...loc("IX", "Zamboanga del Norte", "Dapitan", 64.8, 57.8),
  ...loc("IX", "Zamboanga del Sur", "Zamboanga City", 64, 57),
  ...loc("IX", "Zamboanga del Sur", "Pagadian", 64.5, 57.5),
  ...loc("IX", "Zamboanga Sibugay", "Ipil", 65, 58),

  // =============================================
  // Region X — Northern Mindanao
  // =============================================
  ...loc("X", "Bukidnon", "Malaybalay", 64, 57),
  ...loc("X", "Bukidnon", "Valencia", 63.8, 56.8),
  ...loc("X", "Camiguin", "Mambajao", 66, 59),
  ...loc("X", "Lanao del Norte", "Iligan", 63.5, 56.5),
  ...loc("X", "Misamis Occidental", "Oroquieta", 64, 57),
  ...loc("X", "Misamis Occidental", "Ozamiz", 63.8, 56.8),
  ...loc("X", "Misamis Oriental", "Cagayan de Oro", 63, 56),
  ...loc("X", "Misamis Oriental", "Gingoog", 63.5, 56.5),

  // =============================================
  // Region XI — Davao
  // =============================================
  ...loc("XI", "Davao de Oro", "Nabunturan", 65.5, 58.5),
  ...loc("XI", "Davao del Norte", "Tagum", 64, 57),
  ...loc("XI", "Davao del Norte", "Panabo", 64.2, 57.2),
  ...loc("XI", "Davao del Sur", "Davao City", 63.5, 56.5),
  ...loc("XI", "Davao del Sur", "Digos", 64, 57),
  ...loc("XI", "Davao Occidental", "Malita", 65.5, 58.5),
  ...loc("XI", "Davao Oriental", "Mati", 65, 58),

  // =============================================
  // Region XII — SOCCSKSARGEN
  // =============================================
  ...loc("XII", "Cotabato", "Kidapawan", 64.5, 57.5),
  ...loc("XII", "Sarangani", "Alabel", 64.5, 57.5),
  ...loc("XII", "South Cotabato", "General Santos", 63.5, 56.5),
  ...loc("XII", "South Cotabato", "Koronadal", 64, 57),
  ...loc("XII", "Sultan Kudarat", "Tacurong", 65, 58),
  ...loc("XII", "Sultan Kudarat", "Isulan", 65.2, 58.2),

  // =============================================
  // Region XIII — Caraga
  // =============================================
  ...loc("XIII", "Agusan del Norte", "Butuan", 64, 57),
  ...loc("XIII", "Agusan del Norte", "Cabadbaran", 64.5, 57.5),
  ...loc("XIII", "Agusan del Sur", "Prosperidad", 65, 58),
  ...loc("XIII", "Agusan del Sur", "San Francisco", 65.2, 58.2),
  ...loc("XIII", "Dinagat Islands", "San Jose", 67, 60),
  ...loc("XIII", "Surigao del Norte", "Surigao City", 65, 58),
  ...loc("XIII", "Surigao del Sur", "Tandag", 65.5, 58.5),
  ...loc("XIII", "Surigao del Sur", "Bislig", 65.8, 58.8),

  // =============================================
  // CAR — Cordillera
  // =============================================
  ...loc("CAR", "Abra", "Bangued", 64.5, 57.5),
  ...loc("CAR", "Apayao", "Kabugao", 66, 59),
  ...loc("CAR", "Benguet", "Baguio", 63, 56),
  ...loc("CAR", "Benguet", "La Trinidad", 63.2, 56.2),
  ...loc("CAR", "Ifugao", "Lagawe", 65.5, 58.5),
  ...loc("CAR", "Kalinga", "Tabuk", 65, 58),
  ...loc("CAR", "Mountain Province", "Bontoc", 66, 59),

  // =============================================
  // BARMM
  // =============================================
  ...loc("BARMM", "Basilan", "Isabela", 66, 59),
  ...loc("BARMM", "Lanao del Sur", "Marawi", 65, 58),
  ...loc("BARMM", "Maguindanao del Norte", "Cotabato City", 64, 57),
  ...loc("BARMM", "Maguindanao del Sur", "Buluan", 65, 58),
  ...loc("BARMM", "Sulu", "Jolo", 67, 60),
  ...loc("BARMM", "Tawi-Tawi", "Bongao", 68, 61),
];

export const SAMPLE_FORECAST: ForecastData = {
  direction: "up",
  estimatedChange: 1.50,
  confidence: "high",
  effectiveDate: "2026-03-31",
  factors: {
    crudeDelta: 2.3,
    forexDelta: 0.15,
  },
};
