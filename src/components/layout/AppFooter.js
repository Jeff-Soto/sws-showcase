"use client";

import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from "@mui/material";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const footerLinks = {
  Company: [
    { label: "About", path: "https://www.sotowebstudios.com/about" },
    { label: "Services", path: "https://www.sotowebstudios.com/services" },
    { label: "Showcase", path: "https://www.sotowebstudios.com/showcase" },
    { label: "Contact", path: "https://www.sotowebstudios.com/contact" },
  ],
  Resources: [
    { label: "Blog", path: "https://www.sotowebstudios.com/blog" },
    { label: "Privacy Policy", path: "https://www.sotowebstudios.com/privacy" },
    { label: "Terms of Service", path: "https://www.sotowebstudios.com/terms" },
  ],
};

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0A0A0A",
        borderTop: "1px solid rgba(201, 160, 63, 0.2)",
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#C9A03F",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Soto Web Studios
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#CCCCCC",
                mb: 2,
                lineHeight: 1.7,
              }}
            >
              Building modern AI-integrated web applications with cutting-edge technology and exceptional design.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton
                aria-label="LinkedIn"
                component="a"
                href="https://www.linkedin.com/company/soto-web-studios/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#CCCCCC",
                  "&:hover": { color: "#C9A03F" },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                component="a"
                href="https://www.instagram.com/sotowebstudios/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#CCCCCC",
                  "&:hover": { color: "#C9A03F" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="Facebook"
                component="a"
                href="https://www.facebook.com/profile.php?id=61583525663649"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#CCCCCC",
                  "&:hover": { color: "#C9A03F" },
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "center" },
              gap: { xs: 4, sm: 6 },
            }}
          >
            {Object.entries(footerLinks).map(([title, links]) => (
              <Box key={title} sx={{ flex: 1, maxWidth: "150px" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {links.map((link) => (
                    <MuiLink
                      key={link.label}
                      component={Link}
                      href={link.path}
                      sx={{
                        color: "#CCCCCC",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        transition: "color 0.2s",
                        "&:hover": {
                          color: "#C9A03F",
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  ))}
                </Box>
              </Box>
            ))}
          </Grid>

          <Grid
            size={{ xs: 12, sm: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              textAlign: { xs: "left", md: "right" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#CCCCCC",
                mb: 2,
                lineHeight: 1.7,
              }}
            >
              Ready to start your AI-powered web project?
            </Typography>
            <MuiLink
              component={Link}
              href="https://www.sotowebstudios.com/contact"
              sx={{
                display: "inline-block",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                color: "#0A0A0A",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0px 4px 12px rgba(201, 160, 63, 0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Contact Us
            </MuiLink>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(201, 160, 63, 0.1)",
            mt: 4,
            pt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#CCCCCC",
              fontSize: "0.875rem",
            }}
          >
            © {new Date().getFullYear()} Soto Web Studios. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#CCCCCC",
              fontSize: "0.875rem",
            }}
          >
            Built with Next.js & AI ✨
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

