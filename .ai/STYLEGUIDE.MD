# STYLEGUIDE.md

# LeadFlow Design System

## Philosophy

LeadFlow should look like software built by a funded startup.

Not a portfolio.

Not a tutorial.

Not a school project.

The UI should immediately communicate quality, trust, simplicity, and professionalism.

Every screen should feel intentional.

---

# Design Inspiration

Primary

• Linear

• Vercel

• Stripe

Secondary

• Notion

• Raycast

• GitHub

Do NOT imitate these products directly.

Use them as inspiration for spacing, typography, hierarchy, and polish.

---

# Overall Style

Minimal

Premium

Modern

Professional

Calm

Confident

Fast

Never childish.

Never flashy.

Never cluttered.

---

# Color Philosophy

Dark mode is the default experience.

Colors should communicate information—not decoration.

Primary colors are used for actions.

Neutral colors are used for layout.

Danger colors are reserved for destructive actions.

Success colors are reserved for completed actions.

Warning colors are reserved for attention.

Never overuse accent colors.

---

# Spacing

Whitespace is a feature.

Prefer generous spacing over cramped layouts.

Maintain consistent spacing throughout the application.

Never let components touch each other.

Every section should have visual breathing room.

---

# Typography

Use a clean sans-serif font.

Hierarchy must be obvious.

Titles should be bold.

Descriptions should be subtle.

Body text should prioritize readability.

Never use more than three font sizes in the same section.

Avoid excessive bold text.

---

# Layout

Use a consistent content width.

Center important content.

Maintain equal margins.

Keep navigation predictable.

Never move navigation between pages.

Every page should feel familiar.

---

# Navigation

Sidebar remains fixed.

Top navigation remains consistent.

Icons should always have labels.

The active page should be clearly highlighted.

Navigation should never feel crowded.

---

# Cards

Cards are the foundation of the dashboard.

Every card should include:

• Title

• Description (optional)

• Primary content

• Appropriate spacing

Rounded corners.

Subtle borders.

Soft shadows only when necessary.

Never stack cards without spacing.

---

# Buttons

Buttons should clearly communicate intent.

Primary

Main action.

Secondary

Supporting action.

Ghost

Low emphasis.

Danger

Destructive action only.

Never place multiple primary buttons next to each other.

---

# Inputs

Every input requires

Label

Placeholder

Validation

Helpful error message

Never rely on placeholder text as a label.

---

# Forms

Group related fields.

Use logical ordering.

Display validation immediately.

Never overwhelm users with unnecessary fields.

---

# Tables

Readable.

Sortable.

Searchable.

Responsive.

Never allow tables to overflow the screen.

Long text should truncate gracefully.

---

# Icons

Use Lucide icons.

Icons should support text.

Icons should never replace labels.

Maintain consistent sizing.

---

# Dashboard

The dashboard should answer:

What happened?

What needs attention?

What should the user do next?

Do not fill the dashboard with meaningless widgets.

Every card should provide value.

---

# Animations

Animations exist to improve usability.

Not to impress.

Use Framer Motion.

Animations should be:

Fast

Smooth

Subtle

Purposeful

Avoid excessive bouncing.

Avoid dramatic spinning.

Avoid unnecessary parallax.

---

# Loading States

Never display empty white screens.

Always use

Skeletons

Loading indicators

Progress feedback

---

# Empty States

Every empty page should explain:

Why it is empty.

What the user can do next.

Include a clear call to action.

---

# Error States

Errors should be calm.

Helpful.

Actionable.

Never blame the user.

Explain how to recover.

---

# Success States

Celebrate completion subtly.

Avoid excessive confetti.

Simple success indicators are preferred.

---

# Mobile Design

Mobile is a first-class experience.

Everything must work on phones.

Navigation should collapse gracefully.

Touch targets must be large enough.

No horizontal scrolling.

---

# Accessibility

Maintain sufficient color contrast.

Keyboard navigation should work.

Every input requires a label.

Every button requires meaningful text.

Focus states should remain visible.

---

# Performance

Prefer perceived speed.

Avoid layout shifts.

Optimize images.

Lazy-load heavy components.

Minimize JavaScript.

---

# Component Design

Every component should be reusable.

Every component should have one responsibility.

Avoid deeply nested components.

Keep props simple.

Avoid unnecessary abstraction.

---

# Naming

Component names should be descriptive.

Examples

DashboardCard

SearchInput

LeadTable

AnalyticsChart

Avoid names like

Component1

CardNew

TestButton

---

# Page Structure

Every page should follow the same hierarchy.

Title

↓

Description

↓

Primary Actions

↓

Content

↓

Supporting Information

Users should never wonder where to look first.

---

# User Experience

Every interaction should feel fast.

Every click should produce feedback.

Every transition should feel natural.

Reduce friction wherever possible.

The interface should disappear behind the workflow.

---

# AI Features

Generated content should look human.

Never expose raw AI output.

Allow editing before saving.

Display loading progress while generating.

Always handle failures gracefully.

---

# Consistency

Consistency beats creativity.

If a pattern already exists,

reuse it.

Do not invent new layouts without reason.

Do not invent new button styles.

Do not invent new spacing rules.

The application should feel designed by one team.

---

# Definition of Beautiful

A beautiful interface is:

Simple.

Predictable.

Responsive.

Readable.

Fast.

Confident.

The user should immediately trust the product.

If a design decision makes the interface more complicated without improving usability,

remove it.

Good design is not what you can add.

Good design is what you can remove while making the product even better.
