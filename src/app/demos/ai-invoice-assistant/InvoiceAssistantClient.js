"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategoryIcon from "@mui/icons-material/Category";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GradientButton from "@/components/common/GradientButton";
import SectionHeader from "@/components/common/SectionHeader";
import InfoCard from "@/components/common/InfoCard";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function InvoiceAssistantClient() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: "",
    clientEmail: "",
    items: [{ description: "", quantity: 1, rate: 0 }],
    taxRate: 8,
    paymentTerms: "Net 30",
  });

  // Expense form state
  const [expenses, setExpenses] = useState("");

  const handleInvoiceItemChange = (index, field, value) => {
    const newItems = [...invoiceForm.items];
    newItems[index][field] = field === "quantity" || field === "rate" ? parseFloat(value) || 0 : value;
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const handleAddInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: "", quantity: 1, rate: 0 }],
    });
  };

  const handleRemoveInvoiceItem = (index) => {
    if (invoiceForm.items.length > 1) {
      const newItems = invoiceForm.items.filter((_, i) => i !== index);
      setInvoiceForm({ ...invoiceForm, items: newItems });
    }
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceForm.clientName.trim()) {
      setError("Client name is required.");
      return;
    }

    if (invoiceForm.items.some((item) => !item.description.trim())) {
      setError("All invoice items must have a description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/invoice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-invoice",
          invoiceData: invoiceForm,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to generate invoice.");
      }

      const { data } = await response.json();
      setResult({ type: "invoice", data });
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to generate invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorizeExpenses = async () => {
    if (!expenses.trim()) {
      setError("Please enter expenses to categorize.");
      return;
    }

    // Parse expenses from text (simple format: description - amount)
    const expenseLines = expenses
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split(" - ").map((p) => p.trim());
        return {
          description: parts[0] || line,
          amount: parseFloat(parts[1]) || 0,
          date: new Date().toISOString().split("T")[0],
        };
      });

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/invoice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "categorize-expenses",
          expenses: expenseLines,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to categorize expenses.");
      }

      const { data } = await response.json();
      setResult({ type: "expenses", data });
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to categorize expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/invoice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "financial-summary",
          month: "Current",
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Failed to generate summary.");
      }

      const { data } = await response.json();
      setResult({ type: "summary", data });
    } catch (err) {
      console.error(err);
      setError(err?.message ?? "Failed to generate summary.");
    } finally {
      setLoading(false);
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
        title="AI Invoice & Expense Assistant"
        subtitle="Generate professional invoices, automatically categorize expenses, and get financial insights tailored for small businesses and freelancers."
      />

      <Paper elevation={0} sx={{ border: "1px solid rgba(201,160,63,0.2)" }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: "1px solid rgba(201,160,63,0.1)" }}>
          <Tab label="Generate Invoice" />
          <Tab label="Categorize Expenses" />
          <Tab label="Financial Summary" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Invoice Details
                  </Typography>
                  <TextField
                    label="Client Name"
                    value={invoiceForm.clientName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Client Email (optional)"
                    type="email"
                    value={invoiceForm.clientEmail}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })}
                    fullWidth
                  />
                  <Divider />
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Invoice Items
                    </Typography>
                    {invoiceForm.items.map((item, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{ p: 2, border: "1px solid rgba(201,160,63,0.1)", borderRadius: 2 }}
                      >
                        <Stack spacing={2}>
                          <TextField
                            label="Description"
                            value={item.description}
                            onChange={(e) => handleInvoiceItemChange(index, "description", e.target.value)}
                            required
                            fullWidth
                            size="small"
                          />
                          <Stack direction="row" spacing={2}>
                            <TextField
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleInvoiceItemChange(index, "quantity", e.target.value)}
                              size="small"
                              sx={{ width: 100 }}
                            />
                            <TextField
                              label="Rate ($)"
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleInvoiceItemChange(index, "rate", e.target.value)}
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              label="Amount"
                              value={formatCurrency(item.quantity * item.rate)}
                              disabled
                              size="small"
                              sx={{ width: 120 }}
                            />
                            {invoiceForm.items.length > 1 && (
                              <Button
                                size="small"
                                onClick={() => handleRemoveInvoiceItem(index)}
                                sx={{ minWidth: 40 }}
                              >
                                ×
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                    <Button onClick={handleAddInvoiceItem} variant="outlined" size="small">
                      + Add Item
                    </Button>
                  </Stack>
                  <TextField
                    label="Tax Rate (%)"
                    type="number"
                    value={invoiceForm.taxRate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: parseFloat(e.target.value) || 0 })}
                    fullWidth
                  />
                  <TextField
                    label="Payment Terms"
                    value={invoiceForm.paymentTerms}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentTerms: e.target.value })}
                    fullWidth
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <GradientButton
                    startIcon={<PlayArrowIcon />}
                    onClick={handleGenerateInvoice}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Generating..." : "Generate Invoice"}
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
                ) : result?.type === "invoice" ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Invoice {result.data.invoiceNumber}
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
                          Due Date: {result.data.dueDate}
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
                      {result.data.notes && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {result.data.notes}
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
                        Generate an Invoice
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                        Fill in the invoice details and click "Generate Invoice" to create a professional invoice.
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
                    Enter Expenses
                  </Typography>
                  <TextField
                    label="Expenses (one per line)"
                    placeholder="Office supplies - 45.99&#10;Software subscription - 29.99&#10;Travel - 12.50"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    required
                    multiline
                    minRows={10}
                    helperText="Format: Description - Amount (one per line)"
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <GradientButton
                    startIcon={<PlayArrowIcon />}
                    onClick={handleCategorizeExpenses}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Categorizing..." : "Categorize Expenses"}
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
                ) : result?.type === "expenses" ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={3}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Categorized Expenses
                      </Typography>
                      <Divider />
                      <Stack spacing={3}>
                        {result.data.map((category, index) => (
                          <Box key={index}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {category.category}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {formatCurrency(category.total)}
                              </Typography>
                            </Stack>
                            <List dense>
                              {category.items.map((item, itemIndex) => (
                                <ListItem key={itemIndex} sx={{ px: 0 }}>
                                  <ListItemText
                                    primary={item.description}
                                    secondary={item.date}
                                    primaryTypographyProps={{ variant: "body2" }}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(item.amount)}
                                  </Typography>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)", textAlign: "center" }}>
                    <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
                      <CategoryIcon sx={{ fontSize: 48, color: "primary.light" }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Categorize Expenses
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                        Enter your expenses and let AI automatically categorize them for better financial tracking.
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Financial Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get insights into your business finances with AI-powered analysis and recommendations.
                  </Typography>
                  {error && <Alert severity="error">{error}</Alert>}
                  <GradientButton
                    startIcon={<PlayArrowIcon />}
                    onClick={handleGenerateSummary}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Generating..." : "Generate Summary"}
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
                ) : result?.type === "summary" ? (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)" }}>
                    <Stack spacing={3}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Financial Overview
                      </Typography>
                      <Divider />
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body1">Total Invoices</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(result.data.totalInvoices)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body1">Total Expenses</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(result.data.totalExpenses)}
                          </Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Net Income
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
                            {formatCurrency(result.data.netIncome)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Top Expense Categories
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {result.data.topCategories.map((cat, index) => (
                            <Chip key={index} label={cat} size="small" />
                          ))}
                        </Stack>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Insights
                        </Typography>
                        <List dense>
                          {result.data.insights.map((insight, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText
                                primary={insight}
                                primaryTypographyProps={{ variant: "body2" }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Stack>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 4, border: "1px solid rgba(201,160,63,0.2)", textAlign: "center" }}>
                    <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
                      <AssessmentIcon sx={{ fontSize: 48, color: "primary.light" }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Generate Financial Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
                        Click "Generate Summary" to get AI-powered financial insights and recommendations.
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
            icon={<ReceiptIcon />}
            title="Invoice Generation"
            description="Create professional invoices with itemized billing, automatic calculations, and customizable payment terms."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<CategoryIcon />}
            title="Expense Categorization"
            description="Automatically categorize business expenses into meaningful categories for better financial tracking."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoCard
            icon={<AssessmentIcon />}
            title="Financial Insights"
            description="Get AI-powered financial summaries with insights and recommendations tailored for small businesses."
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

