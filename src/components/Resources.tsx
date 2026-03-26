"use client";

const RESOURCES = [
  {
    category: "Official Sources",
    links: [
      {
        title: "DOE Oil Monitor",
        description: "Weekly price adjustments & advisories",
        url: "https://www.doe.gov.ph/oil-monitor",
      },
      {
        title: "DOE Retail Pump Prices",
        description: "Official per-region pump price monitoring",
        url: "https://www.doe.gov.ph/retail-pump-prices-metro-manila",
      },
    ],
  },
  {
    category: "News & Analysis",
    links: [
      {
        title: "Rappler — Fuel Prices",
        description: "Latest fuel price movement news",
        url: "https://www.rappler.com/topic/fuel-prices/",
      },
      {
        title: "Inquirer — Oil Price",
        description: "Business news on oil price changes",
        url: "https://business.inquirer.net/tag/oil-price",
      },
      {
        title: "Top Gear PH — Fuel",
        description: "Weekly fuel price updates for drivers",
        url: "https://www.topgear.com.ph/tag/fuel-price",
      },
    ],
  },
  {
    category: "Market Data",
    links: [
      {
        title: "Brent Crude — Yahoo Finance",
        description: "Live crude oil prices",
        url: "https://finance.yahoo.com/quote/BZ=F/",
      },
      {
        title: "USD/PHP Exchange Rate",
        description: "Live forex rate",
        url: "https://www.google.com/finance/quote/USD-PHP",
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-brand-charcoal">
        Fuel Price Resources
      </h3>
      <div className="flex flex-col gap-4">
        {RESOURCES.map((group) => (
          <div key={group.category}>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {group.category}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                >
                  <span className="mt-0.5 text-xs text-gray-300 transition-colors group-hover:text-brand-green">
                    ↗
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-charcoal group-hover:text-brand-green">
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
