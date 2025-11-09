"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const quickLinks = [
  { label: "Services", href: "https://www.sotowebstudios.com/#services" },
  { label: "Portfolio", href: "https://www.sotowebstudios.com/portfolio" },
  { label: "About", href: "https://www.sotowebstudios.com/about" },
  { label: "Blog", href: "https://www.sotowebstudios.com/blog" },
];

const resources = [
  { label: "Privacy Policy", href: "https://www.sotowebstudios.com/privacy" },
  { label: "Terms of Service", href: "https://www.sotowebstudios.com/terms" },
  { label: "Contact", href: "https://www.sotowebstudios.com/contact" },
];

export default function AppFooter() {
  return (
    <Box component="footer" sx={{ mt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            background:
              "radial-gradient(circle at top, rgba(201,160,63,0.15), transparent 60%)",
            border: "1px solid rgba(201,160,63,0.15)",
          }}
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Soto Web Studios
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                Building modern AI-integrated web applications with cutting-edge technology and exceptional design.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary" }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {quickLinks.map((item) => (
                  <Typography
                    key={item.label}
                    component={Link}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "text.primary",
                      fontSize: 14,
                      "&:hover": { color: "primary.light" },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary" }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                {resources.map((item) => (
                  <Typography
                    key={item.label}
                    component={Link}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "text.primary",
                      fontSize: 14,
                      "&:hover": { color: "primary.light" },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(201,160,63,0.15)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Soto Web Studios. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography
              component={Link}
              href="mailto:info@sotowebstudios.com"
              sx={{ color: "text.secondary", "&:hover": { color: "primary.light" } }}
            >
              info@sotowebstudios.com
            </Typography>
            <Typography
              component={Link}
              href="https://www.linkedin.com/company/soto-web-studios/"
              target="_blank"
              rel="noreferrer"
              sx={{ color: "text.secondary", "&:hover": { color: "primary.light" } }}
            >
              LinkedIn
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

