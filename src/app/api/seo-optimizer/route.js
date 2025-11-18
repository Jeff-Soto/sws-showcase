import { NextResponse } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

const fallbackAnalyses = [
  {
    metaTitle: "AI-Powered Analytics Dashboard | Soto Web Studios",
    metaDescription:
      "Discover how AI-powered analytics dashboards transform business insights. Real-time metrics, intelligent recommendations, and actionable data visualization for modern teams.",
    keywords: ["AI analytics", "business dashboard", "data visualization", "real-time metrics", "business intelligence"],
    seoScore: 78,
    recommendations: [
      "Add target keyword 'AI analytics dashboard' to your H1 heading",
      "Include internal links to related pages (analytics features, case studies)",
      "Add schema markup for better rich snippets in search results",
      "Consider adding FAQ section targeting long-tail keywords",
      "Optimize images with descriptive alt text containing keywords",
    ],
    titleSuggestions: [
      "AI Analytics Dashboard: Transform Your Business Insights | Soto Web Studios",
      "Real-Time AI Analytics Dashboard for Modern Teams | Soto Web Studios",
      "Business Intelligence Dashboard with AI-Powered Insights | Soto Web Studios",
    ],
    improvements: [
      {
        type: "heading",
        current: "Our Analytics Solution",
        suggested: "AI-Powered Analytics Dashboard for Modern Businesses",
        reason: "Include primary keyword and user intent",
      },
      {
        type: "content",
        current: "We provide analytics tools.",
        suggested: "Our AI-powered analytics dashboard delivers real-time business insights that drive data-driven decision-making.",
        reason: "More descriptive and keyword-rich",
      },
    ],
  },
  {
    metaTitle: "Professional Web Design Services for Small Businesses",
    metaDescription:
      "Get custom web design services tailored for small businesses. Mobile-responsive websites, SEO optimization, and e-commerce solutions that drive growth.",
    keywords: ["web design", "small business website", "custom web design", "responsive design", "small business SEO"],
    seoScore: 82,
    recommendations: [
      "Target long-tail keywords like 'affordable web design for small businesses'",
      "Add location-based keywords if serving specific regions",
      "Include customer testimonials to boost trust signals",
      "Create blog content around web design tips for small businesses",
      "Optimize page speed for better Core Web Vitals scores",
    ],
    titleSuggestions: [
      "Custom Web Design Services for Small Businesses | Get Started Today",
      "Affordable Small Business Web Design | Mobile-Responsive Solutions",
      "Professional Web Design Services | Small Business Websites That Convert",
    ],
    improvements: [
      {
        type: "heading",
        current: "Web Design Services",
        suggested: "Professional Web Design Services for Small Businesses",
        reason: "More specific and includes target audience",
      },
      {
        type: "content",
        current: "We create websites.",
        suggested: "Our custom web design services help small businesses establish a strong online presence with mobile-responsive websites optimized for conversions.",
        reason: "Addresses user needs and includes keywords",
      },
    ],
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, targetKeyword, contentType, url } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    const openai = getOpenAIClient();

    const prompt = [
      {
        role: "system",
        content:
          "You are an expert SEO strategist who analyzes content and provides actionable recommendations for search engine optimization. Focus on keyword optimization, meta tags, content improvements, and technical SEO best practices.",
      },
      {
        role: "user",
        content: [
          targetKeyword ? `Target keyword: ${targetKeyword}` : null,
          contentType ? `Content type: ${contentType}` : null,
          url ? `Page URL: ${url}` : null,
          "",
          "Content to analyze:",
          content,
          "",
          "Return JSON with the following structure:",
          '{',
          '  "metaTitle": "Optimized title tag (50-60 characters)",',
          '  "metaDescription": "Compelling meta description (150-160 characters)",',
          '  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],',
          '  "seoScore": 85,',
          '  "recommendations": [',
          '    "Specific recommendation 1",',
          '    "Specific recommendation 2"',
          "  ],",
          '  "titleSuggestions": ["Title option 1", "Title option 2", "Title option 3"],',
          '  "improvements": [',
          '    {',
          '      "type": "heading" | "content" | "keyword",',
          '      "current": "Current text",',
          '      "suggested": "Improved text",',
          '      "reason": "Why this change helps SEO"',
          "    }",
          "  ]",
          "}",
          "",
          "Provide 3-5 specific, actionable recommendations. Generate 3 alternative title suggestions. Include 2-3 content improvements with before/after examples.",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ];

    let analysisPayload = null;

    try {
      const response = await openai.responses.create({
        model: OPENAI_MODEL.INSIGHT,
        input: prompt,
      });

      try {
        const cleanedOutput = (response.output_text ?? "")
          .replace(/^```json\s*/i, "")
          .replace(/```$/i, "")
          .trim();
        analysisPayload = JSON.parse(cleanedOutput || "{}");
      } catch (parseError) {
        console.warn("seo-optimizer JSON parse fallback", parseError);
        analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
      }
    } catch (err) {
      console.warn("seo-optimizer openai fallback", err);
      analysisPayload = fallbackAnalyses[Math.floor(Math.random() * fallbackAnalyses.length)];
    }

    return NextResponse.json({
      success: true,
      analyzedAt: new Date().toISOString(),
      data: {
        metaTitle: analysisPayload.metaTitle ?? "",
        metaDescription: analysisPayload.metaDescription ?? "",
        keywords: Array.isArray(analysisPayload.keywords)
          ? analysisPayload.keywords
          : fallbackAnalyses[0].keywords,
        seoScore: analysisPayload.seoScore ?? 75,
        recommendations: Array.isArray(analysisPayload.recommendations)
          ? analysisPayload.recommendations
          : fallbackAnalyses[0].recommendations,
        titleSuggestions: Array.isArray(analysisPayload.titleSuggestions)
          ? analysisPayload.titleSuggestions
          : fallbackAnalyses[0].titleSuggestions,
        improvements: Array.isArray(analysisPayload.improvements)
          ? analysisPayload.improvements
          : fallbackAnalyses[0].improvements,
      },
    });
  } catch (error) {
    console.error("seo-optimizer route error:", error);
    return NextResponse.json(
      {
        error: "Unable to analyze content for SEO at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

