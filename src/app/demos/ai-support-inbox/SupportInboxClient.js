"use client";

import { useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import { tickets } from "@/data/support";

const priorityColors = {
  High: "error",
  Medium: "warning",
  Low: "default",
  Waiting: "default",
};

function TicketListItem({ ticket, selected, onClick }) {
  return (
    <ListItem disablePadding onClick={onClick}>
      <ListItemButton
        selected={selected}
        sx={{
          borderRadius: 3,
          mb: 1,
          alignItems: "flex-start",
          backgroundColor: selected ? "rgba(201,160,63,0.12)" : "transparent",
          border: selected ? "1px solid rgba(201,160,63,0.25)" : "1px solid transparent",
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "rgba(201,160,63,0.2)", color: "primary.light" }}>
            {ticket.customer[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {ticket.subject}
              </Typography>
              <Chip
                label={ticket.priority}
                size="small"
                color={priorityColors[ticket.priority] ?? "default"}
                sx={{ ml: 2 }}
              />
            </Stack>
          }
          secondary={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {ticket.customer}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function SupportInboxClient() {
  const [ticketData, setTicketData] = useState(tickets);
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0].id);
  const [draftReply, setDraftReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "" });
  const conversationRef = useRef(null);

  const selectedTicket = useMemo(
    () => ticketData.find((ticket) => ticket.id === selectedTicketId),
    [ticketData, selectedTicketId]
  );

  const handleGenerateReply = async () => {
    if (!selectedTicket) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/support-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          kbId: null,
          agentNotes: "",
          history: [],
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Unable to generate reply.");
      }

      const data = await response.json();
      setDraftReply(data.reply);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Unable to generate reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!draftReply) {
      setError("Draft reply is empty.");
      return;
    }

    const timestamp = new Date().toISOString();
    setTicketData((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicketId
          ? {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  author: "agent",
                  timestamp,
                  content: draftReply,
                },
              ],
            }
          : ticket
      )
    );
    setDraftReply("");
    setToast({ open: true, message: "Reply added to the thread." });
    requestAnimationFrame(() => {
      conversationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI Support Inbox"
        subtitle="Manage incoming tickets, view conversation history, and let AI draft empathetic replies enriched with knowledge base snippets."
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(201,160,63,0.2)",
              maxHeight: 540,
              overflowY: "auto",
              ml: { xs: 0, md: 1 },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Tickets
            </Typography>
            <List disablePadding>
              {ticketData.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  selected={ticket.id === selectedTicketId}
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setDraftReply("");
                  }}
                />
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
              }}
              ref={conversationRef}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedTicket?.subject}
                  </Typography>
                  <Chip label={selectedTicket?.priority} color={priorityColors[selectedTicket?.priority] ?? "default"} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {selectedTicket?.customer}
                </Typography>
              </Stack>
              <Divider sx={{ my: 3, borderColor: "rgba(201,160,63,0.15)" }} />
              <Stack spacing={3}>
                {selectedTicket?.messages.map((message, index) => (
                  <Stack
                    key={`${message.timestamp}-${index}`}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          message.author === "customer"
                            ? "rgba(201,160,63,0.18)"
                            : "rgba(255,255,255,0.08)",
                        color:
                          message.author === "customer" ? "primary.light" : "text.secondary",
                      }}
                    >
                      {message.author === "customer" ? "C" : "A"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {message.author === "customer" ? "Customer" : "Agent"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                        {message.content}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Reply composer
                </Typography>
                <TextField
                  label="AI-drafted reply"
                  multiline
                  minRows={6}
                  value={draftReply}
                  onChange={(event) => setDraftReply(event.target.value)}
                  placeholder="Generate a reply or start typing..."
                  autoFocus
                  InputLabelProps={{
                    sx: {
                      color: "primary.light",
                    },
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "18px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(201,160,63,0.55)",
                        borderRadius: "18px",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(201,160,63,0.85)",
                        boxShadow: `0 0 0 2px rgba(201,160,63,0.25)`,
                        borderRadius: "18px",
                      },
                    },
                  }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <GradientButton
                    onClick={handleGenerateReply}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                  >
                    {loading ? "Generating..." : "Generate AI reply"}
                  </GradientButton>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<SendIcon />}
                    onClick={handleSend}
                    sx={{ borderRadius: 2 }}
                  >
                    Send reply
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <InfoCard
              title="Workflow integration"
              description="Connect to Zendesk or Intercom via webhooks, auto-log AI drafts for agent review, and capture acceptance metrics to train future responses."
            />
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            background:
              "linear-gradient(135deg, rgba(201,160,63,0.3) 0%, rgba(20,20,20,0.95) 100%)",
            border: "1px solid rgba(201,160,63,0.35)",
            color: "#FFFFFF",
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 18px 50px rgba(201,160,63,0.15)",
            fontWeight: 500,
          },
        }}
      />
    </Stack>
  );
}

