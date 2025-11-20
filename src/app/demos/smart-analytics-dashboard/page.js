import AnalyticsDashboardClient from "./AnalyticsDashboardClient";
import { getDemoBySlug } from "@/lib/projects";

export const metadata = {
  title: "Smart Analytics Dashboard | Soto Web Studios Showcase",
  description:
    "Realtime analytics dashboard with AI insights, KPI cards, and Recharts visualizations integrated with OpenAI.",
};

export default async function SmartAnalyticsDashboardPage() {
  const demo = await getDemoBySlug("smart-analytics-dashboard");
  return <AnalyticsDashboardClient demo={demo} />;
}

