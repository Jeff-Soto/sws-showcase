"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import Icon from "@mui/material/Icon";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";

const bytesToKb = (size) => `${(size / 1024).toFixed(1)} KB`;

export default function DocumentAnalysisClient({ demo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Please upload a PDF or Word document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setAnalysis(null);
    setChatMessages([]);
    setChatInput("");
    setChatError("");
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Upload a document to analyze.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("notes", notes);

      const response = await fetch("/api/document-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Unable to analyze document.");
      }

      const result = await response.json();
      setAnalysis(result);
      setChatMessages([
        {
          id: `analysis-${Date.now()}`,
          role: "assistant",
          content:
            "I’ve reviewed the document. Ask me follow-up questions about the summary, key points, or recommendations.",
        },
      ]);
      setChatInput("");
      setChatError("");
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Unable to analyze document.");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!analysis) return;
    if (!chatInput.trim()) {
      setChatError("Ask a specific question about the document.");
      return;
    }
    setChatError("");
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);
    try {
      const response = await fetch("/api/document-analysis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          analysis: analysis.analysis,
          fileMeta: analysis.file,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Unable to answer question.");
      }
      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "I ran into an issue answering that. Try rephrasing your question or ask something else about the document.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="Document Analysis"
        subtitle="Upload a PDF or Word document to get AI-powered summaries, key takeaways, and next-step recommendations."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
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
                Upload document
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  borderStyle: "dashed",
                  borderColor: "rgba(201,160,63,0.35)",
                  backgroundColor: "rgba(201,160,63,0.05)",
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <UploadFileIcon sx={{ fontSize: 40, color: "primary.light" }} />
                  <Typography variant="body1">
                    Drag & drop your resume or proposal here, or click to browse.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accepted: PDF, DOCX · Max size 5MB
                  </Typography>
                  <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                    Choose file
                    <input hidden type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  </Button>
                </Stack>
              </Paper>

              {selectedFile && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid rgba(201,160,63,0.2)",
                    backgroundColor: "rgba(201,160,63,0.06)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={selectedFile.type.includes("pdf") ? "PDF" : "DOC"}
                      sx={{ backgroundColor: "rgba(201,160,63,0.2)", color: "primary.light" }}
                    />
                    <Stack spacing={0.5} flex={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bytesToKb(selectedFile.size)}
                      </Typography>
                    </Stack>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        setSelectedFile(null);
                        setAnalysis(null);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              )}

              {analysis && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid rgba(201,160,63,0.2)",
                    backgroundColor: "rgba(201,160,63,0.05)",
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Analysis Q&A
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ask follow-up questions about the summary or specific sections you care about.
                    </Typography>
                    <Stack
                      spacing={2}
                      sx={{
                        maxHeight: 220,
                        overflowY: "auto",
                        pr: 1,
                        borderRadius: 2,
                        border: "1px solid rgba(201,160,63,0.15)",
                        backgroundColor: "rgba(201,160,63,0.04)",
                        p: 2,
                      }}
                    >
                      {chatMessages.map((msg) => (
                        <Stack
                          key={msg.id}
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                          sx={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "90%",
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 26,
                              minHeight: 26,
                              borderRadius: "50%",
                              backgroundColor:
                                msg.role === "user"
                                  ? "rgba(201,160,63,0.25)"
                                  : "rgba(201,160,63,0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: msg.role === "user" ? "#0A0A0A" : "primary.light",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {msg.role === "user" ? "You" : "AI"}
                          </Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              border: "1px solid rgba(201,160,63,0.2)",
                              backgroundColor:
                                msg.role === "user" ? "rgba(201,160,63,0.12)" : "rgba(0,0,0,0.45)",
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                              {msg.content}
                            </Typography>
                          </Paper>
                        </Stack>
                      ))}
                    </Stack>
                    <TextField
                      label="Ask a question"
                      placeholder="e.g. What strengths does this candidate highlight?"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      multiline
                      minRows={2}
                      disabled={chatLoading}
                    />
                    {chatError && <Alert severity="error">{chatError}</Alert>}
                    <GradientButton
                      onClick={handleAsk}
                      disabled={chatLoading}
                      startIcon={chatLoading ? <CircularProgress size={16} /> : null}
                    >
                      {chatLoading ? "Thinking..." : "Ask follow-up question"}
                    </GradientButton>
                  </Stack>
                </Paper>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              {!analysis && (
                <GradientButton
                  onClick={handleAnalyze}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                  {loading ? "Analyzing..." : "Analyze document"}
                </GradientButton>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
                minHeight: 420,
              }}
            >
              {analysis ? (
                <Stack spacing={3}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" sx={{ letterSpacing: "0.12em" }}>
                      ANALYSIS SUMMARY
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {analysis.file?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bytesToKb(analysis.file?.size ?? 0)} · {analysis.file?.type}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {analysis.analysis.summary}
                  </Typography>
                  <Divider sx={{ borderColor: "rgba(201,160,63,0.15)" }} />
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Key Points
                      </Typography>
                      <Stack spacing={1.5}>
                        {analysis.analysis.keyPoints.map((point, index) => (
                          <Typography
                            key={`${point}-${index}`}
                            variant="body2"
                            sx={{ lineHeight: 1.6 }}
                          >
                            • {point}
                          </Typography>
                        ))}
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Recommendations
                      </Typography>
                      <Stack spacing={1.5}>
                        {analysis.analysis.recommendations.map((point, index) => (
                          <Typography
                            key={`${point}-${index}`}
                            variant="body2"
                            sx={{ lineHeight: 1.6 }}
                          >
                            • {point}
                          </Typography>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                  <UploadFileIcon sx={{ fontSize: 40, color: "primary.light" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Upload a document to see insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    The AI analysis will extract a summary, highlight standout sections, and surface
                    actionable recommendations tailored to your context.
                  </Typography>
                </Stack>
              )}
            </Paper>

            <InfoCard
              title="Production integration"
              description="In production, connect this flow to your storage provider, run OCR for scanned PDFs, and push structured insights into ATS or CRM systems."
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

