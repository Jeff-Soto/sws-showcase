import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const contentTemplates = {
  blog: "Write a compelling blog post outline with 3 sections and engaging intro/outro.",
  social: "Draft a social media thread with a hook, 3-4 concise points, and a CTA.",
  email: "Compose an email with greeting, body paragraphs, value proposition, and a closing CTA.",
  ad: "Create punchy ad copy with headline, supporting sentence, and call to action.",
};

const typeLabels = {
  blog: "Blog Post",
  social: "Social Post",
  email: "Email",
  ad: "Ad Copy",
};

function buildPrompt({ contentType, tone, topic, audience }) {
  const template = contentTemplates[contentType];

  return [
    {
      role: "system",
      content:
        "You are an award-winning marketing content strategist who writes polished, on-brand copy tailored to the requested tone and audience. Provide markdown formatting when helpful.",
    },
    {
      role: "user",
      content: [
        `Content type: ${typeLabels[contentType] ?? contentType}`,
        `Tone: ${tone}`,
        `Topic: ${topic}`,
        audience ? `Target audience: ${audience}` : null,
        template ? `Guidelines: ${template}` : null,
        "",
        "Return JSON with the following shape:",
        '{ "title": string, "summary": string, "content": string }',
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { contentType, tone, topic, audience } = body;

    if (!topic || !contentType || !tone) {
      return NextResponse.json(
        { error: "Content type, tone, and topic are required." },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const messages = buildPrompt({ contentType, tone, topic, audience });

    const result = await openai.responses.create({
      model: OPENAI_MODEL.TEXT,
      input: messages,
    });

    const rawOutput = result.output_text ?? "";

    let payload = {};
    try {
      const cleanedOutput = rawOutput.replace(/^```json\s*/i, "").replace(/```$/i, "");
      payload = JSON.parse(cleanedOutput || "{}");
    } catch (parseError) {
      console.warn("generate-content route JSON parse fallback", parseError);
      payload = { content: rawOutput, title: topic, summary: "" };
    }
    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      data: {
        title: payload.title ?? topic,
        summary: payload.summary ?? "",
        content: payload.content ?? rawOutput,
        type: contentType,
        tone,
        audience: audience ?? "",
        raw: rawOutput,
      },
    });
  } catch (error) {
    console.error("generate-content route error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ??
          "Unable to generate content at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

