# RULES.md

# LeadFlow Development Rules

## Purpose

This document defines the non-negotiable development rules for every task performed on this project.

These rules always take priority over convenience.

The goal is to build a production-quality SaaS while minimizing unnecessary context usage, technical debt, and inconsistent code.

---

# Rule 1

Never scan the entire repository unless explicitly instructed.

---

# Rule 2

Read only the files necessary for the current task.

---

# Rule 3

If additional files are required, explain why before reading them.

---

# Rule 4

Never rewrite working code unless requested.

---

# Rule 5

Never remove functionality without approval.

---

# Rule 6

Never invent APIs.

Use only existing APIs or create clearly defined ones.

---

# Rule 7

Never invent database tables.

---

# Rule 8

Never invent environment variables.

---

# Rule 9

Ask before installing new dependencies.

---

# Rule 10

Prefer built-in libraries whenever practical.

---

# Rule 11

Avoid unnecessary npm packages.

---

# Rule 12

Keep dependencies minimal.

---

# Rule 13

Never duplicate code.

Extract reusable components.

---

# Rule 14

Prefer composition over duplication.

---

# Rule 15

Keep components focused.

One responsibility per component.

---

# Rule 16

Split large files into reusable modules.

---

# Rule 17

Avoid files exceeding roughly 250 lines whenever practical.

---

# Rule 18

Never create giant React components.

---

# Rule 19

Always use TypeScript.

---

# Rule 20

Avoid the "any" type.

---

# Rule 21

Use strict typing.

---

# Rule 22

Prefer interfaces for object structures.

---

# Rule 23

Use meaningful variable names.

---

# Rule 24

Avoid abbreviations.

---

# Rule 25

Keep naming consistent.

---

# Rule 26

Always handle loading states.

---

# Rule 27

Always handle empty states.

---

# Rule 28

Always handle error states.

---

# Rule 29

Never leave TODO comments unless requested.

---

# Rule 30

Never leave unfinished logic.

---

# Rule 31

Never ignore TypeScript errors.

---

# Rule 32

Never ignore ESLint errors.

---

# Rule 33

Never ignore build failures.

---

# Rule 34

Never suppress errors instead of fixing them.

---

# Rule 35

Prefer server components when possible.

---

# Rule 36

Use client components only when necessary.

---

# Rule 37

Keep React state minimal.

---

# Rule 38

Avoid unnecessary rerenders.

---

# Rule 39

Memoize expensive computations.

---

# Rule 40

Use reusable hooks.

---

# Rule 41

Keep business logic outside UI components.

---

# Rule 42

Keep utility functions inside lib/.

---

# Rule 43

Use feature-based organization.

---

# Rule 44

Never hardcode secrets.

---

# Rule 45

Use environment variables.

---

# Rule 46

Never expose API keys.

---

# Rule 47

Validate user input.

---

# Rule 48

Assume user input is malicious.

---

# Rule 49

Protect authenticated routes.

---

# Rule 50

Always verify permissions.

---

# Rule 51

Use Supabase Auth.

---

# Rule 52

Use Supabase Row Level Security.

---

# Rule 53

Avoid raw SQL unless necessary.

---

# Rule 54

Keep database queries efficient.

---

# Rule 55

Avoid duplicate queries.

---

# Rule 56

Never fetch unnecessary data.

---

# Rule 57

Paginate large datasets.

---

# Rule 58

Lazy-load expensive content.

---

# Rule 59

Optimize images.

---

# Rule 60

Keep bundle size small.

---

# Rule 61

Dark mode is mandatory.

---

# Rule 62

Responsive design is mandatory.

---

# Rule 63

Accessibility is required.

---

# Rule 64

Keyboard navigation should work.

---

# Rule 65

Maintain consistent spacing.

---

# Rule 66

Maintain consistent typography.

---

# Rule 67

Reuse design tokens.

---

# Rule 68

Animations must improve UX.

---

# Rule 69

Avoid distracting animations.

---

# Rule 70

Every page should look production-ready.

---

# Rule 71

Prefer shadcn/ui components.

---

# Rule 72

Customize components instead of replacing them.

---

# Rule 73

Keep color usage consistent.

---

# Rule 74

Avoid visual clutter.

---

# Rule 75

Always think mobile-first.

---

# Rule 76

Optimize for performance first.

---

# Rule 77

Write maintainable code.

---

# Rule 78

Prefer readability over cleverness.

---

# Rule 79

Comment only when necessary.

---

# Rule 80

Keep functions small.

---

# Rule 81

One function should solve one problem.

---

# Rule 82

Avoid nested logic.

---

# Rule 83

Prefer early returns.

---

# Rule 84

Avoid magic numbers.

---

# Rule 85

Extract constants.

---

# Rule 86

Avoid unnecessary abstractions.

---

# Rule 87

Do not optimize prematurely.

---

# Rule 88

Complete one feature before starting another.

---

# Rule 89

Never work on multiple unrelated tasks simultaneously.

---

# Rule 90

Finish the current milestone before introducing new features.

---

# Rule 91

Always explain architectural changes.

---

# Rule 92

Always preserve backwards compatibility when possible.

---

# Rule 93

Never break existing features.

---

# Rule 94

Test new functionality mentally before implementation.

---

# Rule 95

Review generated code before considering the task complete.

---

# Rule 96

If uncertain, ask for clarification instead of guessing.

---

# Rule 97

Respect the project architecture defined in MISSION.md and VISION.md.

---

# Rule 98

Treat every feature as production code.

---

# Rule 99

Minimize context usage.

Read only what is necessary.

---

# Rule 100

Build software that a real business would confidently pay to use.

Never produce tutorial-quality work.

---

# Rule 101

---

# Repository

Primary Repository

https://github.com/2ndaccforsmart-sys/leadflow

Every completed feature should be committed with a meaningful commit message.

Keep the main branch stable.

Prefer feature branches for larger features.