import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

export async function POST(request) {
  try {
    const { question, analysis, fileMeta } = await request.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    if (!analysis) {
      return NextResponse.json(
        { error: "No analysis available. Upload and analyze a document first." },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const prompt = [
      {
        role: "system",
        content:
          "You are an AI assistant answering follow-up questions about a document that has already been analyzed. Use only the provided summary, key points, and recommendations. If the summary does not contain the requested detail, say so.",
      },
      {
        role: "user",
        content: [
          fileMeta ? `File name: ${fileMeta.name}` : null,
          fileMeta ? `File type: ${fileMeta.type}` : null,
          fileMeta ? `File size: ${fileMeta.size} bytes` : null,
          `Summary:\n${analysis.summary}`,
          `Key points:\n- ${analysis.keyPoints.join("\n- ")}`,
          `Recommendations:\n- ${analysis.recommendations.join("\n- ")}`,
          "",
          `Question: ${question}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ];

    const response = await openai.responses.create({
      model: OPENAI_MODEL.INSIGHT ?? OPENAI_MODEL.TEXT,
      input: prompt,
    });

    const answer = response.output_text?.trim();

    return NextResponse.json({
      answer:
        answer ||
        "I couldn’t generate an answer right now. Try rephrasing your question or reviewing the key points above.",
    });
  } catch (error) {
    console.error("document-analysis chat error:", error);
    return NextResponse.json(
      { error: "Unable to answer that question right now. Please try again." },
      { status: 500 }
    );
  }
}


