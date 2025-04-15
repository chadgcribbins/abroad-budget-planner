# Living Abroad Budgeting Tool – Product Requirements Document (PRD-v3)

## Overview

The Living Abroad Budgeting Tool is an interactive web application designed to help families relocating internationally model and plan their financial lives with confidence. Born from a specific and personal need—to support one family's move from the UK to Portugal under the Non-Habitual Resident (NHR) tax regime—this tool was created not just to solve an individual problem, but with a clear recognition of its broader relevance.

Over 1 million people have immigrated to Portugal in recent years, and the challenges of planning life abroad—managing housing decisions, navigating foreign tax systems, understanding schooling and healthcare costs, and aligning income from multiple sources—are shared by millions of expats globally.

This tool is intentionally grounded in solving one real problem deeply and practically. It allows users to input a mix of lifestyle costs, housing choices, educational expenses, and diverse income streams (salaries, passive income, and one-off inflows), while modeling them across currencies and tax regimes.

The initial version focuses on Portugal's NHR program, but its structure is designed to be fully country-agnostic—enabling future support for moves from any origin country to any destination. Our vision is to evolve this from a personal planning companion into a powerful, extensible budgeting platform for expats, digital nomads, and globally mobile families.

## Goals

- Solve real relocation challenges through realistic planning modules
- Support modeling of moves between any two countries
- Allow income modeling from diverse sources and currencies
- Adapt budgets to family composition and lifecycle stages
- Quantify trade-offs (e.g., rent vs. buy, school choices)
- Reverse-calculate required gross income
- Communicate the "felt cost" of large expenses after tax
- Promote confident, clear-headed planning for families in transition
- Start personal and scale through modularity

## Users

- Expat families relocating abroad
- Digital nomads under local or special tax regimes
- Dual-income households balancing currencies
- Families with school-age children (public vs. private decisions)
- Users with multi-stream income or passive income
- Couples planning longer-term foreign residency (e.g., 5–10+ years)

## Core Features

### 1. User Profile & Household Setup

- Origin and Destination Country
- Residency/tax regime (e.g., NHR toggle)
- Number of people relocating + age groups (Baby, Primary, Secondary, College, Adult, Parent, Grandparent)
- Duration of stay (in years)
- All currency outputs shown as: €123 / £105.23, with destination currency in bold

### 2. Income

- Partner 1 & 2: Annual or Monthly Salary (input in any currency)
- Passive Income (rental, investment, etc.)
  - Type, amount, frequency (monthly, quarterly, yearly)
  - Multiple line items
- One-Off Inflows
  - Annual bonuses, asset sales, lump sums
  - Recurring but infrequent items
- Currency exchange rate input (pulled from CurrencyAPI, editable override)
- FX calculations shown clearly

### 3. Housing

- Rent or Buy toggle
- If Buying:
  - Property Price
  - Down Payment (fixed or %)
  - Mortgage Term (years), Interest Rate
  - Monthly Mortgage Output
- If Renting:
  - Monthly rent
- Annual Maintenance / Insurance / Property Tax fields
- Option to model "starter home" and later upgrade

### 4. Transportation

- Car Ownership (Yes/No)
- Type: Electric or Gas
- Purchase / Lease toggle
- Car Cost input
- Monthly charging or fuel
- Insurance / Maintenance
- Public Transport + Ride-share (monthly average)
- Travel Card Costs (if relevant)

### 5. Lifestyle & Discretionary Costs

- General Shopping Spend (monthly or annual input)
- Includes kids' extras, gifts, clothing, hobbies
- One-Off Big Purchases
  - Annual kayak, laptop, etc.
- Travel & Holidays
  - Annual travel budget, broken into monthly
- Home Services
  - Cleaner, Babysitter, Gardening, Pet care
- Contingency / Unknowns field
  - Fixed or % of lifestyle total

### 6. Utilities

- Electricity, Water, Gas/Heating
- Internet & Mobile
- Monthly average

### 7. Education

- Public or Private toggle
- If Private:
  - Annual tuition
  - Monthly payment breakdown
- Extra School Costs (books, uniforms, activities)

### 8. Healthcare

- Type: Public, Private, or Hybrid (per person)
- Monthly Premium
- Estimated OOP (GP visits, dental, prescriptions)
- Known recurring medical costs

### 9. Emergency Buffer

- Target # of months of coverage
- Fixed expenses captured from above
- Current reserve
- Runway meter visual: X months of financial runway

### 10. FX Sensitivity

- Exchange rate toggle (manual override or API fed)
- FX movement sliders or % shock simulation
- Dual-currency output across modules (home vs. destination currency)

### 11. Dashboard Summary

