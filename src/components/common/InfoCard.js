"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function InfoCard({ icon, title, description, footer, actions, sx }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, rgba(201,160,63,0.12) 0%, rgba(20,20,20,0.95) 100%)",
        border: "1px solid rgba(201,160,63,0.12)",
        ...sx,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {icon && (
            <Stack
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(201,160,63,0.12)",
                border: "1px solid rgba(201,160,63,0.2)",
                color: "primary.light",
                fontSize: 24,
              }}
            >
              {icon}
            </Stack>
          )}
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {actions && <Stack spacing={1}>{actions}</Stack>}
        </Stack>
      </CardContent>
      {footer && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(201,160,63,0.12)",
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          {footer}
        </Stack>
      )}
    </Card>
  );
}

