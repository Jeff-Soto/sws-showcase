"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import KpiGrid from "@/components/analytics/KpiGrid";
import TrafficChart from "@/components/analytics/TrafficChart";
import InsightsPanel from "@/components/analytics/InsightsPanel";
import PerformanceTable from "@/components/analytics/PerformanceTable";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import { analyticsPresets } from "@/data/analytics";

const rangeOptions = Object.entries(analyticsPresets).map(([key, value]) => ({
  value: key,
  label: value.label,
}));

export default function AnalyticsDashboardClient() {
  const [range, setRange] = useState("last-7-days");
  const [insightOffset, setInsightOffset] = useState(0);

  const preset = analyticsPresets[range];

  const rotatedInsights = useMemo(() => {
    const items = preset.insights;
    if (!items.length) return [];
    return items.map(
      (_, index) => items[(index + insightOffset) % items.length]
    );
  }, [preset.insights, insightOffset]);

  const handleShuffleInsights = () => {
    setInsightOffset((prev) => (prev + 1) % preset.insights.length);
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="Smart Analytics Dashboard"
        subtitle="Realtime-feeling KPIs, AI-generated narratives, and Recharts visualizations ready to drop into your SaaS or product analytics experience."
        actions={
          <Chip
            icon={<AutoGraphIcon sx={{ color: "primary.light !important" }} />}
            label="Powered by Next.js + Recharts + OpenAI"
            sx={{
              backgroundColor: "rgba(201,160,63,0.12)",
              border: "1px solid rgba(201,160,63,0.25)",
              color: "primary.light",
              fontWeight: 600,
            }}
          />
        }
      />

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(201,160,63,0.2)",
          background:
            "linear-gradient(180deg, rgba(201,160,63,0.1) 0%, rgba(20,20,20,0.95) 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Soto Intelligence Workspace
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track customer lifecycle metrics, surface AI-driven highlights, and empower success
              teams with contextual narratives.
            </Typography>
          </Box>
          <Select
            value={range}
            onChange={(event) => {
              setRange(event.target.value);
              setInsightOffset(0);
            }}
            size="small"
            sx={{
              minWidth: 200,
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(201,160,63,0.35)",
              },
            }}
          >
            {rangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Paper>

      <KpiGrid items={preset.kpis} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(201,160,63,0.2)",
              background:
                "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
              p: 3,
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Traffic Momentum
              </Typography>
              <TrafficChart data={preset.trafficOverTime} />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InsightsPanel insights={rotatedInsights} onShuffle={handleShuffleInsights} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <PerformanceTable
            title="Top Pages"
            rows={preset.topPages}
            columns={[
              { field: "page", flex: 2, highlight: true },
              { field: "views", flex: 1, highlight: true },
              {
                field: "bounce",
                flex: 1,
                format: (value) => `${value}% bounce`,
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <PerformanceTable
            title="Top Sources"
            rows={preset.topSources}
            columns={[
              { field: "source", flex: 2, highlight: true },
              { field: "visits", flex: 1, highlight: true },
              {
                field: "change",
                flex: 1,
                format: (value) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`,
              },
            ]}
          />
        </Grid>
      </Grid>

      <InfoCard
        title="Integration blueprint"
        description="Connect Segment or Snowflake to stream analytics, run nightly summarizations through OpenAI, and push timely insights into customer success playbooks."
      />
    </Stack>
  );
}

