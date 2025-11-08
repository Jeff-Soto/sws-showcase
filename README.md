## Soto Web Studios Showcase

AI-powered web experience demos built with Next.js 15, MUI 7, Recharts, and OpenAI. This project mirrors the tech stack of [sotowebstudios.com](https://www.sotowebstudios.com/) and packages six production-ready proof-of-concept apps under a branded theme.

### Stack

- Next.js 15 (App Router, JavaScript)
- MUI 7 design system + custom Soto Web Studios palette
- Recharts for data visualization
- OpenAI API (Responses + Images) for AI interactions
- Node.js 24+ runtime

---

## Getting Started

### 1. Prerequisites

- Node.js **v24** or newer (`nvm install 24 && nvm use 24`)
- npm **10.7+**
- An OpenAI Platform API key with access to Responses & Images APIs

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file at the project root and add:

```
OPENAI_API_KEY=sk-...

# Optional: override default models
# OPENAI_MODEL_TEXT=gpt-4.1-mini
# OPENAI_MODEL_INSIGHT=gpt-4.1-mini
# OPENAI_MODEL_IMAGE=gpt-image-1
```

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` to explore the showcase.

---

## Demo Routes

| Route | Description | AI Feature |
| --- | --- | --- |
| `/demos/ai-content-generator` | Tone-aware marketing copy generator with history + clipboard flows. | OpenAI Responses |
| `/demos/smart-analytics-dashboard` | KPI grid, Recharts visualizations, and AI insights narratives. | OpenAI Responses |
| `/demos/ecommerce-ai-assistant` | Conversational product finder that filters a mock catalog. | OpenAI Responses |
| `/demos/document-analysis` | Resume/document upload with summary & recommendations. | OpenAI Responses |
| `/demos/ai-support-inbox` | Ticket console with AI-drafted replies and KB inserts. | OpenAI Responses |
| `/demos/ai-asset-studio` | Prompt-to-image generator with gallery history. | OpenAI Images |

---

## Project Structure

```
src/
  app/
    layout.js, providers.js, theme.js
    page.js (landing), demos/(demo routes), api/(server routes)
  components/
    common/… (GradientButton, InfoCard, SectionHeader)
    analytics/, layout/, demos/…
  data/
    demos.js, analytics.js, aiContentGenerator.js, products.js, support.js, assetStudio.js
  lib/
    openai.js (shared client + model config)
    productFilters.js (intent parsing utilities)
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in dev mode with Webpack bundler. |
| `npm run build` | Production build. |
| `npm run start` | Start production server. |
| `npm run lint` | Run ESLint against the project. |

---

## Implementation Notes

- **UI Theme**: Global MUI theme lives in `src/app/theme.js`, applying Soto Web Studios palette, gradient accents, and component overrides.
- **OpenAI client**: `src/lib/openai.js` centralizes model usage and warns if `OPENAI_API_KEY` is missing. You can override model choices via env vars.
- **API Routes**:
  - `api/generate-content`: Generates marketing copy (JSON response).
  - `api/ecommerce-assistant`: Filters catalog + drafts natural-language recommendations.
  - `api/document-analysis`: Accepts uploads via `FormData` and returns structured insights.
  - `api/support-reply`: Drafts empathetic responses with optional KB context.
  - `api/asset-studio`: Generates branded imagery (falls back to curated gallery when offline).
- **Data Mocking**: Demo-specific mock data are stored under `src/data/`, making it easy to connect real data sources later.
- **Component Reuse**: Cards, layout, and CTA patterns are centralized for consistent branding.

---

## Production Hardening Ideas

- Add authentication and role-based access for internal demos.
- Persist generated assets (S3) and AI outputs (PostgreSQL / Supabase).
- Instrument analytics (Amplitude, Segment) for demo interactions.
- Layer in background jobs (queue) for longer-running AI workflows.
- Expand testing with Playwright smoke tests covering critical flows.

---

## Deployment

Deploy on Vercel or your preferred platform. Remember to set the same environment variables (`OPENAI_API_KEY`, optional model overrides) in your deployment environment.
