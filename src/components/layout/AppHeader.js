"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [{ label: "Demos", path: "/demos" }];

export default function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  const isActive = (path) => pathname.startsWith(path);

  const drawer = (
    <Box
      onClick={toggleDrawer}
      sx={{
        backgroundColor: "#0A0A0A",
        height: "100%",
        pt: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
        <IconButton onClick={toggleDrawer} sx={{ color: "#C9A03F" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{
                py: 2,
                px: 3,
                borderLeft: isActive(item.path) ? "4px solid #C9A03F" : "none",
                backgroundColor: isActive(item.path)
                  ? "rgba(201, 160, 63, 0.1)"
                  : "transparent",
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  color: isActive(item.path) ? "#C9A03F" : "#FFFFFF",
                  "& .MuiTypography-root": {
                    fontWeight: isActive(item.path) ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 3, mt: 2 }}>
        <Button
          fullWidth
          component={Link}
          href="https://www.sotowebstudios.com/contact"
          rel="noreferrer"
          sx={{
            borderRadius: 999,
            backgroundImage: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
            color: "#0A0A0A",
            fontWeight: 600,
            px: 2,
          }}
        >
          Start a Project
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid rgba(201,160,63,0.18)",
          borderRadius: 0,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1, px: { xs: 2, sm: 3, md: 4 } }}>
            <Link
              href="https://www.sotowebstudios.com"
              style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
            >
              <Image
                src="/logos/sws_logo_gold.png"
                alt="Soto Web Studios"
                width={200}
                height={60}
                sizes="(max-width: 768px) 150px, 200px"
                style={{
                  objectFit: "contain",
                  height: "auto",
                  maxHeight: "60px",
                  width: "auto",
                  maxWidth: "200px",
                }}
                priority
              />
            </Link>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="text"
                  component={Link}
                  href={item.path}
                  sx={{
                    borderRadius: 0,
                    background: "none !important",
                    border: "none",
                    color: isActive(item.path) ? "#C9A03F" : "#FFFFFF",
                    px: 1.5,
                    py: 0,
                    position: "relative",
                    textTransform: "none",
                    fontSize: 15,
                    lineHeight: 1.6,
                    fontWeight: isActive(item.path) ? 600 : 400,
                    minWidth: 0,
                    "&:hover": {
                      background: "none",
                      backgroundColor: "transparent",
                      color: "#C9A03F",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: isActive(item.path) ? "80%" : "0%",
                      height: "2px",
                      backgroundColor: "#C9A03F",
                      transition: "width 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "80%",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                component={Link}
                href="https://www.sotowebstudios.com/contact"
                rel="noreferrer"
                sx={{
                  borderRadius: 999,
                  backgroundImage: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                  color: "#0A0A0A",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Start a Project
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer}
                sx={{ color: "#C9A03F" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: "#0A0A0A",
            border: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

