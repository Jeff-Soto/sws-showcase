import MeetingAssistantClient from "./MeetingAssistantClient";

export const metadata = {
  title: "AI Meeting Assistant | Soto Web Studios Showcase",
  description:
    "Process meeting transcripts, extract action items, generate summaries, and create follow-up tasks—all powered by AI.",
};

export default function MeetingAssistantPage() {
  return <MeetingAssistantClient />;
}

