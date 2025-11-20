import MeetingAssistantClient from "./MeetingAssistantClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Meeting Assistant | Soto Web Studios Showcase",
  description:
    "Process meeting transcripts, extract action items, generate summaries, and create follow-up tasks—all powered by AI.",
};

export default async function MeetingAssistantPage() {
  const demo = await getDemoBySlug("ai-meeting-assistant");
  return <MeetingAssistantClient demo={demo} />;
}

