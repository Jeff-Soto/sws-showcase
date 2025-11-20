"use client";

import { useCallback, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";
import { contentTypes, toneOptions } from "@/data/aiContentGenerator";

const initialForm = {
  contentType: "blog",
  tone: "Professional",
  topic: "",
  audience: "",
};

export default function ContentGeneratorClient({ demo }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "" });

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const selectedType = useMemo(
    () => contentTypes.find((type) => type.value === form.contentType),
    [form.contentType]
  );

  const performGeneration = useCallback(
    async (overrideValues) => {
      const payload = { ...form, ...(overrideValues ?? {}) };

      if (!payload.topic.trim()) {
        setError("Topic is required to generate content.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const response = await fetch("/api/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          throw new Error(detail.error || "Failed to generate content.");
        }

        const { data, generatedAt } = await response.json();
        const entry = {
          id: `${Date.now()}`,
          ...data,
          generatedAt,
        };

        setResult(entry);
        setHistory((prev) => [entry, ...prev].slice(0, 10));
      } catch (err) {
        console.error(err);
        setError(err?.message ?? "Failed to generate content.");
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    await performGeneration();
  };

  const handleRegenerate = async () => {
    if (!result) return;
    await performGeneration({
      contentType: result.type,
      tone: result.tone,
      topic: form.topic,
      audience: form.audience,
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.content);
      setToast({ open: true, message: "Content copied to clipboard." });
    } catch (err) {
      setToast({ open: true, message: "Unable to copy. Please copy manually." });
    }
  };

  const renderContentSections = (text) => {
    if (!text) return null;

    const sections = text.split(/\n\s*\n/);

    return sections
      .map((section, sectionIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        const bulletMatch = trimmed.match(/^- |\d+\. /);
        const lines = trimmed.split("\n");

        if (trimmed.startsWith("#")) {
          const level = (trimmed.match(/^#+/)?.[0].length ?? 1);
          const heading = trimmed.replace(/^#+\s*/, "");
          const variant =
            level === 1
              ? "h4"
              : level === 2
              ? "h5"
              : level === 3
              ? "h6"
              : "subtitle1";
          return (
            <Typography key={`heading-${sectionIdx}`} variant={variant} sx={{ fontWeight: 600 }}>
              {heading}
            </Typography>
          );
        }

        if (bulletMatch) {
          const items = lines
            .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim())
            .filter(Boolean);
          return (
            <Box
              key={`list-${sectionIdx}`}
              component="ul"
              sx={{
                pl: 3,
                m: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {items.map((item, itemIdx) => (
                <Box key={itemIdx} component="li">
                  {item}
                </Box>
              ))}
            </Box>
          );
        }

        return (
          <Typography key={`paragraph-${sectionIdx}`} variant="body1" sx={{ lineHeight: 1.75 }}>
            {trimmed}
          </Typography>
        );
      })
      .filter(Boolean);
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI Content Generator"
        subtitle="Select a content format, choose the tone, and describe your campaign. The AI will produce on-brand copy you can refine, save, and ship."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            component="form"
            elevation={0}
            onSubmit={handleSubmit}
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
                Generation Settings
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="content-type-label">Content type</InputLabel>
                <Select
                  labelId="content-type-label"
                  value={form.contentType}
                  label="Content type"
                  onChange={handleFormChange("contentType")}
                >
                  {contentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="tone-label">Tone / Style</InputLabel>
                <Select
                  labelId="tone-label"
                  value={form.tone}
                  label="Tone / Style"
                  onChange={handleFormChange("tone")}
                >
                  {toneOptions.map((tone) => (
                    <MenuItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Topic or campaign focus"
                placeholder="e.g. Launching our AI-powered analytics suite for SaaS founders"
                value={form.topic}
                onChange={handleFormChange("topic")}
                required
                multiline
                minRows={2}
              />
              <TextField
                label="Target audience (optional)"
                placeholder="e.g. Growth marketing teams at Series A SaaS startups"
                value={form.audience}
                onChange={handleFormChange("audience")}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selectedType?.promptHint}
                </Typography>
              </Box>
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" spacing={2}>
                <GradientButton
                  type="submit"
                  startIcon={<PlayArrowIcon />}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate content"}
                </GradientButton>
                <GradientButton
                  type="button"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerate}
                  disabled={loading || !result}
                  variant="outlined"
                  sx={{
                    backgroundImage: "none",
                    borderColor: "rgba(201,160,63,0.35)",
                    color: "primary.light",
                  }}
                >
                  Regenerate
                </GradientButton>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid rgba(201,160,63,0.2)",
                minHeight: 360,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Output
                  </Typography>
                  <Tooltip title="Copy to clipboard">
                    <span>
                      <IconButton
                        color="primary"
                        onClick={handleCopy}
                        disabled={!result || loading}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                <Divider sx={{ borderColor: "rgba(201,160,63,0.2)" }} />
                {loading && !result ? (
                  <Stack spacing={2}>
                    <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
                    <Skeleton variant="rectangular" height={140} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </Stack>
                ) : result ? (
                  <Stack spacing={2}>
                    <Stack spacing={0.5}>
                      <Typography variant="overline" sx={{ letterSpacing: "0.12em" }}>
                        {result.type.toUpperCase()} · {result.tone}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {result.title}
                      </Typography>
                    </Stack>
                    {result.summary && (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {result.summary}
                      </Typography>
                    )}
                    <Divider flexItem sx={{ borderColor: "rgba(201,160,63,0.15)" }} />
                    <Stack spacing={2}>
                      {renderContentSections(result.content || result.raw || "")}
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ py: 6 }}>
                    <HistoryIcon sx={{ fontSize: 40, color: "primary.light" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Generate your first draft
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                      Choose the format, tone, and audience to create tailored marketing copy you
                      can ship or iterate on with your team.
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid rgba(201,160,63,0.15)",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Generations
                  </Typography>
                </Stack>
                <Divider sx={{ borderColor: "rgba(201,160,63,0.1)" }} />
                {history.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Your generated drafts will appear here. Pin your favorite concepts or copy them
                    into your CMS.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {history.map((entry) => (
                      <Box
                        key={entry.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(201,160,63,0.15)",
                          backgroundColor: "rgba(201,160,63,0.05)",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {entry.title}
                        </Typography>
                        <Typography variant="caption" sx={{ letterSpacing: "0.12em" }}>
                          {entry.type.toUpperCase()} · {entry.tone}
                        </Typography>
                        <Box
                          component="pre"
                          sx={{
                            mt: 1,
                            p: 1.5,
                            borderRadius: 1,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: 12,
                            maxHeight: 160,
                            overflow: "auto",
                          }}
                        >
                          {entry.raw ??
                            JSON.stringify(
                              {
                                title: entry.title,
                                summary: entry.summary,
                                content: entry.content,
                              },
                              null,
                              2
                            )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Stack>
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

