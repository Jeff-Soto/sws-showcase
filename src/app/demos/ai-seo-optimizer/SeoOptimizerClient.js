"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";

const contentTypeOptions = [
  { value: "blog-post", label: "Blog Post" },
  { value: "web-page", label: "Web Page" },
  { value: "product-page", label: "Product Page" },
  { value: "landing-page", label: "Landing Page" },
  { value: "article", label: "Article" },
];

export default function SeoOptimizerClient({ demo }) {
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [contentType, setContentType] = useState("web-page");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("Please enter content to analyze.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/seo-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, targetKeyword, contentType, url }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to analyze content.");
      }

      const { data } = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to analyze content.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ open: true, message: "Copied to clipboard." });
    } catch (err) {
      setToast({ open: true, message: "Unable to copy. Please copy manually." });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI SEO Content Optimizer"
        subtitle="Analyze your content and get AI-powered SEO recommendations, optimized meta tags, keyword suggestions, and actionable improvements."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              position: "sticky",
              top: { md: 120 },
              border: "1px solid rgba(201,160,63,0.2)",
              backdropFilter: "blur(24px)",
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Content Details
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="content-type-label">Content Type</InputLabel>
                <Select
                  labelId="content-type-label"
                  value={contentType}
                  label="Content Type"
                  onChange={(e) => setContentType(e.target.value)}
                >
                  {contentTypeOptions.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Target Keyword (optional)"
                placeholder="e.g. AI content optimization"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
              <TextField
                label="Page URL (optional)"
                placeholder="https://example.com/page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <TextField
                label="Content to Analyze"
                placeholder="Paste your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                multiline
                minRows={10}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <GradientButton startIcon={<PlayArrowIcon />} onClick={handleAnalyze} disabled={loading} fullWidth>
                {loading ? "Analyzing..." : "Analyze Content"}
              </GradientButton>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {loading && !result ? (
              <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                <Stack spacing={2}>
                  <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
                  <Skeleton variant="rectangular" height={100} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </Stack>
              </Paper>
            ) : result ? (
              <>
                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        SEO Score
                      </Typography>
                      <Chip
                        label={`${result.seoScore}/100`}
                        color={getScoreColor(result.seoScore)}
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={result.seoScore}
                      color={getScoreColor(result.seoScore)}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Your content SEO score based on best practices and keyword optimization.
                    </Typography>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Meta Tags
                      </Typography>
                      <IconButton size="small" onClick={() => handleCopy(`${result.metaTitle}\n${result.metaDescription}`)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Divider />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                          Title Tag
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {result.metaTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {result.metaTitle.length} characters (optimal: 50-60)
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                          Meta Description
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {result.metaDescription}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {result.metaDescription.length} characters (optimal: 150-160)
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Keywords
                    </Typography>
                    <Divider />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {result.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" />
                      ))}
                    </Stack>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AutoAwesomeIcon sx={{ color: "primary.light" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        SEO Recommendations
                      </Typography>
                    </Stack>
                    <Divider />
                    <List>
                      {result.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ px: 0, alignItems: "flex-start" }}>
                          <ListItemText
                            primary={rec}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Paper>

                {result.improvements && result.improvements.length > 0 && (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Content Improvements
                      </Typography>
                      <Divider />
                      <Stack spacing={2}>
                        {result.improvements.map((improvement, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid rgba(201,160,63,0.15)",
                              backgroundColor: "rgba(201,160,63,0.05)",
                            }}
                          >
                            <Chip label={improvement.type} size="small" sx={{ mb: 1 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                              Current:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {improvement.current}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Suggested:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {improvement.suggested}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {improvement.reason}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                )}

                {result.titleSuggestions && result.titleSuggestions.length > 0 && (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Alternative Title Suggestions
                      </Typography>
                      <Divider />
                      <Stack spacing={1}>
                        {result.titleSuggestions.map((title, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              border: "1px solid rgba(201,160,63,0.15)",
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "rgba(201,160,63,0.05)" },
                            }}
                            onClick={() => handleCopy(title)}
                          >
                            <Typography variant="body2">{title}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                )}
              </>
            ) : (
              <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)", textAlign: "center" }}>
                <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
                  <SearchIcon sx={{ fontSize: 48, color: "primary.light" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Analyze Your Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                    Paste your content above and click "Analyze Content" to get SEO recommendations,
                    optimized meta tags, and keyword suggestions.
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<SearchIcon />}
            title="Keyword Optimization"
            description="Identify optimal keywords and improve content relevance for search engines with AI-powered analysis."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<AutoAwesomeIcon />}
            title="Meta Tag Generation"
            description="Generate optimized title tags and meta descriptions that improve click-through rates in search results."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<TrendingUpIcon />}
            title="SEO Score & Insights"
            description="Get an overall SEO score and actionable recommendations to improve your content's search visibility."
          />
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
      />
    </Stack>
  );
}

