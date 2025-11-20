"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";
import BusinessValuePanel from "@/components/common/BusinessValuePanel";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const projectTypes = [
  { value: "web-development", label: "Web Development" },
  { value: "design", label: "Design Services" },
  { value: "marketing", label: "Marketing Services" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export default function ProposalGeneratorClient({ demo }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    clientName: "",
    projectType: "web-development",
    objectives: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    clientName: "",
    services: [{ description: "", quantity: 1, rate: 0 }],
    discount: 0,
    notes: "",
  });

  const handleProposalItemChange = (index, field, value) => {
    const newServices = [...quoteForm.services];
    newServices[index][field] = field === "quantity" || field === "rate" ? parseFloat(value) || 0 : value;
    setQuoteForm({ ...quoteForm, services: newServices });
  };

  const handleAddService = () => {
    setQuoteForm({
      ...quoteForm,
      services: [...quoteForm.services, { description: "", quantity: 1, rate: 0 }],
    });
  };

  const handleRemoveService = (index) => {
    if (quoteForm.services.length > 1) {
      const newServices = quoteForm.services.filter((_, i) => i !== index);
      setQuoteForm({ ...quoteForm, services: newServices });
    }
  };

  const handleGenerateProposal = async () => {
    if (!proposalForm.clientName.trim()) {
      setError("Client name is required.");
      return;
    }

    if (!proposalForm.projectType) {
      setError("Project type is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/proposal-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-proposal",
          proposalData: proposalForm,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to generate proposal.");
      }

      const { data } = await response.json();
      setResult({ type: "proposal", data });
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to generate proposal.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    if (!quoteForm.clientName.trim()) {
      setError("Client name is required.");
      return;
    }

    if (quoteForm.services.some((service) => !service.description.trim())) {
      setError("All services must have a description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/proposal-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-quote",
          quoteData: quoteForm,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to generate quote.");
      }

      const { data } = await response.json();
      setResult({ type: "quote", data });
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to generate quote.");
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Stack spacing={6}>
      <SectionHeader
        eyebrow="Demo"
        title="AI Proposal Generator"
        subtitle="Create winning client proposals and accurate quotes with AI assistance. Generate professional business documents tailored to your clients' needs."
      />

      {demo && <BusinessValuePanel demo={demo} />}

      <Paper elevation={0} sx={{ border: "1px solid rgba(201,160,63,0.2)" }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: "1px solid rgba(201,160,63,0.1)" }}>
          <Tab label="Generate Proposal" />
          <Tab label="Generate Quote" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Proposal Details
                  </Typography>
                  <TextField
                    label="Client Name"
                    value={proposalForm.clientName}
                    onChange={(e) => setProposalForm({ ...proposalForm, clientName: e.target.value })}
                    required
                    fullWidth
                  />
                  <FormControl fullWidth required>
                    <InputLabel id="project-type-label">Project Type</InputLabel>
                    <Select
                      labelId="project-type-label"
                      value={proposalForm.projectType}
                      label="Project Type"
                      onChange={(e) => setProposalForm({ ...proposalForm, projectType: e.target.value })}
                    >
                      {projectTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Project Objectives (optional)"
                    placeholder="e.g. Increase online sales by 30%, improve brand awareness"
                    value={proposalForm.objectives}
                    onChange={(e) => setProposalForm({ ...proposalForm, objectives: e.target.value })}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                  <TextField
                    label="Budget Range (optional)"
                    placeholder="e.g. $10,000 - $15,000"
                    value={proposalForm.budget}
                    onChange={(e) => setProposalForm({ ...proposalForm, budget: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Timeline (optional)"
                    placeholder="e.g. 8-10 weeks, Q2 2024"
                    value={proposalForm.timeline}
                    onChange={(e) => setProposalForm({ ...proposalForm, timeline: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Key Requirements (optional)"
                    placeholder="e.g. Mobile-responsive, SEO optimization, CMS integration"
                    value={proposalForm.requirements}
                    onChange={(e) => setProposalForm({ ...proposalForm, requirements: e.target.value })}
                    multiline
                    minRows={3}
                    fullWidth
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <GradientButton
                    startIcon={<PlayArrowIcon />}
                    onClick={handleGenerateProposal}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Generating..." : "Generate Proposal"}
                  </GradientButton>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {loading && !result ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={2}>
                      <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
                      <Skeleton variant="rectangular" height={100} />
                    </Stack>
                  </Paper>
                ) : result?.type === "proposal" ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {result.data.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(JSON.stringify(result.data, null, 2))}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Executive Summary
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.75 }}>
                          {result.data.executiveSummary}
                        </Typography>
                      </Box>
                      <Divider />
                      <Stack spacing={3}>
                        {result.data.sections.map((section, index) => (
                          <Box key={index}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {section.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ whiteSpace: "pre-line", lineHeight: 1.75 }}
                              color="text.secondary"
                            >
                              {section.content}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                      {result.data.pricing && (
                        <>
                          <Divider />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                              Investment
                            </Typography>
                            <Table>
                              <TableBody>
                                {result.data.pricing.lineItems.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.item}</TableCell>
                                    <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(result.data.pricing.total)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              {result.data.pricing.paymentTerms}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)", textAlign: "center" }}>
                    <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
                      <DescriptionIcon sx={{ fontSize: 48, color: "primary.light" }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Generate a Proposal
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                        Fill in the proposal details and click "Generate Proposal" to create a professional business
                        proposal.
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quote Details
                  </Typography>
                  <TextField
                    label="Client Name"
                    value={quoteForm.clientName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                    required
                    fullWidth
                  />
                  <Divider />
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Services
                    </Typography>
                    {quoteForm.services.map((service, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{ p: 2, border: "1px solid rgba(201,160,63,0.1)", borderRadius: 2 }}
                      >
                        <Stack spacing={2}>
                          <TextField
                            label="Description"
                            value={service.description}
                            onChange={(e) =>
                              handleProposalItemChange(index, "description", e.target.value)
                            }
                            required
                            fullWidth
                            size="small"
                          />
                          <Stack direction="row" spacing={2}>
                            <TextField
                              label="Quantity"
                              type="number"
                              value={service.quantity}
                              onChange={(e) => handleProposalItemChange(index, "quantity", e.target.value)}
                              size="small"
                              sx={{ width: 100 }}
                            />
                            <TextField
                              label="Rate ($)"
                              type="number"
                              value={service.rate}
                              onChange={(e) => handleProposalItemChange(index, "rate", e.target.value)}
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              label="Amount"
                              value={formatCurrency(service.quantity * service.rate)}
                              disabled
                              size="small"
                              sx={{ width: 120 }}
                            />
                            {quoteForm.services.length > 1 && (
                              <Button size="small" onClick={() => handleRemoveService(index)} sx={{ minWidth: 40 }}>
                                ×
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                    <Button onClick={handleAddService} variant="outlined" size="small">
                      + Add Service
                    </Button>
                  </Stack>
                  <TextField
                    label="Discount (%)"
                    type="number"
                    value={quoteForm.discount}
                    onChange={(e) => setQuoteForm({ ...quoteForm, discount: parseFloat(e.target.value) || 0 })}
                    fullWidth
                  />
                  <TextField
                    label="Additional Notes (optional)"
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <GradientButton startIcon={<PlayArrowIcon />} onClick={handleGenerateQuote} disabled={loading} fullWidth>
                    {loading ? "Generating..." : "Generate Quote"}
                  </GradientButton>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {loading && !result ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={2}>
                      <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
                      <Skeleton variant="rectangular" height={100} />
                    </Stack>
                  </Paper>
                ) : result?.type === "quote" ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Quote {result.data.quoteNumber}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(JSON.stringify(result.data, null, 2))}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Divider />
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Date: {result.data.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Valid Until: {result.data.expirationDate}
                        </Typography>
                      </Stack>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Rate</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.data.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">{formatCurrency(item.rate)}</TableCell>
                              <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                              Subtotal
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(result.data.subtotal)}
                            </TableCell>
                          </TableRow>
                          {result.data.discount > 0 && (
                            <TableRow>
                              <TableCell colSpan={3}>Discount</TableCell>
                              <TableCell align="right">-{formatCurrency(result.data.discount)}</TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell colSpan={3}>Tax</TableCell>
                            <TableCell align="right">{formatCurrency(result.data.tax)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                              Total
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(result.data.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      {result.data.terms && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {result.data.terms}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)", textAlign: "center" }}>
                    <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: "primary.light" }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Generate a Quote
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                        Fill in the quote details and click "Generate Quote" to create a professional quote document.
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<DescriptionIcon />}
            title="Proposal Generation"
            description="Create comprehensive business proposals with executive summaries, scope, timeline, and investment breakdowns."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<ReceiptIcon />}
            title="Quote Creation"
            description="Generate accurate, itemized quotes with pricing, discounts, and professional terms for client approval."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<AttachMoneyIcon />}
            title="Pricing Intelligence"
            description="Get AI-powered pricing suggestions and professional payment terms tailored to your business type."
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

