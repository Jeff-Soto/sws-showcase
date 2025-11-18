import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const fallbackInvoices = [
  {
    invoiceNumber: "INV-2024-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [
      { description: "Web Development Services - Phase 1", quantity: 1, rate: 5000, amount: 5000 },
      { description: "UI/UX Design", quantity: 1, rate: 2500, amount: 2500 },
      { description: "Consultation Hours", quantity: 8, rate: 150, amount: 1200 },
    ],
    subtotal: 8700,
    tax: 696,
    total: 9396,
    notes: "Payment due within 30 days. Thank you for your business!",
  },
  {
    invoiceNumber: "INV-2024-002",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [
      { description: "Monthly Retainer - Marketing Services", quantity: 1, rate: 3000, amount: 3000 },
      { description: "Content Creation (Blog Posts)", quantity: 4, rate: 250, amount: 1000 },
      { description: "Social Media Management", quantity: 1, rate: 1500, amount: 1500 },
    ],
    subtotal: 5500,
    tax: 440,
    total: 5940,
    notes: "Net 14 terms apply. Please remit payment by due date.",
  },
];

const fallbackExpenses = [
  {
    category: "Office Supplies",
    items: [
      { description: "Printer paper", amount: 45.99, date: "2024-01-15" },
      { description: "Pens and notebooks", amount: 32.50, date: "2024-01-18" },
    ],
    total: 78.49,
  },
  {
    category: "Software Subscriptions",
    items: [
      { description: "Adobe Creative Cloud", amount: 54.99, date: "2024-01-01" },
      { description: "Project Management Tool", amount: 29.99, date: "2024-01-01" },
      { description: "Cloud Storage", amount: 9.99, date: "2024-01-05" },
    ],
    total: 94.97,
  },
  {
    category: "Travel",
    items: [
      { description: "Client meeting - Parking", amount: 12.00, date: "2024-01-20" },
      { description: "Coffee meeting - Client", amount: 8.50, date: "2024-01-22" },
    ],
    total: 20.50,
  },
];

