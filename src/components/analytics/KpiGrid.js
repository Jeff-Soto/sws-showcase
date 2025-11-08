"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const formatter = new Intl.NumberFormat("en-US");

const formatValue = (item) => {
  if (item.suffix === "%") {
    return `${item.value.toFixed(1)}%`;
  }

  const formatted = formatter.format(item.value);

  return `${item.prefix ?? ""}${formatted}${item.suffix && item.suffix !== "%" ? item.suffix : ""}`;
};

export default function KpiGrid({ items }) {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid size={{ xs: 12, md: 3 }} key={item.label}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background:
                "linear-gradient(180deg, rgba(201,160,63,0.12) 0%, rgba(20,20,20,0.95) 100%)",
              border: "1px solid rgba(201,160,63,0.2)",
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatValue(item)}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ArrowDropUpIcon sx={{ color: "primary.light" }} />
                  <Typography variant="body2" sx={{ color: "primary.light", fontWeight: 600 }}>
                    {item.change > 0 ? "+" : ""}
                    {item.change.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs previous period
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

