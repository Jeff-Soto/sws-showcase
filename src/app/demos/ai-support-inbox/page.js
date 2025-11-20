import SupportInboxClient from "./SupportInboxClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Support Inbox | Soto Web Studios Showcase",
  description:
    "Monitor tickets and generate AI-assisted replies enriched with knowledge base context.",
};

export default async function AISupportInboxPage() {
  const demo = await getDemoBySlug("ai-support-inbox");
  return <SupportInboxClient demo={demo} />;
}

