"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { demos } from "@/data/demos";
import DemoCard from "@/components/demos/DemoCard";
import GradientButton from "@/components/common/GradientButton";

const demoCategories = [
  {
    label: "Content & Marketing",
    slugs: ["ai-content-generator"],
    description: "Campaign ideation, tone control, and on-brand copy generation.",
  },
  {
    label: "Analytics & Insights",
    slugs: ["smart-analytics-dashboard"],
    description: "Realtime dashboards blended with AI-written narratives.",
  },
  {
    label: "Commerce & Support",
    slugs: ["ecommerce-ai-assistant", "ai-support-inbox"],
    description: "Conversational buying journeys and support automation.",
  },
  {
    label: "Operations & Assets",
    slugs: ["document-analysis", "ai-asset-studio"],
    description: "Document intelligence and AI-generated creative assets.",
  },
];

export default function DemosOverviewPage() {
  return (
    <Stack spacing={10}>
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            px: 2.5,
            py: 0.8,
            borderRadius: 999,
            border: "1px solid rgba(201,160,63,0.2)",
            backgroundColor: "rgba(201,160,63,0.12)",
            color: "primary.light",
            fontWeight: 600,
          }}
        >
          Showcase
        </Box>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2.4rem", md: "3.4rem" },
            fontWeight: 700,
            maxWidth: 760,
          }}
        >
          A collection of AI-native experiences.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            maxWidth: 620,
          }}
        >
          Each concept is wired for real OpenAI endpoints, features realistic UX flows, and is ready
          to tailor to your stakeholders.
        </Typography>
        <GradientButton
          href="https://www.sotowebstudios.com/contact"
          rel="noreferrer"
        >
          Discuss Your Use Case
        </GradientButton>
      </Box>

      <Stack spacing={6}>
        {demoCategories.map((category, index) => (
          <Box key={category.label}>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {category.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              {demos
                .filter((demo) => category.slugs.includes(demo.slug))
                .map((demo) => (
                  <Grid
                    size={{
                      xs: 12,
                      md: category.slugs.length === 1 && index < 2 ? 12 : 6,
                    }}
                    key={demo.slug}
                  >
                    <DemoCard demo={demo} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          background:
            "linear-gradient(135deg, rgba(201,160,63,0.4) 0%, rgba(20,20,20,0.88) 90%)",
          border: "1px solid rgba(201,160,63,0.35)",
        }}
      >
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Have a cool idea?
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 620 }}>
            Let us be your partner in building the future of AI-native experiences.
          </Typography>
          <GradientButton
            href="https://www.sotowebstudios.com/contact"
            variant="outlined"
            sx={{
              backgroundImage: "none",
              borderColor: "rgba(201,160,63,0.35)",
              color: "primary.light",
            }}
          >
            Contact Us
          </GradientButton>
        </Stack>
      </Box>
    </Stack>
  );
}

