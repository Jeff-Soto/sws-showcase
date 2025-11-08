import DocumentAnalysisClient from "./DocumentAnalysisClient";

export const metadata = {
  title: "Document Analysis Tool | Soto Web Studios Showcase",
  description:
    "Upload resumes or PDFs to receive AI summaries, key findings, and actionable recommendations.",
};

export default function DocumentAnalysisPage() {
  return <DocumentAnalysisClient />;
}

