import ContentGeneratorClient from "./ContentGeneratorClient";

export const metadata = {
  title: "AI Content Generator | Soto Web Studios Showcase",
  description:
    "Generate marketing-ready copy with tone and format controls. OpenAI-powered demo for Soto Web Studios.",
};

export default function AIContentGeneratorPage() {
  return <ContentGeneratorClient />;
}
