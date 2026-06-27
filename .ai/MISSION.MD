# MISSION.md

# 🚀 Project Mission

You are building **LeadFlow**, a premium AI-powered lead generation platform.

This project is currently **LOCAL DEVELOPMENT ONLY**.

There is **NO production deployment**.

Everything must run locally on the developer's machine.

Current URL:

```
http://localhost:3000
```

Backend (future)

```
http://localhost:8000
```

Supabase is used for:

* Authentication
* PostgreSQL Database
* Storage
* Realtime

---

# Primary Goal

Build a production-quality SaaS application that looks like it could be sold to real businesses.

Every feature should feel polished.

Avoid tutorial-quality code.

Prefer scalable architecture.

---

# Tech Stack

Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage

Future

* FastAPI
* Gemini API
* Docker
* Vercel Deployment

---

# Current Phase

We are building the MVP.

Ignore deployment.

Ignore billing.

Ignore subscriptions.

Ignore email sending.

Focus only on local development.

---

# Current Features

Authentication

* Register
* Login
* Logout

Dashboard

* Stats
* Quick Actions
* Recent Activity

Lead Search

* Keyword
* Location
* Industry

Lead Table

* Company
* Website
* Email
* Phone
* Status

AI Email Generator

* Generate email
* Copy email

Analytics

Settings

Dark Mode

Responsive Layout

---

# Current Scope

Only implement features listed above.

Do NOT add random features.

Do NOT redesign the architecture unless requested.

---

# UI Requirements

The application must feel inspired by

* Linear
* Vercel
* Notion
* Stripe

Requirements

* Minimal
* Premium
* Modern
* Smooth animations
* Large spacing
* Consistent typography
* Excellent UX

Dark mode first.

---

# Coding Standards

Always use TypeScript.

Never use JavaScript.

Never use "any" unless unavoidable.

Use reusable components.

Keep components under roughly 200 lines whenever practical.

Split UI into logical components.

Avoid duplicated code.

---

# File Organization

Organize by feature.

Example

```
app/

components/

components/dashboard/

components/search/

components/ui/

hooks/

lib/

types/

utils/

supabase/

```

Avoid giant files.

---

# AI Behaviour Rules

Before writing code

1. Understand the task.

2. Read only files relevant to the task.

3. Never scan the entire repository unless explicitly requested.

4. Reuse existing components whenever possible.

5. Ask questions if information is missing.

6. Explain major architectural decisions.

7. Never generate placeholder implementations unless requested.

8. Never invent APIs that do not exist.

9. Never remove working functionality without approval.

10. Complete one feature before starting another.

---

# Performance Goals

Fast page loads.

Minimal rerenders.

Lazy load when appropriate.

Optimize images.

Avoid unnecessary dependencies.

---

# Error Handling

Gracefully handle

* Missing data

* Network failures

* Invalid forms

* Unauthorized users

Never crash the application.

---

# Security

Validate user input.

Protect authenticated routes.

Never expose secrets.

Use environment variables.

---

# Design Philosophy

Build software that businesses would trust.

Every screen should look production-ready.

Every interaction should feel intentional.

Every animation should improve UX.

Avoid flashy effects that reduce usability.

---

# Definition of Done

A feature is complete only if

✅ Responsive

✅ Type-safe

✅ Accessible

✅ Error handled

✅ Clean UI

✅ Reusable

✅ Works locally

✅ No TypeScript errors

✅ No console errors

---

# Local Development Rules

Assume the application runs locally.

Frontend

```
http://localhost:3000
```

Backend (future)

```
http://localhost:8000
```

Never reference production domains.

Never assume deployment exists.

All testing should occur locally.

---

# Mission Statement

LeadFlow is not a portfolio toy.

LeadFlow is the first version of a real software company.

Every commit should move the application closer to something that real businesses could use and eventually pay for.
