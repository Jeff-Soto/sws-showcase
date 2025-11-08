"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

export default function SiteLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `
          radial-gradient(circle at 20% 0%, rgba(201,160,63,0.18), transparent 45%),
          radial-gradient(circle at 80% 10%, rgba(201,160,63,0.12), transparent 50%),
          linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,1) 80%)
        `,
      }}
    >
      <AppHeader />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <AppFooter />
    </Box>
  );
}

