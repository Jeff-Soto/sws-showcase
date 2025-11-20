import SeoOptimizerClient from "./SeoOptimizerClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI SEO Content Optimizer | Soto Web Studios Showcase",
  description:
    "Optimize your content for search engines with AI-powered keyword analysis, meta tag generation, and SEO recommendations.",
};

export default async function SeoOptimizerPage() {
  const demo = await getDemoBySlug("ai-seo-optimizer");
  return <SeoOptimizerClient demo={demo} />;
}

