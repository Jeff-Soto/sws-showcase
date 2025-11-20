import AssistantClient from "./AssistantClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "E-Commerce AI Assistant | Soto Web Studios Showcase",
  description:
    "Conversational product finder that filters a catalog and narrates recommendations with OpenAI.",
};

export default async function EcommerceAIAssistantPage() {
  const demo = await getDemoBySlug("ecommerce-ai-assistant");
  return <AssistantClient demo={demo} />;
}

