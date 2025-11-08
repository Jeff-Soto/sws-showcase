export const tickets = [
  {
    id: "t1",
    subject: "Billing discrepancy on the Growth plan",
    customer: "Maya Patel · Nimbus Analytics",
    priority: "High",
    status: "Open",
    createdAt: "2025-11-08T14:30:00Z",
    messages: [
      {
        author: "customer",
        timestamp: "2025-11-08T14:30:00Z",
        content:
          "Hi SWS team — our latest invoice shows a usage surcharge that doubled the expected amount. Can you confirm whether our AI insights calls were throttled? We launched a campaign this week but the dashboard stats don’t line up.",
      },
      {
        author: "customer",
        timestamp: "2025-11-08T14:33:00Z",
        content:
          "We need clarity before finance closes books on Monday. Please advise if we should pause anything.",
      },
    ],
  },
  {
    id: "t2",
    subject: "Feature request: export AI insights as PDF",
    customer: "Luis Martinez · CreativeForge",
    priority: "Medium",
    status: "Open",
    createdAt: "2025-11-07T19:05:00Z",
    messages: [
      {
        author: "customer",
        timestamp: "2025-11-07T19:05:00Z",
        content:
          "Loving the smart analytics dashboard! Several clients asked if they can export the AI insight notes as a branded PDF after weekly reviews.",
      },
      {
        author: "customer",
        timestamp: "2025-11-07T19:06:00Z",
        content:
          "Is this on the roadmap? Happy to be a design partner or share mockups if it helps.",
      },
    ],
  },
  {
    id: "t3",
    subject: "AI assistant greeting feels generic",
    customer: "Jordan Reed · Brightline Retail",
    priority: "Low",
    status: "Waiting",
    createdAt: "2025-11-06T10:12:00Z",
    messages: [
      {
        author: "customer",
        timestamp: "2025-11-06T10:12:00Z",
        content:
          "Our ecommerce assistant is live, but the opening greeting sounds generic. Can we tune the prompt so it references our holiday collection?",
      },
    ],
  },
];

export const kbArticles = [
  {
    id: "kb1",
    title: "Usage-based Billing FAQ",
    excerpt:
      "Usage is calculated nightly based on successful response tokens. Spikes appear within 24h. Contact finance@sotowebstudios.com for credit adjustments.",
  },
  {
    id: "kb2",
    title: "Exporting AI insights",
    excerpt:
      "PDF export is scheduled for Q1. In the interim, teams can share insights via the workspace share link or automate Slack summaries.",
  },
  {
    id: "kb3",
    title: "Customizing AI greetings",
    excerpt:
      "Edit the assistant prompt inside Settings → Conversational AI. You can inject dynamic product tags per campaign using our merch API.",
  },
];

