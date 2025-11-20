"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";
import { products } from "@/data/products";

const initialMessages = [
  {
    id: "intro",
    role: "assistant",
    content:
      "Hi! I’m your AI product guide. Tell me what you’re shopping for—budget, category, or any must-have features—and I’ll recommend a few picks from our catalog.",
  },
];

function ProductCard({ product, onMockAction }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2.5,
        display: "flex",
        gap: 2,
        border: "1px solid rgba(201,160,63,0.18)",
        background:
          "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        sx={{
          width: 96,
          height: 96,
          borderRadius: 2,
          objectFit: "cover",
          border: "1px solid rgba(201,160,63,0.2)",
        }}
      />
      <Stack spacing={1} flex={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip
            size="small"
            label={`$${product.price}`}
            sx={{
              backgroundColor: "rgba(201,160,63,0.12)",
              border: "1px solid rgba(201,160,63,0.25)",
            }}
          />
          {product.tags.slice(0, 2).map((tag) => (
            <Chip
              key={tag}
              size="small"
              label={tag}
              sx={{
                backgroundColor: "rgba(201,160,63,0.08)",
                border: "1px solid rgba(201,160,63,0.2)",
              }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              onMockAction?.(`Added ${product.name} to cart (demo action).`)
            }
            sx={{
              borderRadius: 999,
              fontWeight: 600,
              backgroundImage: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
              color: "#0A0A0A",
              px: 2,
            }}
          >
            Add to Cart
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              onMockAction?.(`Saved ${product.name} to wishlist (demo action).`)
            }
            sx={{
              borderRadius: 999,
              borderColor: "rgba(201,160,63,0.35)",
              color: "primary.light",
              px: 2,
            }}
          >
            Add to Wishlist
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function AssistantClient({ demo }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtersSummary, setFiltersSummary] = useState("all catalog items");
  const [toast, setToast] = useState({ open: false, message: "" });

  const sendMessage = async (override) => {
    const content = override ?? input.trim();
    if (!content) return;

    const nextMessages = [
      ...messages,
      { id: `user-${Date.now()}`, role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ecommerce-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get assistant response.");
      }

      const data = await response.json();

      setFiltersSummary(data.filters);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          products: data.recommendations,
          matchType: data.matchType,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I couldn’t reach our recommendation engine. Here are a few popular items you might like:",
          products: products.slice(0, 3),
          matchType: "alternative",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="E-Commerce AI Assistant"
        subtitle="Chat with a product specialist that understands budget, features, and intent. Recommendations are filtered from a mock catalog and narrated via OpenAI."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(201,160,63,0.2)",
              minHeight: 520,
              display: "flex",
              flexDirection: "column",
              background:
                "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(11,11,11,0.95) 100%)",
            }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
              {messages.map((message) => (
                <Stack
                  key={message.id}
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.role === "assistant"
                          ? "rgba(201,160,63,0.2)"
                          : "rgba(255,255,255,0.08)",
                      color:
                        message.role === "assistant"
                          ? "primary.light"
                          : "text.primary",
                    }}
                  >
                    {message.role === "assistant" ? (
                      <AutoAwesomeIcon fontSize="small" />
                    ) : (
                      "You"
                    )}
                  </Avatar>
                  <Stack spacing={1} flex={1}>
                    <Typography
                      variant="body1"
                      sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                    >
                      {message.content}
                    </Typography>
                    {message.products && (
                      <Stack spacing={2}>
                        {message.matchType === "alternative" && (
                          <Chip
                            label="Suggested alternatives"
                            size="small"
                            sx={{
                              alignSelf: "flex-start",
                              backgroundColor: "rgba(201,160,63,0.16)",
                              border: "1px solid rgba(201,160,63,0.25)",
                              color: "primary.light",
                              fontWeight: 600,
                              letterSpacing: "0.08em",
                            }}
                          />
                        )}
                        {message.products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onMockAction={(note) =>
                              setToast({ open: true, message: note })
                            }
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              ))}
              {loading && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={20} color="inherit" />
                  <Typography variant="body2" color="text.secondary">
                    Crafting recommendations...
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Box component="form" onSubmit={(event) => event.preventDefault()}>
              <TextField
                fullWidth
                placeholder="Ask for wireless headphones under $200..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                sx={{ mt: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Send">
                        <span>
                          <IconButton
                            color="primary"
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                          >
                            <SendIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
                background:
                  "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters in play
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filtersSummary}
                </Typography>
                <GradientButton
                  startIcon={<RefreshIcon />}
                  onClick={() => sendMessage("Can you suggest a few more options?")}
                  disabled={loading || messages.length <= 1}
                  variant="outlined"
                  sx={{
                    backgroundImage: "none",
                    borderColor: "rgba(201,160,63,0.35)",
                    color: "primary.light",
                    alignSelf: "flex-start",
                  }}
                >
                  Let AI refine results
                </GradientButton>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(201,160,63,0.2)",
                background:
                  "linear-gradient(180deg, rgba(201,160,63,0.12) 0%, rgba(15,15,15,0.95) 100%)",
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Why this matters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This shows how shoppers can describe their intent in natural language, get AI-curated
                  bundles, and push selections into carts or wishlists without leaving the flow.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Swap in your commerce APIs, integrate loyalty data, or trigger email follow-ups
                  automatically.
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ open: false, message: "" })}
        message={toast.message}
      />
    </Stack>
  );
}

