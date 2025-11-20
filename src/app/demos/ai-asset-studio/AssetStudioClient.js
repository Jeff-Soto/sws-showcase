"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import HistoryIcon from "@mui/icons-material/History";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";
import { styleOptions } from "@/data/assetStudio";

const sizeOptions = ["1024x1024", "1024x1536", "1536x1024", "auto"];

export default function AssetStudioClient({ demo }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styleOptions[0].value);
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Describe the asset you want to generate.");
      return;
    }

    setError("");
    setLoading(true);
    setNotice("");

    try {
      const response = await fetch("/api/asset-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, size }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Unable to generate image.");
      }

      const { data } = await response.json();
      setCurrentResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 6));
      setNotice(data.note ?? "");
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Unable to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI Asset Studio"
        subtitle="Generate brand-ready imagery using natural language prompts, curated style presets, and instant download links."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid rgba(201,160,63,0.2)",
              background:
                "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Prompt builder
              </Typography>
              <TextField
                label="Describe the asset"
                placeholder="e.g. Hero illustration of an AI-powered analytics dashboard glowing in gold and charcoal."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                multiline
                minRows={4}
              />
              <TextField
                select
                label="Style"
                value={style}
                onChange={(event) => setStyle(event.target.value)}
              >
                {styleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Size" value={size} onChange={(event) => setSize(event.target.value)}>
                {sizeOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              {!error && notice && (
                <Typography variant="body2" color="text.secondary">
                  {notice}
                </Typography>
              )}

              <GradientButton onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={16} color="inherit" />
                    <span>Generating...</span>
                  </Stack>
                ) : (
                  "Generate asset"
                )}
              </GradientButton>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {currentResult ? (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Latest generation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentResult.prompt}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={styleOptions.find((item) => item.value === currentResult.style)?.label}
                        sx={{
                          backgroundColor: "rgba(201,160,63,0.12)",
                          border: "1px solid rgba(201,160,63,0.25)",
                        }}
                      />
                      <IconButton
                        component="a"
                        href={currentResult.imageUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          border: "1px solid rgba(201,160,63,0.35)",
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      flexGrow: 1,
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "rgba(201,160,63,0.08)",
                      border: "1px solid rgba(201,160,63,0.2)",
                    }}
                  >
                    <Box
                      component="img"
                      src={currentResult.imageUrl}
                      alt={currentResult.prompt}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </>
              ) : (
                <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
                  <HistoryIcon sx={{ fontSize: 40, color: "primary.light" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Your generated image will appear here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 360 }}>
                    Craft a prompt, choose a style preset, and let the AI create a high fidelity asset aligned with the Soto Web Studios brand palette.
                  </Typography>
                </Stack>
              )}
            </Paper>

            {history.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid rgba(201,160,63,0.2)",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Recent gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {history.map((item) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.createdAt}>
                        <Box
                          sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid rgba(201,160,63,0.18)",
                            position: "relative",
                          }}
                        >
                          <Box
                            component="img"
                            src={item.imageUrl}
                            alt={item.prompt}
                            sx={{ width: "100%", height: 160, objectFit: "cover" }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 1.5,
                              background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
                            }}
                          >
                            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }}>
                              {styleOptions.find((option) => option.value === item.style)?.label}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            )}

            <InfoCard
              title="Production roadmap"
              description="Swap the mocked image storage for S3, attach brand kits for color harmonies, and export assets directly into marketing automation or design systems."
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

