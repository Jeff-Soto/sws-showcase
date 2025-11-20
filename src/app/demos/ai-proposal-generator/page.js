import ProposalGeneratorClient from "./ProposalGeneratorClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Proposal Generator | Soto Web Studios Showcase",
  description:
    "Create winning client proposals, generate accurate quotes, and customize contract templates with AI assistance.",
};

export default async function ProposalGeneratorPage() {
  const demo = await getDemoBySlug("ai-proposal-generator");
  return <ProposalGeneratorClient demo={demo} />;
}

