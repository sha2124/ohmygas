import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1B7A3D",
};

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OhmyGas",
  },
  openGraph: {
    title: "OhmyGas — Fuel Prices PH",
    description: "Compare gas & diesel prices across the Philippines. Para sa drayber, hindi lang sa Metro.",
    url: "https://ohmygas.vercel.app",
    siteName: "OhmyGas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-PH"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