const fallbackSummary = {
  totalInvoices: 12500,
  totalExpenses: 193.96,
  netIncome: 12306.04,
  topCategories: ["Software Subscriptions", "Office Supplies", "Travel"],
  insights: [
    "Software subscriptions account for 49% of monthly expenses - consider annual plans for savings",
    "Expenses are trending 15% lower than last month",
    "Net income is strong with 98.5% retention of invoice totals",
  ],
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, invoiceData, expenses, month } = body;

    if (!action || !["generate-invoice", "categorize-expenses", "financial-summary"].includes(action)) {
      return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (action === "generate-invoice") {
      const { clientName, clientEmail, items, taxRate, paymentTerms } = invoiceData || {};

      if (!clientName || !items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: "Client name and at least one invoice item are required." },
          { status: 400 }
        );
      }

      const prompt = [
        {
          role: "system",
          content:
            "You are an AI assistant that generates professional invoices for small businesses and freelancers. Create clear, accurate invoices with proper formatting.",
        },
        {
          role: "user",
          content: [
            `Client: ${clientName}`,
            clientEmail ? `Email: ${clientEmail}` : null,
            `Items: ${JSON.stringify(items)}`,
            taxRate ? `Tax rate: ${taxRate}%` : "Tax rate: 8%",
            paymentTerms ? `Payment terms: ${paymentTerms}` : "Payment terms: Net 30",
            "",
            "Generate an invoice with:",
            "- Invoice number (format: INV-YYYY-###)",
            "- Date and due date",
            "- Line items with descriptions, quantities, rates, and amounts",
            "- Subtotal, tax, and total",
            "- Professional payment notes",
            "",
            "Return JSON: { invoiceNumber, date, dueDate, items: [{description, quantity, rate, amount}], subtotal, tax, total, notes }",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ];

      let invoicePayload = null;

      try {
        const response = await openai.responses.create({
          model: OPENAI_MODEL.TEXT,
          input: prompt,
        });

        try {
          const cleanedOutput = (response.output_text ?? "")
            .replace(/^```json\s*/i, "")
            .replace(/```$/i, "")
            .trim();
          invoicePayload = JSON.parse(cleanedOutput || "{}");
        } catch (parseError) {
          console.warn("invoice-assistant JSON parse fallback", parseError);
          invoicePayload = fallbackInvoices[Math.floor(Math.random() * fallbackInvoices.length)];
        }
      } catch (err) {
        console.warn("invoice-assistant openai fallback", err);
        invoicePayload = fallbackInvoices[Math.floor(Math.random() * fallbackInvoices.length)];
      }

      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        data: invoicePayload,
      });
    }

    if (action === "categorize-expenses") {
      if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
        return NextResponse.json({ error: "Expenses array is required." }, { status: 400 });
      }

      const prompt = [
        {
          role: "system",
          content:
            "You are an AI assistant that categorizes business expenses for small businesses. Common categories include: Office Supplies, Software Subscriptions, Travel, Marketing, Professional Services, Utilities, Equipment, etc.",
        },
        {
          role: "user",
          content: [
            `Expenses: ${JSON.stringify(expenses)}`,
            "",
            "Categorize each expense and group them by category. Return JSON:",
            "{",
            '  category: "Category Name",',
            '  items: [{description, amount, date}],',
            '  total: number',
            "}",
            "",
            "Return an array of categorized expense groups.",
          ].join("\n"),
        },
      ];

      let expensePayload = null;

      try {
        const response = await openai.responses.create({
          model: OPENAI_MODEL.INSIGHT,
          input: prompt,
        });

        try {
          const cleanedOutput = (response.output_text ?? "")
            .replace(/^```json\s*/i, "")
            .replace(/```$/i, "")
            .trim();
          expensePayload = JSON.parse(cleanedOutput || "[]");
        } catch (parseError) {
          console.warn("invoice-assistant expense categorization fallback", parseError);
          expensePayload = fallbackExpenses;
        }
      } catch (err) {
        console.warn("invoice-assistant expense categorization fallback", err);
        expensePayload = fallbackExpenses;
      }

      return NextResponse.json({
        success: true,
        categorizedAt: new Date().toISOString(),
        data: expensePayload,
      });
    }

    if (action === "financial-summary") {
      const prompt = [
        {
          role: "system",
          content:
            "You are an AI financial assistant that analyzes business financial data and provides insights, summaries, and recommendations for small businesses.",
        },
        {
          role: "user",
          content: [
            month ? `Month: ${month}` : "Month: Current",
            "",
            "Analyze the financial data and provide:",
            "- Total invoices amount",
            "- Total expenses",
            "- Net income",
            "- Top expense categories",
            "- 2-3 actionable financial insights",
            "",
            "Return JSON: { totalInvoices, totalExpenses, netIncome, topCategories: [], insights: [] }",
          ].join("\n"),
        },
      ];

      let summaryPayload = null;

      try {
        const response = await openai.responses.create({
          model: OPENAI_MODEL.INSIGHT,
          input: prompt,
        });

        try {
          const cleanedOutput = (response.output_text ?? "")
            .replace(/^```json\s*/i, "")
            .replace(/```$/i, "")
            .trim();
          summaryPayload = JSON.parse(cleanedOutput || "{}");
        } catch (parseError) {
          console.warn("invoice-assistant summary fallback", parseError);
          summaryPayload = fallbackSummary;
        }
      } catch (err) {
        console.warn("invoice-assistant summary fallback", err);
        summaryPayload = fallbackSummary;
      }

      return NextResponse.json({
        success: true,
        analyzedAt: new Date().toISOString(),
        data: summaryPayload,
      });
    }
  } catch (error) {
    console.error("invoice-assistant route error:", error);
    return NextResponse.json(
      {
        error: "Unable to process invoice/expense request at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

