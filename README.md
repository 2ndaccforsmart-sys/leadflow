# LeadFlow

> **Find leads. Understand them. Contact them. Close more deals.**

LeadFlow is an AI-powered lead generation platform that helps you discover, research, and reach out to potential clients — all from one dashboard.

Built with [Next.js 16](https://nextjs.org) (App Router) and [Supabase](https://supabase.com).

---

## Features

### 🔍 Lead Search
Search for companies by industry, location, or name. Typewriter placeholder shows example searches like "Dentists in Austin", "Law firms in NYC", or "SaaS startups". Quick-suggest chips help you discover leads fast.

### 📋 Lead Details
Each lead gets a full profile: company overview, industry tags, employee count, location, founded year, and an **AI-generated summary** with recent news. Save leads to your collection, generate outreach emails directly from the profile.

### 🤖 AI Assistant
Chat with an AI assistant that knows your leads. Features:
- **Streaming responses** — see output as it's generated
- **Conversation history** — sessions persist with auto-generated titles
- **Web search mode** — toggle on or use `/web-search` prefix manually; fetches real-time results from DuckDuckGo
- **Markdown rendering** — supports code blocks, lists, links, and more
- **Suggested prompts** to get started quickly

### ✉️ Email Composer
Craft personalized outreach emails with AI. Choose from **5 tones**:
- Professional · Friendly · Casual · Persuasive · Formal

Select a template (Cold Outreach, Follow Up, Partnership Proposal, etc.), fill in recipient details, and generate. Preview with a live typewriter effect, copy to clipboard.

### 📊 Deal Pipeline
Visual kanban-style pipeline with stages: Lead → Qualified → Proposal → Negotiation → Closed Won. Track deal values, priorities (High/Medium/Low), and pipeline totals.

### ⚙️ Settings
Tunable preferences stored in localStorage:
- **AI & Automation** — Suggestions, Auto-Research, Email Drafts, Web Search
- **AI Nudges** — Casual reminders on a configurable interval (Off / 5m / 15m / 30m / 1h / 3h / 12h / 24h)
- **Notifications** — Research Alerts, New Match Alerts
- **Display** — Activity Panel toggle, Compact Mode

### 🔐 Auth
Seamless sign-in via Supabase. On first login, creates an account automatically — no separate registration step needed.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, RSC) |
| **Auth & DB** | Supabase (SSR, Browser Client) |
| **AI Backend** | Groq API (LLaMA-based chat) |
| **Web Search** | DuckDuckGo (server-side route) |
| **Styling** | Tailwind CSS v4, `class-variance-authority`, `tailwind-merge` |
| **Animations** | Framer Motion |
| **UI Components** | shadcn/ui + Base UI React |
| **Icons** | lucide-react |
| **Forms** | react-hook-form, zod |
| **Markdown** | react-markdown, remark-gfm |
| **Toasts** | sonner |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended), npm, or yarn
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI
GROQ_API_KEY=your_groq_api_key

# Base URL (for internal API calls)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/dashboard`.

---

## Project Structure

```
app/
├── (auth)/               # Login, Register layouts
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/          # Authenticated pages
│   ├── dashboard/page.tsx   # Home — greeting + lead search
│   ├── search/page.tsx      # Lead discovery
│   ├── leads/[id]/page.tsx  # Lead detail + AI summary
│   ├── assistant/page.tsx   # AI chat with streaming
│   ├── email/page.tsx       # Email composer
│   ├── analytics/page.tsx   # Deal pipeline
│   └── settings/page.tsx    # App preferences
├── api/
│   ├── chat/route.ts        # Groq chat + optional web search
│   └── web-search/route.ts  # DuckDuckGo proxy
├── layout.tsx
└── page.tsx               # Redirects to /dashboard

components/
├── ai/                    # Assistant components
├── layout/                # App shell (Sidebar, TopBar, etc.)
├── motion/                # Framer Motion wrappers
├── search/                # Search result components
└── ui/                    # shadcn/ui primitives

lib/
├── supabase/              # Supabase client & server helpers
└── utils.ts               # cn() helper

hooks/                     # Custom React hooks
types/                     # TypeScript types
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## License

Private — all rights reserved.
