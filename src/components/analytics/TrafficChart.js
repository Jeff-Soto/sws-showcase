"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const valueFormatter = new Intl.NumberFormat("en-US");

export default function TrafficChart({ data }) {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
    [data]
  );

  return (
    <Box sx={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4B05E" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(201,160,63,0.15)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.35)"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.35)"
            tickFormatter={(value) => valueFormatter.format(value)}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            cursor={{ stroke: "rgba(201,160,63,0.35)", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0].value;
              return (
                <Box
                  sx={{
                    backgroundColor: "rgba(20,20,20,0.95)",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(201,160,63,0.35)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {valueFormatter.format(value)} visits
                  </Typography>
                </Box>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="#C9A03F"
            strokeWidth={3}
            fill="url(#trafficGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

