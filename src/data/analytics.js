export const analyticsPresets = {
  "last-7-days": {
    label: "Last 7 days",
    kpis: [
      { label: "Active Users", value: 12840, change: 12.4 },
      { label: "Sessions", value: 28410, change: 9.7 },
      { label: "Conversion Rate", value: 4.8, change: 0.6, suffix: "%" },
      { label: "MRR Impact", value: 43200, change: 18.2, prefix: "$" },
    ],
    trafficOverTime: [
      { date: "2025-11-02", visits: 3200 },
      { date: "2025-11-03", visits: 3520 },
      { date: "2025-11-04", visits: 3660 },
      { date: "2025-11-05", visits: 3880 },
      { date: "2025-11-06", visits: 4020 },
      { date: "2025-11-07", visits: 4310 },
      { date: "2025-11-08", visits: 4580 },
    ],
    topPages: [
      { page: "/demos/analytics", views: 4820, bounce: 34 },
      { page: "/pricing", views: 4380, bounce: 28 },
      { page: "/blog/ai-report", views: 3660, bounce: 41 },
      { page: "/demos/content", views: 3320, bounce: 31 },
      { page: "/case-studies/fintech", views: 2980, bounce: 29 },
    ],
    topSources: [
      { source: "Organic Search", visits: 11200, change: 14.1 },
      { source: "Paid Campaigns", visits: 6840, change: 8.9 },
      { source: "Product Hunt", visits: 3140, change: 22.4 },
      { source: "Referrals", visits: 2860, change: 5.7 },
    ],
    insights: [
      "AI-assisted onboarding reduced time-to-first-value by 28% week-over-week.",
      "Activation rate for Product Hunt traffic is 1.6x higher than other referral sources—recommend allocating more budget to maker campaigns.",
      "Churn risk dropped 12% after deploying the smart insights dashboard inside the customer portal.",
    ],
  },
  "last-30-days": {
    label: "Last 30 days",
    kpis: [
      { label: "Active Users", value: 41320, change: 19.4 },
      { label: "Sessions", value: 118320, change: 16.2 },
      { label: "Conversion Rate", value: 4.1, change: 0.9, suffix: "%" },
      { label: "MRR Impact", value: 152400, change: 24.6, prefix: "$" },
    ],
    trafficOverTime: Array.from({ length: 30 }).map((_, index) => {
      const baseDate = new Date("2025-10-10");
      baseDate.setDate(baseDate.getDate() + index);
      return {
        date: baseDate.toISOString().slice(0, 10),
        visits: Math.round(2800 + index * 120 + Math.sin(index / 2) * 220),
      };
    }),
    topPages: [
      { page: "/demos/analytics", views: 16820, bounce: 33 },
      { page: "/pricing", views: 14210, bounce: 30 },
      { page: "/blog/ai-report", views: 12980, bounce: 39 },
      { page: "/case-studies/fintech", views: 11890, bounce: 27 },
      { page: "/demos/content", views: 11230, bounce: 32 },
    ],
    topSources: [
      { source: "Organic Search", visits: 43210, change: 18.2 },
      { source: "Paid Campaigns", visits: 26840, change: 11.3 },
      { source: "Product Hunt", visits: 13380, change: 26.1 },
      { source: "Referrals", visits: 12110, change: 7.4 },
    ],
    insights: [
      "Product tours featuring AI summaries improved conversions by 22% compared to static tours.",
      "Users who engaged with AI insights are retaining 2.3x longer and show 31% higher expansion revenue.",
      "Recommend testing AI-personalized homepage hero copy—segments with prior AI exposure convert 18% higher.",
    ],
  },
};

