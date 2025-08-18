import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export type PricePoint = { collected_at: string; price: number };

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function PriceHistoryChart({ data }: { data: PricePoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="text-muted-foreground">
          <div className="text-lg mb-2">No price history available</div>
          <div className="text-sm">Price data will appear here as it's collected over time</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="collected_at"
            tickFormatter={formatDateLabel}
            minTickGap={24}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            width={60}
            tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            labelFormatter={(label) => `Date: ${formatDateLabel(label as string)}`}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--card-foreground))"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            dot={false} 
            strokeWidth={2} 
            stroke="hsl(var(--primary))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}