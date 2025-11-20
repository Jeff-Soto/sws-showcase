import ContentGeneratorClient from "./ContentGeneratorClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Content Generator | Soto Web Studios Showcase",
  description:
    "Generate marketing-ready copy with tone and format controls. OpenAI-powered demo for Soto Web Studios.",
};

export default async function AIContentGeneratorPage() {
  const demo = await getDemoBySlug("ai-content-generator");
  return <ContentGeneratorClient demo={demo} />;
}
