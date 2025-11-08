"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  actions,
}) {
  return (
    <Stack
      spacing={1.5}
      alignItems={align === "center" ? "center" : "flex-start"}
      textAlign={align}
      sx={{ maxWidth: align === "center" ? 720 : "100%", mx: align === "center" ? "auto" : 0 }}
    >
      {eyebrow && (
        <Chip
          label={eyebrow}
          sx={{
            backgroundColor: "rgba(201,160,63,0.12)",
            border: "1px solid rgba(201,160,63,0.25)",
            color: "primary.light",
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        />
      )}
      {title && (
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      {actions && (
        <Box sx={{ mt: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap" }}>{actions}</Box>
      )}
    </Stack>
  );
}

