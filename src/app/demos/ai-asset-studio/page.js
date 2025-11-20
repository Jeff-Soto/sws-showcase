import AssetStudioClient from "./AssetStudioClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "AI Asset Studio | Soto Web Studios Showcase",
  description:
    "Generate branded imagery with AI using style presets, prompt history, and instant downloads.",
};

export default async function AIAssetStudioPage() {
  const demo = await getDemoBySlug("ai-asset-studio");
  return <AssetStudioClient demo={demo} />;
}

