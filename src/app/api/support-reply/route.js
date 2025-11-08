import { NextResponse } from "next/server";
import { tickets, kbArticles } from "@/data/support";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

function buildConversation(ticket, history) {
  const combined = [...ticket.messages, ...(history ?? [])];
  return combined
    .map((message) => {
      const author = message.author === "customer" ? "Customer" : "Agent";
      return `${author}: ${message.content}`;
    })
    .join("\n");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ticketId, kbId, agentNotes, history } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "ticketId is required." }, { status: 400 });
    }

    const ticket = tickets.find((item) => item.id === ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    const kbSnippet = kbArticles.find((article) => article.id === kbId);
    const openai = getOpenAIClient();

    const prompt = [
      {
        role: "system",
        content:
          "You are an empathetic customer support engineer at Soto Web Studios. Draft concise replies that acknowledge the issue, provide clarity, and outline next steps. Keep tone professional, human, and confident.",
      },
      {
        role: "user",
        content: [
          `Ticket subject: ${ticket.subject}`,
          `Priority: ${ticket.priority}`,
          "",
          "Conversation history:",
          buildConversation(ticket, history),
          "",
          kbSnippet
            ? `Knowledge base reference:\n${kbSnippet.title} — ${kbSnippet.excerpt}`
            : "No KB article provided.",
          agentNotes ? `Internal notes: ${agentNotes}` : null,
          "",
          "Draft a reply in the agent voice. Structure with greeting, acknowledgement, solution or next steps, and closing. Offer to keep the customer in the loop.",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ];

    const response = await openai.responses.create({
      model: OPENAI_MODEL.TEXT,
      input: prompt,
    });

    const reply = response.output_text?.trim();

    return NextResponse.json({
      reply:
        reply ??
        "Hi there! Thanks for reaching out—our team is looking into this and will follow up shortly with details.",
    });
  } catch (error) {
    console.error("support-reply route error:", error);
    return NextResponse.json(
      {
        error: "Unable to generate AI reply at this time.",
      },
      { status: 500 }
    );
  }
}

