import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";
import { products } from "@/data/products";
import {
  parseFilters,
  filterProducts,
  buildFilterSummary,
} from "@/lib/productFilters";

function formatProductForPrompt(product) {
  return `${product.name} ($${product.price}) — ${product.description}. Tags: ${product.tags.join(", ")}`;
}

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const filters = parseFilters(message);
    let matches = filterProducts(products, filters);
    const hasExactMatches = matches.length > 0;

    if (!hasExactMatches) {
      matches = products
        .slice()
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
    }

    const recommendations = matches.slice(0, 3);

    const openai = getOpenAIClient();
    const humanHistory = history
      .slice(-4)
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
      .join("\n");

    const prompt = [
      {
        role: "system",
        content:
          "You are an AI commerce assistant. Provide concise, helpful product recommendations referencing the provided catalog items. Highlight why each product fits the shopper's request. Keep responses under 4 paragraphs.",
      },
      {
        role: "user",
        content: [
          humanHistory ? `Conversation so far:\n${humanHistory}` : null,
          `Current shopper message: ${message}`,
          `Derived filters: ${buildFilterSummary(filters)}`,
          `Exact matches found: ${hasExactMatches ? "yes" : "no"}`,
          "Catalog matches:",
          recommendations.map((product, index) => `${index + 1}. ${formatProductForPrompt(product)}`).join("\n"),
          hasExactMatches
            ? "Respond with a friendly tone. Include a short bullet list when recommending multiple products."
            : "Respond with a friendly tone. Explain these are great alternative picks based on the request. Encourage next steps without saying the catalog is empty.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    ];

    let replyText = "";

    try {
      const completion = await openai.responses.create({
        model: OPENAI_MODEL.TEXT,
        input: prompt,
      });
      replyText = completion.output_text?.trim();
    } catch (err) {
      console.warn("OpenAI fallback for ecommerce assistant:", err);
      replyText = [
        "Here are a few picks that match what you're looking for:",
        ...recommendations.map(
          (product) =>
            `• ${product.name} — $${product.price}. ${product.description}`
        ),
        "Let me know if you want me to narrow things down further!",
      ].join("\n");
    }

    return NextResponse.json({
      reply: replyText,
      recommendations,
      filters: buildFilterSummary(filters),
      matchType: hasExactMatches ? "exact" : "alternative",
    });
  } catch (error) {
    console.error("ecommerce-assistant route error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong while generating recommendations. Please try again.",
      },
      { status: 500 }
    );
  }
}

