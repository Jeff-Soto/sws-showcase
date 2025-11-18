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
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";

const meetingTypes = [
  { value: "team-meeting", label: "Team Meeting" },
  { value: "client-meeting", label: "Client Meeting" },
  { value: "planning", label: "Planning Session" },
  { value: "review", label: "Review/Retrospective" },
  { value: "other", label: "Other" },
];

export default function MeetingAssistantClient() {
  const [transcript, setTranscript] = useState("");
  const [meetingType, setMeetingType] = useState("team-meeting");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  const handleProcess = async () => {
    if (!transcript.trim()) {
      setError("Please enter a meeting transcript.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/meeting-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingType, notes }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to process meeting transcript.");
      }

      const { data } = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to process meeting transcript.");
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

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI Meeting Assistant"
        subtitle="Paste your meeting transcript and get instant summaries, action items, key decisions, and follow-up tasks extracted by AI."
      />

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
                Meeting Details
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="meeting-type-label">Meeting Type</InputLabel>
                <Select
                  labelId="meeting-type-label"
                  value={meetingType}
                  label="Meeting Type"
                  onChange={(e) => setMeetingType(e.target.value)}
                >
                  {meetingTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Meeting Transcript"
                placeholder="Paste your meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                required
                multiline
                minRows={12}
                sx={{ fontFamily: "monospace", fontSize: 13 }}
              />
              <TextField
                label="Additional Notes (optional)"
                placeholder="Any additional context or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                minRows={2}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <GradientButton
                startIcon={<PlayArrowIcon />}
                onClick={handleProcess}
                disabled={loading}
                fullWidth
              >
                {loading ? "Processing..." : "Process Meeting"}
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
                        Summary
                      </Typography>
                      <IconButton size="small" onClick={() => handleCopy(result.summary)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Divider />
                    <Typography variant="body1" sx={{ lineHeight: 1.75 }}>
                      {result.summary}
                    </Typography>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AssignmentIcon sx={{ color: "primary.light" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Action Items
                      </Typography>
                    </Stack>
                    <Divider />
                    <List>
                      {result.actionItems.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { display: "flex", alignItems: "center", gap: 1 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CheckCircleIcon sx={{ color: "primary.light" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Key Decisions
                      </Typography>
                    </Stack>
                    <Divider />
                    <List>
                      {result.keyDecisions.map((decision, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={decision}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <GroupIcon sx={{ color: "primary.light" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Participants
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {result.participants.map((participant, index) => (
                        <Chip key={index} label={participant} size="small" />
                      ))}
                    </Stack>
                  </Stack>
                </Paper>

                {result.followUps && result.followUps.length > 0 && (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Follow-Up Tasks
                      </Typography>
                      <Divider />
                      <Stack spacing={2}>
                        {result.followUps.map((followUp, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid rgba(201,160,63,0.15)",
                              backgroundColor: "rgba(201,160,63,0.05)",
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {followUp.task}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Owner: {followUp.assignee} · Due: {followUp.dueDate}
                            </Typography>
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
                  <AssignmentIcon sx={{ fontSize: 48, color: "primary.light" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Process a Meeting Transcript
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                    Paste your meeting transcript above and click "Process Meeting" to extract action
                    items, summaries, and follow-up tasks.
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
            icon={<AssignmentIcon />}
            title="Action Items"
            description="Automatically extract and organize action items with owners and due dates from your meeting transcripts."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<CheckCircleIcon />}
            title="Key Decisions"
            description="Identify and document important decisions made during meetings for better tracking and accountability."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<GroupIcon />}
            title="Participant Tracking"
            description="Automatically identify all meeting participants and their roles for comprehensive meeting records."
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

