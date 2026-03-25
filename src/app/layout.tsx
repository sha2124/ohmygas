import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OhmyGas — Compare Fuel Prices in the Philippines",
  description:
    "Compare gas and diesel prices across brands and provinces. Get short-term price forecasts and alerts before price hikes. Para sa drayber, hindi lang sa Metro.",
  keywords: [
    "gas price Philippines",
    "fuel price comparison",
    "diesel price",
    "Shell",
    "Petron",
    "Caltex",
    "presyo ng gasolina",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
