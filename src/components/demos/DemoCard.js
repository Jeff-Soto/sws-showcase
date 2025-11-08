"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import GradientButton from "@/components/common/GradientButton";

export default function DemoCard({ demo }) {
  return (
    <Box
      component="article"
      sx={{
        borderRadius: 3,
        p: 3,
        border: "1px solid rgba(201,160,63,0.15)",
        background:
          "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        height: "100%",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 45px rgba(201,160,63,0.25)",
          borderColor: "rgba(201,160,63,0.3)",
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {demo.title}
          </Typography>
          <ArrowOutwardIcon fontSize="small" sx={{ color: "primary.light" }} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {demo.description}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {demo.tech.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={{
              backgroundColor: "rgba(201,160,63,0.12)",
              border: "1px solid rgba(201,160,63,0.25)",
            }}
          />
        ))}
      </Stack>

      <Stack spacing={1}>
        {demo.highlights.map((item) => (
          <Stack key={item} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <GradientButton href={`/demos/${demo.slug}`} sx={{ mt: "auto", alignSelf: "flex-start" }}>
        View Demo
      </GradientButton>
    </Box>
  );
}

