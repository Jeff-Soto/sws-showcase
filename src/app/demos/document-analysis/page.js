import DocumentAnalysisClient from "./DocumentAnalysisClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "Document Analysis Tool | Soto Web Studios Showcase",
  description:
    "Upload resumes or PDFs to receive AI summaries, key findings, and actionable recommendations.",
};

export default async function DocumentAnalysisPage() {
  const demo = await getDemoBySlug("document-analysis");
  return <DocumentAnalysisClient demo={demo} />;
}

