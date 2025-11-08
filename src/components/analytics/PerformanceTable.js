"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const numberFormatter = new Intl.NumberFormat("en-US");

export default function PerformanceTable({ title, rows, columns }) {
  return (
    <Stack
      spacing={2}
      sx={{
        borderRadius: 3,
        p: 3,
        border: "1px solid rgba(201,160,63,0.2)",
        background:
          "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ borderColor: "rgba(201,160,63,0.15)" }} />
      <Stack spacing={1.5}>
        {rows.map((row, idx) => (
          <Stack
            key={row[columns[0].field]}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              py: 1,
              borderRadius: 2,
              backgroundColor: idx % 2 === 0 ? "rgba(201,160,63,0.04)" : "transparent",
              px: 1.5,
            }}
          >
            {columns.map((column) => (
              <Box
                key={column.field}
                sx={{
                  flexBasis: column.width ?? "auto",
                  flexGrow: column.flex ?? 0,
                  minWidth: column.minWidth ?? 0,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: column.highlight ? 600 : 500,
                    color: column.highlight ? "text.primary" : "text.secondary",
                    textTransform: column.muted ? "uppercase" : "none",
                  }}
                >
                  {column.format
                    ? column.format(row[column.field])
                    : typeof row[column.field] === "number"
                    ? numberFormatter.format(row[column.field])
                    : row[column.field]}
                </Typography>
              </Box>
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

