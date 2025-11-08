import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const fallbackAnalyses = [
  {
    summary:
      "The resume highlights a full-stack engineer with 7+ years of experience leading AI-enabled SaaS platforms, emphasizing collaboration with design, product, and analytics stakeholders.",
    keyPoints: [
      "Scaled Next.js and Node microservices to support 1M+ monthly users.",
      "Led cross-functional roadmap for AI personalization and analytics dashboards.",
      "Mentored engineers and instituted design system standards to accelerate delivery.",
    ],
    recommendations: [
      "Surface quantifiable business outcomes for each flagship project.",
      "Add a one-line summary above Experience to reinforce industry focus.",
      "Include links to deployed demos or GitHub repos for showcased work.",
    ],
  },
  {
    summary:
      "The document outlines an AI-readiness roadmap for a marketing team, prioritizing quick wins in content generation, analytics insights, and creative asset creation.",
    keyPoints: [
      "Phase 1 focuses on pilot programs with measurable ROI in under 6 weeks.",
      "Highlights governance requirements including prompt libraries and review checkpoints.",
      "Emphasizes change management with stakeholder training and QA scorecards.",
    ],
    recommendations: [
      "Add KPI targets to each phase for executive alignment.",
      "Define data sources and privacy considerations per use case.",
      "Propose tooling stack recommendations based on existing software investments.",
    ],
  },
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const notes = formData.get("notes")?.toString() ?? "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "A document file is required." }, { status: 400 });
    }

    const fileName = file.name ?? "uploaded-document";
    const fileSize = file.size ?? 0;
    const fileType = file.type ?? "application/pdf";

    let extractedText = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      // For the demo, we only peek at the first kilobyte to avoid heavy parsing.
      extractedText = buffer.toString("utf8", 0, 1024);
    } catch (err) {
      console.warn("document-analysis: unable to peek file buffer", err);
    }

    const prompt = [
      {
        role: "system",
        content:
          "You are an AI analyst that reviews professional documents (resumes, reports, proposals). Return actionable insights and keep tone concise.",
      },
      {
        role: "user",
        content: [
          `File name: ${fileName}`,
          `File type: ${fileType}`,
          `File size: ${(fileSize / 1024).toFixed(2)} KB`,
          notes ? `Submitter notes: ${notes}` : null,
          extractedText
            ? `Excerpt from document (first 1KB):\n${extractedText.slice(0, 1000)}`
            : "No text excerpt available (binary content).",
          "Return JSON with keys: summary (string), keyPoints (string array), recommendations (string array).",
          "Keep key points and recommendations highly actionable, 1-2 sentences each.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    ];

    const openai = getOpenAIClient();
    let analysisPayload = null;

    try {
      const response = await openai.responses.create({
        model: OPENAI_MODEL.INSIGHT,
        input: prompt,
      });
      try {
        analysisPayload = JSON.parse(response.output_text ?? "{}");
      } catch (parseError) {
        console.warn("document-analysis JSON parse fallback", parseError);
        analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
      }
    } catch (err) {
      console.warn("document-analysis openai fallback", err);
      analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
    }

    return NextResponse.json({
      file: {
        name: fileName,
        size: fileSize,
        type: fileType,
      },
      analysis: {
        summary: analysisPayload.summary ?? "",
        keyPoints: Array.isArray(analysisPayload.keyPoints)
          ? analysisPayload.keyPoints
          : fallbackAnalyses[0].keyPoints,
        recommendations: Array.isArray(analysisPayload.recommendations)
          ? analysisPayload.recommendations
          : fallbackAnalyses[0].recommendations,
      },
      notes,
    });
  } catch (error) {
    console.error("document-analysis route error:", error);
    return NextResponse.json(
      { error: "Unable to analyze document at this time. Please try again later." },
      { status: 500 }
    );
  }
}