- Total Monthly and Annual Income & Expenses
- Disposable Income projection
- Required Gross Income to meet lifestyle target
- Felt Cost of Private School (factoring in tax savings from NHR)
- Rent vs. Buy Comparison
- Clone & Save Scenario

## Non-Goals / Out of Scope (MVP)

- Real-time bank integrations or account syncing
- Legal visa/tax filing calculators
- Multi-destination modeling
- User login or multi-user editing
- AI-powered suggestions (Post-MVP)

## User Flow

1. Start with Country From → To selector
2. Enter family size + roles (e.g., 2 adults, 3 kids, age groups)
3. Choose residency regime (e.g., NHR)
4. Add income sources (salaries, passive, one-offs)
5. Add housing setup (rent or buy)
6. Add transport mode (car/public/mix)
7. Add lifestyle + utility costs
8. Add education & healthcare settings
9. Define emergency savings
10. Review FX sensitivity
11. See full summary dashboard
12. Save & Clone scenario

## Conceptual Data Model

- **Household**: Adults, children, age groupings
- **Income**: Salaries, passive income, one-offs, FX
- **Housing**: Rent/buy fields
- **Transport**: Vehicle type, public costs
- **Lifestyle**: Shopping, discretionary, services
- **Education**: Tuition, extras
- **Healthcare**: Coverage, premiums, out-of-pocket
- **EmergencyBuffer**: Runway goals
- **FX**: Settings, rate, override
- **Summary**: Income vs. Expense, required gross

## Success Metrics

- **MVP**: Cribbins family uses tool to budget Portugal move
- **Post-MVP**: 5–10 early adopter expat families onboard
- **Alpha Launch**: 50+ user scenarios saved, 3+ testimonials
- **Stretch**: Design-to-code integration demo (Figma → Cursor)

## Risks & Mitigations

- FX rates shift → Live FX feed, override input
- School costs fluctuate → Updateable fields, not static database
- Tax complexity → Use simplified assumptions, flag edge cases
- Scope bloat → MVP discipline, save stretch features for roadmap
- UX drift → Maintain strong design-to-dev link (Figma + MCP)

## Roadmap & Phases

### Phase 1: MVP
- Static site or local web tool
- Portugal/NHR only
- Manual entry for all fields
- Summary dashboard
- Single scenario at a time

### Phase 2: Post-MVP
- Save/load scenarios
- Multiple scenario comparison
- UX enhancements (e.g., input nudges, clarity)
- Basic tax logic for UK, US

### Phase 3: Alpha Launch
- Add destination countries (Spain, France, Italy)
- Support logins or save to cloud
- Public-facing site with examples
- Early SEO & content marketing

### Phase 4: Stretch Enhancements
- AI planning assistant (copilot)
- Live FX alerts
- Dual-income partner logic
- Public templates per destination
- Visual overlays for planning differences

## Enhancements & Add-ons

### 1. Scenario Planner Enhancements
- Save multiple labeled scenarios (Baseline, Stretch, Worst Case)
- Compare side-by-side

### 2. AI Copilot
- Suggest budget lines based on household profile
- Surface local benchmarks (e.g., Lisbon average rent for family of 5)
- Nudge for missing or unusual inputs

### 3. Region-Based Defaults
- Templates by city/region
- Editable after initial setup

### 4. Exporting & Sharing
- Export to PDF, CSV
- Shareable links or viewer mode for partner/advisor

### 5. Advanced FX Tools
- Volatility band triggers
- Historical FX data view
- Flag deviations from base assumption

### 6. Alerts & Goals
- Budget vs. actual tracking (manual for now)
- Nudges for financial buffer drop
- Timeline planning (e.g., move date triggers school payments)

### 7. Mobile UX / Voice Input
- PWA support
- Whisper voice commands ("add €5K in bonuses in June")
- Simplified UI toggle for on-the-go edits

## Suggested Stack & Architecture

### Modern Creator Pipeline (MCP)
- Cursor IDE (Windsurf + AI pair programming)
- TaskMaster AI for PRD decomposition
- Whisper voice input layer
- Figma for design system + journey screens
- Vercel for hosting

### Frontend
- React + Next.js
- TailwindCSS + DaisyUI

### Backend (optional in MVP)
- MongoDB Atlas
- API Routes (Next.js) or serverless functions
- Upstash (Redis) for fast caching

### Auth / Integrations (Stretch)
- AuthJS (authentication)
- Stripe (monetization, subscriptions)
- Resend (email workflows)
- Capacitor (mobile app packaging)
- MUX or similar for help videos

### FX & Tax
- CurrencyAPI (exchange rates)
- Simple NHR Tax Config (Portugal-only for MVP)

### DevOps
- GitHub (repo, CI)
- Vercel (deploy previews)
- APIdog (testing/mocking)
