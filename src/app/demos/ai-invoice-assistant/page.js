import InvoiceAssistantClient from "./InvoiceAssistantClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Invoice & Expense Assistant | Soto Web Studios Showcase",
  description:
    "Generate professional invoices, categorize expenses automatically, and get financial summaries tailored for small businesses.",
};

export default async function InvoiceAssistantPage() {
  const demo = await getDemoBySlug("ai-invoice-assistant");
  return <InvoiceAssistantClient demo={demo} />;
}

