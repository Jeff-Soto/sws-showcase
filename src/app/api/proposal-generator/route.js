import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const fallbackProposals = [
  {
    title: "Web Development & Design Services Proposal",
    executiveSummary:
      "This proposal outlines a comprehensive web development and design solution tailored to elevate your online presence. We will deliver a modern, responsive website that drives engagement and conversions.",
    sections: [
      {
        title: "Project Overview",
        content:
          "Our team will design and develop a custom website solution that reflects your brand identity and meets your business objectives. This includes responsive design, SEO optimization, and content management capabilities.",
      },
      {
        title: "Scope of Work",
        content:
          "- Custom website design (5 pages)\n- Mobile-responsive development\n- SEO setup and optimization\n- Content management system integration\n- Training and documentation\n- 3 months of support included",
      },
      {
        title: "Timeline",
        content:
          "Project duration: 8-10 weeks\n- Week 1-2: Discovery & Planning\n- Week 3-4: Design & Approval\n- Week 5-8: Development\n- Week 9-10: Testing & Launch",
      },
      {
        title: "Investment",
        content:
          "Total project investment: $12,500\n- 50% due upon project start\n- 50% due upon project completion\n\nAll deliverables are guaranteed to meet agreed-upon specifications.",
      },
    ],
    pricing: {
      basePrice: 12500,
      lineItems: [
        { item: "Custom Design & Development", amount: 8500 },
        { item: "SEO Setup & Optimization", amount: 1500 },
        { item: "CMS Integration", amount: 1500 },
        { item: "Training & Documentation", amount: 1000 },
      ],
      total: 12500,
      paymentTerms: "50% upfront, 50% upon completion",
    },
  },
  {
    title: "Marketing Services Proposal",
    executiveSummary:
      "A comprehensive digital marketing strategy designed to increase brand awareness, drive qualified leads, and accelerate business growth through proven marketing channels and tactics.",
    sections: [
      {
        title: "Marketing Strategy",
        content:
          "We will develop and execute a multi-channel marketing strategy focused on content marketing, social media engagement, and email marketing to build your brand and drive conversions.",
      },
      {
        title: "Services Included",
        content:
          "- Content creation (8 blog posts/month)\n- Social media management (3 platforms)\n- Email marketing campaigns (monthly)\n- SEO optimization\n- Monthly performance reports\n- Strategy consultation",
      },
      {
        title: "Timeline",
        content:
          "Engagement: 6-month minimum\n- Month 1: Strategy development & setup\n- Month 2-6: Ongoing execution & optimization\n- Monthly reporting and strategy reviews",
      },
      {
        title: "Investment",
        content:
          "Monthly retainer: $3,500/month\n- 6-month commitment: $21,000 total\n- Setup fee (one-time): $1,500\n\nCancel anytime after 6 months with 30-day notice.",
      },
    ],
    pricing: {
      basePrice: 3500,
      lineItems: [
        { item: "Content Creation (8 posts/month)", amount: 1200 },
        { item: "Social Media Management", amount: 1500 },
        { item: "Email Marketing", amount: 500 },
        { item: "SEO & Analytics", amount: 300 },
      ],
      total: 3500,
      paymentTerms: "Monthly retainer, paid in advance",
    },
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, proposalData, quoteData } = body;

    if (!action || !["generate-proposal", "generate-quote"].includes(action)) {
      return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (action === "generate-proposal") {
      const { clientName, projectType, objectives, budget, timeline, requirements } = proposalData || {};

      if (!clientName || !projectType) {
        return NextResponse.json(
          { error: "Client name and project type are required." },
          { status: 400 }
        );
      }

      const prompt = [
        {
          role: "system",
          content:
            "You are an AI assistant that creates professional business proposals for small businesses and freelancers. Generate compelling, well-structured proposals that clearly communicate value, scope, timeline, and investment.",
        },
        {
          role: "user",
          content: [
            `Client: ${clientName}`,
            `Project Type: ${projectType}`,
            objectives ? `Objectives: ${objectives}` : null,
            budget ? `Budget range: ${budget}` : null,
            timeline ? `Preferred timeline: ${timeline}` : null,
            requirements ? `Key requirements: ${requirements}` : null,
            "",
            "Create a professional proposal with:",
            "- Compelling title",
            "- Executive summary (2-3 sentences)",
            "- Multiple sections covering: Project Overview, Scope of Work, Timeline, Investment",
            "- Clear pricing breakdown with line items",
            "- Professional payment terms",
            "",
            "Return JSON:",
            "{",
            '  title: string,',
            '  executiveSummary: string,',
            '  sections: [{title: string, content: string}],',
            '  pricing: {',
            '    basePrice: number,',
            '    lineItems: [{item: string, amount: number}],',
            '    total: number,',
            '    paymentTerms: string',
            "  }",
            "}",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ];

      let proposalPayload = null;

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
          proposalPayload = JSON.parse(cleanedOutput || "{}");
        } catch (parseError) {
          console.warn("proposal-generator JSON parse fallback", parseError);
          proposalPayload = fallbackProposals[Math.floor(Math.random() * fallbackProposals.length)];
        }
      } catch (err) {
        console.warn("proposal-generator openai fallback", err);
        proposalPayload = fallbackProposals[Math.floor(Math.random() * fallbackProposals.length)];
      }

      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        data: proposalPayload,
      });
    }

    if (action === "generate-quote") {
      const { clientName, services, quantity, unitPrice, discount, notes } = quoteData || {};

      if (!clientName || !services || !Array.isArray(services) || services.length === 0) {
        return NextResponse.json(
          { error: "Client name and at least one service are required." },
          { status: 400 }
        );
      }

      const prompt = [
        {
          role: "system",
          content:
            "You are an AI assistant that generates professional quotes for small businesses. Create clear, accurate quotes with itemized pricing and professional terms.",
        },
        {
          role: "user",
          content: [
            `Client: ${clientName}`,
            `Services: ${JSON.stringify(services)}`,
            quantity ? `Quantity: ${quantity}` : null,
            unitPrice ? `Unit price: $${unitPrice}` : null,
            discount ? `Discount: ${discount}%` : null,
            notes ? `Additional notes: ${notes}` : null,
            "",
            "Generate a quote with:",
            "- Quote number (format: QT-YYYY-###)",
            "- Date and expiration date (30 days)",
            "- Line items with descriptions, quantities, rates, and amounts",
            "- Subtotal, discount (if any), tax, and total",
            "- Professional terms and validity period",
            "",
            "Return JSON:",
            "{",
            '  quoteNumber: string,',
            '  date: string (YYYY-MM-DD),',
            '  expirationDate: string (YYYY-MM-DD),',
            '  items: [{description: string, quantity: number, rate: number, amount: number}],',
            '  subtotal: number,',
            '  discount: number,',
            '  tax: number,',
            '  total: number,',
            '  terms: string',
            "}",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ];

      let quotePayload = null;

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
          quotePayload = JSON.parse(cleanedOutput || "{}");
        } catch (parseError) {
          console.warn("proposal-generator quote JSON parse fallback", parseError);
          // Generate fallback quote
          const subtotal = services.reduce((sum, s) => sum + (s.rate || 0) * (s.quantity || 1), 0);
          const discountAmount = discount ? (subtotal * discount) / 100 : 0;
          const afterDiscount = subtotal - discountAmount;
          const tax = afterDiscount * 0.08;
          quotePayload = {
            quoteNumber: `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split("T")[0],
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            items: services.map((s) => ({
              description: s.description || s.service,
              quantity: s.quantity || 1,
              rate: s.rate || s.unitPrice || 0,
              amount: (s.quantity || 1) * (s.rate || s.unitPrice || 0),
            })),
            subtotal,
            discount: discountAmount,
            tax,
            total: afterDiscount + tax,
            terms: "Quote valid for 30 days. Payment terms: Net 30 upon acceptance.",
          };
        }
      } catch (err) {
        console.warn("proposal-generator quote fallback", err);
        // Generate fallback quote
        const subtotal = services.reduce((sum, s) => sum + (s.rate || 0) * (s.quantity || 1), 0);
        const discountAmount = discount ? (subtotal * discount) / 100 : 0;
        const afterDiscount = subtotal - discountAmount;
        const tax = afterDiscount * 0.08;
        quotePayload = {
          quoteNumber: `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString().split("T")[0],
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          items: services.map((s) => ({
            description: s.description || s.service,
            quantity: s.quantity || 1,
            rate: s.rate || s.unitPrice || 0,
            amount: (s.quantity || 1) * (s.rate || s.unitPrice || 0),
          })),
          subtotal,
          discount: discountAmount,
          tax,
          total: afterDiscount + tax,
          terms: "Quote valid for 30 days. Payment terms: Net 30 upon acceptance.",
        };
      }

      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        data: quotePayload,
      });
    }
  } catch (error) {
    console.error("proposal-generator route error:", error);
    return NextResponse.json(
      {
        error: "Unable to generate proposal/quote at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

