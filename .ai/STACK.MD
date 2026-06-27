# STACK.md

# LeadFlow Technology Stack

## Project Status

Current Stage: MVP

Environment: Local Development Only

Frontend URL

http://localhost:3000

Backend URL (Future)

http://localhost:8000

---

# Frontend

Framework

Next.js (App Router)

Language

TypeScript

Styling

Tailwind CSS

UI Components

shadcn/ui

Animations

Framer Motion

Icons

Lucide React

Forms

React Hook Form

Validation

Zod

---

# Backend

Status: DEFERRED (until credentials ready)

Planned Services

- Supabase (Auth, Database, Storage, Realtime)
- PostgreSQL

Future Services

- FastAPI
- Gemini API

---

# Package Manager

pnpm

Never use npm or yarn unless explicitly requested.

---

# Code Quality

TypeScript Strict Mode

ESLint

Prettier

---

# Folder Structure

```
.ai/                    # Documentation & planning
app/
  (auth)/               # Auth route group (login, register)
  dashboard/
  search/
  analytics/
  settings/
  api/
components/
  ui/                   # shadcn/ui components
  layout/               # Sidebar, TopBar, AppLayout
  dashboard/
  search/
  analytics/
  auth/
  shared/
hooks/
lib/
  utils/
  constants/
  validators/
types/
public/
styles/
```

---

# Environment Variables

Current

- GEMINI_API_KEY (future)

Deferred (until Supabase integration)

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

---

# Commands

Start Dev

```
leadflow
```

Or manually:

```
pnpm dev
```

Build

```
pnpm build
```

Lint

```
pnpm lint
```

Type Check

```
pnpm tsc --noEmit
```

---

# Approved Libraries

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide React

Framer Motion

React Hook Form

Zod

Deferred (not yet installed)

- Supabase

No additional dependencies should be installed without approval.
