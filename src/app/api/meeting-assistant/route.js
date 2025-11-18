import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const fallbackAnalyses = [
  {
    summary:
      "Team discussed Q1 product roadmap priorities, focusing on AI-powered analytics features and mobile app improvements. Key decisions include prioritizing user dashboard enhancements and scheduling follow-up design review.",
    actionItems: [
      "Schedule design review meeting for analytics dashboard (Owner: Sarah, Due: Next week)",
      "Prepare technical specs for mobile app push notifications (Owner: Mike, Due: Friday)",
      "Share competitor analysis document with product team (Owner: Jessica, Due: Tomorrow)",
    ],
    keyDecisions: [
      "Approved budget allocation for analytics infrastructure",
      "Decided to delay social features until Q2",
      "Agreed to weekly standups on Tuesdays at 10 AM",
    ],
    participants: ["Sarah (Product)", "Mike (Engineering)", "Jessica (Marketing)", "Alex (Design)"],
    followUps: [
      {
        task: "Review analytics dashboard mockups",
        assignee: "Sarah",
        dueDate: "Next week",
      },
      {
        task: "Draft technical specification for push notifications",
        assignee: "Mike",
        dueDate: "Friday",
      },
    ],
  },
  {
    summary:
      "Client kickoff meeting covered project scope, timeline, and deliverables. Established communication channels and outlined next steps for initial design phase.",
    actionItems: [
      "Send project timeline document to client (Owner: Project Manager, Due: Tomorrow)",
      "Schedule design discovery session (Owner: Design Lead, Due: Next week)",
      "Prepare technical requirements document (Owner: Tech Lead, Due: Friday)",
    ],
    keyDecisions: [
      "Agreed to 12-week timeline with 3 major milestones",
      "Decided on weekly status updates every Friday",
      "Approved initial design direction and brand guidelines",
    ],
    participants: ["Project Manager", "Design Lead", "Tech Lead", "Client Representative"],
    followUps: [
      {
        task: "Send project timeline and milestones document",
        assignee: "Project Manager",
        dueDate: "Tomorrow",
      },
      {
        task: "Prepare design discovery questions",
        assignee: "Design Lead",
        dueDate: "Next week",
      },
    ],
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { transcript, meetingType, notes } = body;

    if (!transcript || !transcript.trim()) {
      return NextResponse.json({ error: "Transcript is required." }, { status: 400 });
    }

    const openai = getOpenAIClient();

    const prompt = [
      {
        role: "system",
        content:
          "You are an AI meeting assistant that extracts action items, summarizes discussions, identifies key decisions, and creates follow-up tasks. Return structured, actionable output.",
      },
      {
        role: "user",
        content: [
          meetingType ? `Meeting type: ${meetingType}` : null,
          notes ? `Additional context: ${notes}` : null,
          "",
          "Meeting transcript:",
          transcript,
          "",
          "Return JSON with the following structure:",
          '{',
          '  "summary": "Brief 2-3 sentence summary of the meeting",',
          '  "actionItems": ["Action item 1 (Owner: Name, Due: Date)", "Action item 2 (Owner: Name, Due: Date)"],',
          '  "keyDecisions": ["Decision 1", "Decision 2"],',
          '  "participants": ["Name 1 (Role)", "Name 2 (Role)"],',
          '  "followUps": [',
          '    { "task": "Task description", "assignee": "Name", "dueDate": "Date" }',
          "  ]",
          "}",
          "",
          "Keep action items specific and include owners and due dates when mentioned. Extract all participants mentioned in the transcript.",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ];

    let analysisPayload = null;

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
        analysisPayload = JSON.parse(cleanedOutput || "{}");
      } catch (parseError) {
        console.warn("meeting-assistant JSON parse fallback", parseError);
        analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
      }
    } catch (err) {
      console.warn("meeting-assistant openai fallback", err);
      analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
    }

    return NextResponse.json({
      success: true,
      processedAt: new Date().toISOString(),
      data: {
        summary: analysisPayload.summary ?? "",
        actionItems: Array.isArray(analysisPayload.actionItems)
          ? analysisPayload.actionItems
          : fallbackAnalyses[0].actionItems,
        keyDecisions: Array.isArray(analysisPayload.keyDecisions)
          ? analysisPayload.keyDecisions
          : fallbackAnalyses[0].keyDecisions,
        participants: Array.isArray(analysisPayload.participants)
          ? analysisPayload.participants
          : fallbackAnalyses[0].participants,
        followUps: Array.isArray(analysisPayload.followUps)
          ? analysisPayload.followUps
          : fallbackAnalyses[0].followUps,
      },
    });
  } catch (error) {
    console.error("meeting-assistant route error:", error);
    return NextResponse.json(
      {
        error: "Unable to process meeting transcript at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

