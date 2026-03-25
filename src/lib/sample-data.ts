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
  // NCR — prices updated to reflect March 24, 2026 levels
  // after Iran crisis hikes (+₱50-55/L diesel, +₱30-35/L gasoline since Mar 3)
  // =============================================
  ...loc("NCR", "Metro Manila", "Quezon City", 90, 108),
  ...loc("NCR", "Metro Manila", "Makati", 90.5, 108.5),
  ...loc("NCR", "Metro Manila", "Manila", 90.2, 108.2),
  ...loc("NCR", "Metro Manila", "Pasig", 90.3, 108.3),
  ...loc("NCR", "Metro Manila", "Taguig", 90.8, 108.8),
  ...loc("NCR", "Metro Manila", "Parañaque", 90.1, 108.1),
  ...loc("NCR", "Metro Manila", "Caloocan", 89.8, 107.8),
  ...loc("NCR", "Metro Manila", "Valenzuela", 89.9, 107.9),
  ...loc("NCR", "Metro Manila", "Las Piñas", 90.0, 108.0),
  ...loc("NCR", "Metro Manila", "Marikina", 90.2, 108.2),
  ...loc("NCR", "Metro Manila", "Muntinlupa", 90.4, 108.4),
  ...loc("NCR", "Metro Manila", "San Juan", 90.6, 108.6),
  ...loc("NCR", "Metro Manila", "Mandaluyong", 90.5, 108.5),
  ...loc("NCR", "Metro Manila", "Navotas", 89.7, 107.7),
  ...loc("NCR", "Metro Manila", "Malabon", 89.8, 107.8),
  ...loc("NCR", "Metro Manila", "Pasay", 90.3, 108.3),
  ...loc("NCR", "Metro Manila", "Pateros", 90.4, 108.4),

  // =============================================
  // Region I — Ilocos
  // =============================================
  ...loc("I", "Ilocos Norte", "Laoag", 92, 110),
  ...loc("I", "Ilocos Norte", "Batac", 92.3, 110.3),
  ...loc("I", "Ilocos Sur", "Vigan", 92.5, 110.5),
  ...loc("I", "Ilocos Sur", "Candon", 92.7, 110.7),
  ...loc("I", "La Union", "San Fernando", 91.5, 109.5),
  ...loc("I", "La Union", "Bauang", 91.7, 109.7),
  ...loc("I", "Pangasinan", "Dagupan", 91, 109),
  ...loc("I", "Pangasinan", "Urdaneta", 91.2, 109.2),
  ...loc("I", "Pangasinan", "Lingayen", 91.3, 109.3),
  ...loc("I", "Pangasinan", "San Carlos", 91.5, 109.5),
  ...loc("I", "Pangasinan", "Alaminos", 91.8, 109.8),

  // =============================================
  // Region II — Cagayan Valley
  // =============================================
  ...loc("II", "Batanes", "Basco", 98, 116),
  ...loc("II", "Cagayan", "Tuguegarao", 93, 111),
  ...loc("II", "Cagayan", "Aparri", 93.5, 111.5),
  ...loc("II", "Isabela", "Ilagan", 93.2, 111.2),
  ...loc("II", "Isabela", "Santiago", 92.8, 110.8),
  ...loc("II", "Isabela", "Cauayan", 93, 111),
  ...loc("II", "Nueva Vizcaya", "Bayombong", 93.5, 111.5),
  ...loc("II", "Nueva Vizcaya", "Solano", 93.7, 111.7),
  ...loc("II", "Quirino", "Cabarroguis", 94, 112),

  // =============================================
  // Region III — Central Luzon
  // =============================================
  ...loc("III", "Aurora", "Baler", 93, 111),
  ...loc("III", "Bataan", "Balanga", 91.5, 109.5),
  ...loc("III", "Bataan", "Mariveles", 91.8, 109.8),
  ...loc("III", "Bulacan", "Malolos", 90.5, 108.5),
  ...loc("III", "Bulacan", "Meycauayan", 90.3, 108.3),
  ...loc("III", "Bulacan", "San Jose del Monte", 90.4, 108.4),
  ...loc("III", "Bulacan", "Santa Maria", 90.5, 108.5),
  ...loc("III", "Nueva Ecija", "Cabanatuan", 91.8, 109.8),
  ...loc("III", "Nueva Ecija", "Palayan", 92, 110),
  ...loc("III", "Nueva Ecija", "San Jose", 92.2, 110.2),
  ...loc("III", "Nueva Ecija", "Gapan", 91.5, 109.5),
  ...loc("III", "Pampanga", "San Fernando", 91, 109),
  ...loc("III", "Pampanga", "Angeles", 90.8, 108.8),
  ...loc("III", "Pampanga", "Mabalacat", 91.2, 109.2),
  ...loc("III", "Tarlac", "Tarlac City", 91.5, 109.5),
  ...loc("III", "Tarlac", "Concepcion", 92, 110),
  ...loc("III", "Zambales", "Olongapo", 91.3, 109.3),
  ...loc("III", "Zambales", "Iba", 92, 110),

  // =============================================
  // Region IV-A — CALABARZON
  // =============================================
  ...loc("IV-A", "Batangas", "Batangas City", 91.5, 109.5),
  ...loc("IV-A", "Batangas", "Lipa", 91.3, 109.3),
  ...loc("IV-A", "Batangas", "Tanauan", 91, 109),
  ...loc("IV-A", "Batangas", "Nasugbu", 92, 110),
  ...loc("IV-A", "Cavite", "Bacoor", 90.5, 108.5),
  ...loc("IV-A", "Cavite", "Imus", 90.6, 108.6),
  ...loc("IV-A", "Cavite", "Dasmariñas", 90.8, 108.8),
  ...loc("IV-A", "Cavite", "General Trias", 90.9, 108.9),
  ...loc("IV-A", "Cavite", "Cavite City", 91, 109),
  ...loc("IV-A", "Laguna", "Santa Rosa", 90.8, 108.8),
  ...loc("IV-A", "Laguna", "Calamba", 91, 109),
  ...loc("IV-A", "Laguna", "San Pablo", 91.5, 109.5),
  ...loc("IV-A", "Laguna", "Biñan", 90.7, 108.7),
  ...loc("IV-A", "Quezon", "Lucena", 92, 110),
  ...loc("IV-A", "Quezon", "Tayabas", 92.3, 110.3),
  ...loc("IV-A", "Rizal", "Antipolo", 90.5, 108.5),
  ...loc("IV-A", "Rizal", "Cainta", 90.3, 108.3),
  ...loc("IV-A", "Rizal", "Taytay", 90.4, 108.4),

  // =============================================
  // MIMAROPA — island markup higher
  // =============================================
  ...loc("IV-B", "Marinduque", "Boac", 96, 114),
  ...loc("IV-B", "Occidental Mindoro", "Mamburao", 95, 113),
  ...loc("IV-B", "Occidental Mindoro", "San Jose", 95.3, 113.3),
  ...loc("IV-B", "Oriental Mindoro", "Calapan", 94.5, 112.5),
  ...loc("IV-B", "Oriental Mindoro", "Puerto Galera", 95, 113),
  ...loc("IV-B", "Palawan", "Puerto Princesa", 95.5, 113.5),
  ...loc("IV-B", "Palawan", "Coron", 97.5, 115.5),
  ...loc("IV-B", "Palawan", "El Nido", 98, 116),
  ...loc("IV-B", "Romblon", "Romblon", 96.5, 114.5),

  // =============================================
  // Region V — Bicol
  // =============================================
  ...loc("V", "Albay", "Legazpi", 93.5, 111.5),
  ...loc("V", "Albay", "Tabaco", 93.8, 111.8),
  ...loc("V", "Camarines Norte", "Daet", 93.5, 111.5),
  ...loc("V", "Camarines Sur", "Naga", 93, 111),
  ...loc("V", "Camarines Sur", "Iriga", 93.5, 111.5),
  ...loc("V", "Catanduanes", "Virac", 96.5, 114.5),
  ...loc("V", "Masbate", "Masbate City", 95.5, 113.5),
  ...loc("V", "Sorsogon", "Sorsogon City", 94, 112),

  // =============================================
  // Region VI — Western Visayas
  // =============================================
  ...loc("VI", "Aklan", "Kalibo", 94, 112),
  ...loc("VI", "Antique", "San Jose de Buenavista", 94.5, 112.5),
  ...loc("VI", "Capiz", "Roxas", 93.5, 111.5),
  ...loc("VI", "Guimaras", "Jordan", 94, 112),
  ...loc("VI", "Iloilo", "Iloilo City", 93, 111),
  ...loc("VI", "Iloilo", "Passi", 93.5, 111.5),
  ...loc("VI", "Negros Occidental", "Bacolod", 92.5, 110.5),
  ...loc("VI", "Negros Occidental", "Silay", 93, 111),
  ...loc("VI", "Negros Occidental", "Talisay", 92.8, 110.8),
  ...loc("VI", "Negros Occidental", "Kabankalan", 93.5, 111.5),

  // =============================================
  // Region VII — Central Visayas
  // =============================================
  ...loc("VII", "Bohol", "Tagbilaran", 94, 112),
  ...loc("VII", "Bohol", "Ubay", 94.5, 112.5),
  ...loc("VII", "Cebu", "Cebu City", 93, 111),
  ...loc("VII", "Cebu", "Mandaue", 92.8, 110.8),
  ...loc("VII", "Cebu", "Lapu-Lapu", 93.2, 111.2),
  ...loc("VII", "Cebu", "Talisay", 93, 111),
  ...loc("VII", "Cebu", "Toledo", 93.5, 111.5),
  ...loc("VII", "Negros Oriental", "Dumaguete", 93.5, 111.5),
  ...loc("VII", "Negros Oriental", "Bayawan", 94, 112),
  ...loc("VII", "Siquijor", "Siquijor", 96.5, 114.5),

  // =============================================
  // Region VIII — Eastern Visayas
  // =============================================
  ...loc("VIII", "Biliran", "Naval", 95.5, 113.5),
  ...loc("VIII", "Eastern Samar", "Borongan", 96, 114),
  ...loc("VIII", "Leyte", "Tacloban", 94.5, 112.5),
  ...loc("VIII", "Leyte", "Ormoc", 95, 113),
  ...loc("VIII", "Northern Samar", "Catarman", 96, 114),
  ...loc("VIII", "Samar", "Catbalogan", 95.5, 113.5),
  ...loc("VIII", "Southern Leyte", "Maasin", 95.5, 113.5),

  // =============================================
  // Region IX — Zamboanga
  // =============================================
  ...loc("IX", "Zamboanga del Norte", "Dipolog", 94.5, 112.5),
  ...loc("IX", "Zamboanga del Norte", "Dapitan", 94.8, 112.8),
  ...loc("IX", "Zamboanga del Sur", "Zamboanga City", 94, 112),
  ...loc("IX", "Zamboanga del Sur", "Pagadian", 94.5, 112.5),
  ...loc("IX", "Zamboanga Sibugay", "Ipil", 95, 113),

  // =============================================
  // Region X — Northern Mindanao
  // =============================================
  ...loc("X", "Bukidnon", "Malaybalay", 94, 112),
  ...loc("X", "Bukidnon", "Valencia", 93.8, 111.8),
  ...loc("X", "Camiguin", "Mambajao", 96.5, 114.5),
  ...loc("X", "Lanao del Norte", "Iligan", 93.5, 111.5),
  ...loc("X", "Misamis Occidental", "Oroquieta", 94, 112),
  ...loc("X", "Misamis Occidental", "Ozamiz", 93.8, 111.8),
  ...loc("X", "Misamis Oriental", "Cagayan de Oro", 93, 111),
  ...loc("X", "Misamis Oriental", "Gingoog", 93.5, 111.5),

  // =============================================
  // Region XI — Davao
  // =============================================
  ...loc("XI", "Davao de Oro", "Nabunturan", 95.5, 113.5),
  ...loc("XI", "Davao del Norte", "Tagum", 94, 112),
  ...loc("XI", "Davao del Norte", "Panabo", 94.2, 112.2),
  ...loc("XI", "Davao del Sur", "Davao City", 93.5, 111.5),
  ...loc("XI", "Davao del Sur", "Digos", 94, 112),
  ...loc("XI", "Davao Occidental", "Malita", 95.5, 113.5),
  ...loc("XI", "Davao Oriental", "Mati", 95, 113),

  // =============================================
  // Region XII — SOCCSKSARGEN
  // =============================================
  ...loc("XII", "Cotabato", "Kidapawan", 94.5, 112.5),
  ...loc("XII", "Sarangani", "Alabel", 94.5, 112.5),
  ...loc("XII", "South Cotabato", "General Santos", 93.5, 111.5),
  ...loc("XII", "South Cotabato", "Koronadal", 94, 112),
  ...loc("XII", "Sultan Kudarat", "Tacurong", 95, 113),
  ...loc("XII", "Sultan Kudarat", "Isulan", 95.2, 113.2),

  // =============================================
  // Region XIII — Caraga
  // =============================================
  ...loc("XIII", "Agusan del Norte", "Butuan", 94, 112),
  ...loc("XIII", "Agusan del Norte", "Cabadbaran", 94.5, 112.5),
  ...loc("XIII", "Agusan del Sur", "Prosperidad", 95, 113),
  ...loc("XIII", "Agusan del Sur", "San Francisco", 95.2, 113.2),
  ...loc("XIII", "Dinagat Islands", "San Jose", 97.5, 115.5),
  ...loc("XIII", "Surigao del Norte", "Surigao City", 95, 113),
  ...loc("XIII", "Surigao del Sur", "Tandag", 95.5, 113.5),
  ...loc("XIII", "Surigao del Sur", "Bislig", 95.8, 113.8),

  // =============================================
  // CAR — Cordillera
  // =============================================
  ...loc("CAR", "Abra", "Bangued", 94.5, 112.5),
  ...loc("CAR", "Apayao", "Kabugao", 96.5, 114.5),
  ...loc("CAR", "Benguet", "Baguio", 93, 111),
  ...loc("CAR", "Benguet", "La Trinidad", 93.2, 111.2),
  ...loc("CAR", "Ifugao", "Lagawe", 96, 114),
  ...loc("CAR", "Kalinga", "Tabuk", 95.5, 113.5),
  ...loc("CAR", "Mountain Province", "Bontoc", 96.5, 114.5),

  // =============================================
  // BARMM
  // =============================================
  ...loc("BARMM", "Basilan", "Isabela", 96.5, 114.5),
  ...loc("BARMM", "Lanao del Sur", "Marawi", 95.5, 113.5),
  ...loc("BARMM", "Maguindanao del Norte", "Cotabato City", 94, 112),
  ...loc("BARMM", "Maguindanao del Sur", "Buluan", 95.5, 113.5),
  ...loc("BARMM", "Sulu", "Jolo", 97.5, 115.5),
  ...loc("BARMM", "Tawi-Tawi", "Bongao", 98.5, 116.5),
];

export const SAMPLE_FORECAST: ForecastData = {
  direction: "up",
  estimatedChange: 6.50,
  confidence: "high",
  effectiveDate: "2026-03-31",
  factors: {
    crudeDelta: 8.5,
    forexDelta: 0.85,
  },
};
