import { createTheme, alpha } from "@mui/material/styles";

const gold = {
  main: "#C9A03F",
  light: "#D4B05E",
  dark: "#A88532",
  contrastText: "#0A0A0A",
};

const background = {
  default: "#0A0A0A",
  paper: "#141414",
};

const divider = "rgba(201, 160, 63, 0.2)";

const gradient = "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)";

const shadowLayers = [
  `0 10px 30px ${alpha("#000", 0.45)}`,
  `0 12px 40px ${alpha("#C9A03F", 0.1)}`,
  `0 18px 60px ${alpha("#C9A03F", 0.18)}`,
];

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: gold,
    secondary: gold,
    background,
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
    },
    divider,
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
    },
    subtitle1: {
      color: "#CCCCCC",
    },
    body1: {
      color: "#FFFFFF",
    },
    body2: {
      color: "#CCCCCC",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    ...Array.from({ length: 24 }, (_, index) =>
      index === 0
        ? "none"
        : `${shadowLayers[0]}, ${shadowLayers[1]}, ${shadowLayers[2]}`
    ),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: background.default,
          color: "#FFFFFF",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(201,160,63,0.12), transparent 55%), radial-gradient(circle at bottom right, rgba(201,160,63,0.08), transparent 50%)",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::selection": {
          backgroundColor: alpha(gold.main, 0.35),
          color: "#0A0A0A",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(10, 10, 10, 0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${alpha(gold.main, 0.2)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: background.paper,
          borderRadius: 18,
          border: `1px solid ${alpha(gold.main, 0.12)}`,
          transition:
            "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
          boxShadow: `${shadowLayers[0]}, ${shadowLayers[1]}`,
          "&:hover": {
            borderColor: alpha(gold.main, 0.3),
            boxShadow: `${shadowLayers[0]}, ${shadowLayers[1]}, ${shadowLayers[2]}`,
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: gradient,
          color: gold.contrastText,
          "&:hover": {
            backgroundImage:
              "linear-gradient(135deg, #D4B05E 0%, #C9A03F 100%)",
            boxShadow: `${shadowLayers[0]}, ${shadowLayers[1]}`,
            color: gold.contrastText,
          },
        },
        outlined: {
          backgroundImage: "none",
          color: gold.light,
          borderColor: alpha(gold.main, 0.4),
          "&:hover": {
            borderColor: alpha(gold.main, 0.8),
            backgroundColor: alpha(gold.main, 0.08),
            color: gold.contrastText,
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: gold.light,
          transition: "color 0.2s ease",
          "&:hover": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: alpha("#FFFFFF", 0.02),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(gold.main, 0.2),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(gold.main, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: gold.main,
            boxShadow: `0 0 0 2px ${alpha(gold.main, 0.25)}`,
          },
        },
        input: {
          color: "#FFFFFF",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: divider,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: alpha(gold.main, 0.12),
          color: gold.light,
          border: `1px solid ${alpha(gold.main, 0.2)}`,
        },
      },
    },
  },
});

export const gradientAccent = gradient;

export default theme;

