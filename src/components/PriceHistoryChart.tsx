"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface HistoryEntry {
  week: string;
  gasoline: number;
  diesel: number;
}

interface PriceHistoryChartProps {
  history: HistoryEntry[];
}

export default function PriceHistoryChart({
  history,
}: PriceHistoryChartProps) {
  if (history.length === 0) return null;

  // Show last 12 data points for readability
  const data = history.slice(-12).map((h) => ({
    week: h.week.replace(/\d{4}/, "").trim(), // shorten label
    Regular: h.gasoline,
    Diesel: h.diesel,
  }));

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-gray-600">
        Price History (per liter)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => `₱${v}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => [`₱${Number(value).toFixed(2)}`, ""]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="Regular"
            stroke="#1B7A3D"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke="#F5A623"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
