# Living Abroad Budgeting Tool – Product Requirements Document (PRD)

## Overview

The **Living Abroad Budgeting Tool** is an interactive web application designed to help families relocating internationally model and plan their financial lives with confidence. Born from a specific and personal need — to support one family's move from the UK to Portugal under the Non-Habitual Resident (NHR) tax regime — this tool was created not just to solve an individual problem, but with a clear recognition of its broader relevance.

Over 1 million people have immigrated to Portugal in recent years, and the challenges of planning life abroad — managing housing decisions, navigating foreign tax systems, understanding schooling and healthcare costs, and aligning income from multiple sources — are shared by millions of expats globally.

This tool is intentionally grounded in solving one real problem deeply and practically. It allows users to input a mix of lifestyle costs, housing choices, educational expenses, and diverse income streams (salaries, passive income, and one-off inflows), while modeling them across currencies and tax regimes.

The initial version focuses on Portugal's NHR program, but its structure is designed to be fully country-agnostic — enabling future support for moves from any origin country to any destination. Our vision is to evolve this from a personal planning companion into a powerful, extensible budgeting platform for expats, digital nomads, and globally mobile families.

## Goals

The Living Abroad Budgeting Tool is designed to empower globally mobile families with clarity and confidence in their relocation decisions. The core goals of the tool are:

- **Solve Real Relocation Challenges**  
  Reflect the true planning needs of a family relocating internationally — housing, schooling, transportation, healthcare, utilities, and dual-income planning — using a highly realistic, data-driven approach.

- **Support Country-to-Country Scenario Modeling**  
  Allow users to plan their move from one country to another (e.g., UK → Portugal), with tailored modules for local cost assumptions, taxes, and currency conversion.

- **Enable Multi-Source Income Modeling**  
  Accommodate diverse income types including dual salaries, passive income (e.g., rental or investment income), and one-off inflows (bonuses, asset sales, relocation packages).

- **Deliver Personalization by Household Composition**  
  Tailor cost inputs and modules to reflect household specifics, including number of adults and children, children's ages (for school and childcare assumptions), and health considerations.

- **Quantify Trade-Offs Across Lifestyle Scenarios**  
  Help users understand the financial impact of key decisions — such as renting vs. buying, private vs. public schooling, or car ownership — through toggleable or side-by-side comparisons.

- **Clarify Required Gross Income**  
  Work backward from user expenses to calculate the pre-tax income needed to sustain their desired lifestyle, adjusted for tax regime and currency assumptions.

- **Enable 'Felt Cost' Understanding**  
  Help users see the real impact of post-tax spending (e.g., the pre-tax equivalent of private school fees) to support better financial decision-making.

- **Support Emergency & Risk Planning**  
  Allow users to model financial resilience (e.g., loss of one income, increased FX volatility, or unexpected costs) via a buffer or contingency module.

- **Balance Practical Use with Future Scalability**  
  Start as a deeply useful planning tool for one family, but with a modular, extensible architecture to grow into a multi-user platform supporting expats worldwide.

--

## Users
- Expats and digital nomads
- Families planning to relocate
- Couples evaluating lifestyle trade-offs abroad
- Long-term NHR-eligible professionals in Portugal

--

## User Flow

The Living Abroad Budgeting Tool guides users through a structured, modular budgeting experience. Each step builds on the previous, ultimately providing a personalized financial snapshot.

### 1. Onboarding
- Select **origin** and **destination** countries
- Automatically link **currencies** for both countries (e.g., GBP → EUR)
- Residency/tax regime selection (e.g., NHR for Portugal)
- Duration of planned stay (in years)
- App interface will show both currencies throughout (e.g., **€3,500** / £2,975), with destination currency bolded

### 2. Define Household
- Input number of people relocating
- Specify age group for each person:
  - Suggested groupings: Baby (0–3), Primary School (4–11), Secondary School (12–18), College (18–22), Young Adult (23–30), Adult (30–64), Retiring (65+), Live-in Grandparent
- Each age group dynamically impacts modules (e.g., school, healthcare, tax dependencies)

### 3. Add Income Sources
- Partner 1 & 2 salary inputs
  - Monthly or annual, gross or net
  - Currency auto-tagged from origin country
- Passive income
  - Add multiple income streams (e.g., rental, dividends)
  - For each: label, amount, frequency, currency
- One-off inflows
  - Bonus, asset sale, gift, inheritance
  - Add multiple line items with labels and timing
- Exchange rate
  - Pulled from trusted live API (with manual override option)
  - Applies across all non-destination income streams

### 4. Configure Housing
- Toggle: Renting or Buying
- If renting: monthly rent input
- If buying:
  - Purchase price, down payment, interest rate, loan term
  - Auto-calculate monthly mortgage
  - Include property tax, insurance, and estimated maintenance
- Breakdown shows housing costs in both currencies

### 5. Transportation Setup
- Car ownership toggle
  - Gas or Electric toggle (impacts running cost assumptions)
  - Purchase or lease amount
  - Monthly insurance, fuel/electricity, maintenance
- Public transport budget
  - Monthly passes or pay-as-you-go
- Ride-share/Taxi budget
  - Uber/Bolt/Taxi usage estimate
- **Mixed-mode budgeting** supported: own a car but still use other services occasionally

### 6. Enter Utility & Lifestyle Costs
- Estimate monthly cost for:
  - Electricity, water, heating
  - Internet & mobile
  - Groceries & household goods
- Optional line items for lifestyle (subscriptions, dining, childcare, cleaning help)
- Custom categories allowed

### 7. Add Education Costs
- Per-child schooling selection:
  - Public, Private, or Hybrid
  - Tuition input (monthly or annual)
- Additional school costs:
  - Uniforms, books, transport, extracurriculars
- Pre-primary childcare toggle and monthly cost
- Budget scales by age group logic

### 8. Configure Healthcare
- Per-person healthcare assumptions:
  - Public only, Private only, or **Hybrid (public with supplemental private coverage)**
- Input monthly premiums, expected out-of-pocket costs
- Optionally include known health conditions or needs
- Age group modifies base healthcare cost assumptions

### 9. Define Emergency Fund
- Target buffer (3, 6, 12 months of expenses)
- Cash on hand / savings input
- Runway meter shows how many months current reserves will last

### 10. Review Dashboard
- Monthly and yearly totals:
  - Expenses, Income, Disposable Income
- Required gross income to sustain lifestyle (reverse-calculated)
- “Felt cost” of schooling and healthcare (pre-tax equivalents)
- Toggle key decisions:
  - Rent vs. Buy
  - Private vs. Public school
  - With/without childcare
- Scenario compare: Current Plan vs. Lean Mode vs. Dream Mode
- All values shown in both destination and origin currency

### 11. Save or Export
- Save scenario to local device or future cloud option
- Export to PDF or CSV (stretch goal)

--

## Core Features

The Living Abroad Budgeting Tool is structured into modular feature areas that reflect the key components of a family's relocation planning.

### 1. User Profile & Household Setup
- Country of origin and destination (e.g., UK → Portugal)
- Residency/tax regime (e.g., NHR for Portugal)
- Family composition: adults, children (with ages)
- Planned duration of stay
- Base currency for planning (default: destination currency)

### 2. Income Sources
- Partner 1 & 2 salaries: input as gross or net, with currency tag
- Passive income: rental, investments, freelance, pension, etc.
- One-off inflows: bonuses, asset sales, relocation support
- Exchange rate input (manual): converts foreign incomes into base currency
- Simple tax logic (based on regime) calculates net take-home pay

### 3. Housing Module
- Toggle: Renting vs. Buying
- If renting: monthly rent
- If buying:
  - Purchase price, down payment, interest rate, term
  - Calculates mortgage payment
  - Adds property tax, insurance, and maintenance
- Shows monthly cost for each scenario

### 4. Transportation Module
- Toggle: Own a car? Yes/No
- Car purchase or lease amount
- Monthly fuel/electricity, insurance, maintenance
- Public transport budget (metro, bus, rail passes)
- Ride-share/Taxi budget (e.g., Uber, Bolt)
- Supports **mixed-mode transport**: even with a car, users can budget for supplemental modes

### 5. Utilities, Shopping & Lifestyle Costs
- Monthly estimates:
  - Electricity, water, heating
  - Internet & mobile
  - Groceries & household goods
- Shopping & irregular purchases:
  - Furniture, clothing, electronics, kids' gear
- Optional line items for:
  - Subscriptions
  - Gifts & birthdays
  - Pet care
  - Home services (e.g., cleaners, babysitters)
  - Holidays & travel (monthly average)
- Custom categories encouraged

### 6. Education Module
- Per-child toggle: Public vs. Private school
- Private tuition: annual or monthly input
- Optional: Uniforms, books, extracurriculars
- Early years childcare for children under school age
- Total monthly and yearly education cost shown

### 7. Healthcare Module (MVP)
- Public/private insurance toggle per person
- Monthly premiums + expected OOP costs
- Coverage assumptions (e.g., family plan, dental, vision)
- Supports input for ongoing medical conditions or extra care needs

### 8. Emergency & Cash Flow Buffer
- Emergency fund target (e.g., 3/6/12 months of expenses)
- Runway meter: how long user could sustain lifestyle without income
- Models impact of temporary income loss or unexpected costs

### 9. FX Sensitivity (MVP Scope)
- Manual exchange rate input or slider (e.g., GBP → EUR)
- Scenario toggling: "What if the pound drops by 10%?"
- Dynamically updates summary output based on rate changes

### 10. Lifestyle & Discretionary Costs
Capture the everyday and occasional costs that define real-life living, beyond basic utilities.
- **General Shopping Spend**
  - Monthly or annual estimate
  - Covers clothing, kids' extras, gadgets, gifts, one-off purchases
- **One-Off Big Purchases**
  - Optional entries (e.g., kayak, desk, phone)
  - Can be entered as annual cost or spread monthly
- **Travel & Holidays**
  - Estimated annual travel budget (divided monthly)
  - Includes flights, accommodation, family visits
- **Home Services**
  - Monthly estimate for cleaning, babysitting, gardening, pet care
- **Contingency & Miscellaneous**
  - A flexible buffer for unknowns and spontaneous costs
  - User-defined or defaulted to a % of lifestyle total

### 11. Summary Dashboard
- Monthly and annual expenses
- Monthly and annual income
- Disposable income: income minus expenses
- Required gross income to sustain lifestyle (calculated backward)
- "Felt cost" of schooling (post-tax burden)
- Quick toggle: With vs. Without Private School
- Optional: compare to home country scenario

---

## Conceptual Data Model

The Living Abroad Budgeting Tool operates on a modular, user-configurable data model. Each major category of expense or income is treated as a structured object, enabling customization, repeatability, and comparison across scenarios.

--

### Core Entities

#### 1. `UserProfile`
- `origin_country`
- `destination_country`
- `residency_status` (e.g., NHR)
- `planning_horizon_years`

#### 2. `Person`
- `age`
- `age_group` (baby, primary, secondary, college, etc.)
- `role` (partner, child, grandparent)
- `healthcare_type` (public / private / hybrid)
- `schooling_type` (if applicable)

#### 3. `IncomeSource`
- `label`
- `type` (salary, passive, one-off)
- `owner` (linked to Person)
- `amount`
- `currency`
- `frequency` (monthly, annually, one-time)
- `exchange_rate` (if different currency)
- `is_taxable`

#### 4. `Housing`
- `mode` (rent / buy)
- If buying:
  - `purchase_price`, `down_payment_pct`, `interest_rate`, `loan_term`
- If renting:
  - `monthly_rent`
- `property_tax`, `insurance`, `maintenance_estimate`

#### 5. `Transport`
- `owns_car` (boolean)
- `car_type` (gas/electric)
- `car_purchase_price` or `monthly_lease_cost`
- `monthly_fuel_or_charging`, `insurance`, `maintenance`
- `public_transport_budget`
- `rideshare_budget`

#### 6. `UtilitiesAndEssentials`
- Core: electricity, water, internet, groceries
- Custom lifestyle items (label + monthly amount)

#### 7. `Education`
- Per-child linkage
- `school_type`, `tuition`, `extras`
- `early_years_cost` (if applicable)

#### 8. `Healthcare`
- Per-person linkage
- `coverage_type` (public / private / hybrid)
- `monthly_premiums`, `oop_costs`, `additional_needs`

#### 9. `SavingsAndPensions`
- `savings_contribution` (monthly or annual)
- `pension_contribution` (optional)
- `goal_labels` (e.g., "house deposit", "retirement")

#### 10. `EmergencyBuffer`
- `target_months`
- `current_savings`
- `runway_months_covered`

#### 11. `FXSettings`
- `origin_currency`
- `destination_currency`
- `current_rate` (fetched daily from API)
- `override_rate` (optional)

#### 12. `Scenario`
- `label` (e.g., "Baseline", "Private School Plan")
- Full snapshot of all above entities
- Can be cloned and modified to explore alternatives

#### 13. `SummaryOutput`
- `monthly_income_total`
- `monthly_expenses_total`
- `disposable_income`
- `required_gross_income`
- `felt_cost_school`, `felt_cost_healthcare`
- `warnings`, `surplus`, `shortfall`

--

## Phased Roadmap

This roadmap prioritizes a stable, usable MVP focused on solving one real-world use case — the Cribbins family's move to Portugal under NHR — while structuring development to support long-term growth into a country-agnostic platform.

### Phase 1: MVP (April–May 2025)
✅ Built for internal use  
✅ No login, no sharing — local, single-session app  
✅ All financial inputs manually entered  
✅ Portugal + NHR assumptions only  
✅ Core modules:
- Household Setup
- Income (GBP/EUR conversion)
- Housing (buy/rent)
- Transport (incl. electric vehicle toggle)
- Education (public/private)
- Healthcare (public/private/hybrid)
- Utilities & Essentials
- Emergency Buffer
- FX Sensitivity
- Dashboard Summary
- Scenario Save/Clone

### Phase 2: Post-MVP Refinements (June–July 2025)
🔁 Improved usability and repeatability  
🔁 Cloud save or persistent local storage  
🔁 Export to PDF or CSV  
🔁 Region-based cost templates (e.g., Lisbon default utilities)  
🔁 Simple tooltip documentation for assumptions  
🔁 Multi-person use (partner toggle)

### Phase 3: Public Prototype (August 2025+)
🚀 Launch to limited user group  
🚀 UI polish and onboarding experience  
🚀 Support additional destination countries (Spain, Italy, France)  
🚀 Add tax rule modules for each  
🚀 Feedback loop to guide prioritization

### Phase 4: Stretch Enhancements (2025+)
💡 AI cost assistant (e.g., "grocery budget in Cascais is usually €X–Y")  
💬 AI nudges: "Did you remember school transport costs?"  
🔁 FX rate trends & volatility alerts  
📊 Dual-scenario overlay comparison  
🧑‍🤝‍🧑 Multi-user households with shared access  
🌍 Country pair selector: move from any → any  
🔐 Account system for saving multiple plans

--

## Success Metrics

The success of the Living Abroad Budgeting Tool in its initial phase is defined by its ability to provide clarity, confidence, and actionable insight to users (starting with the creator and family). As it matures, success will be measured through both qualitative feedback and quantitative adoption.

### MVP Success (Personal/Functional)
- ✅ Successfully models the family's projected cost of living in Portugal
- ✅ Allows side-by-side scenario comparisons with ease
- ✅ Feels intuitive and simple enough to revisit and update monthly
- ✅ Produces outputs that are "trusted enough" to use for real planning and financial decision-making
- ✅ Makes it easier to coordinate budgeting discussions with a partner or advisor

### Post-MVP / Public Use Success
- 📈 At least 5–10 other families use it and say it's helpful within the first 3 months
- 💬 At least 3 families report making a different or more confident decision as a result of using it
- 💡 Early users independently ask "can I save my version" or "can I plan for Spain?" — showing demand for persistence and internationalization
- ❤️ NPS-style feedback score of 8+ when asked "Would you recommend this to another family moving abroad?"

### Stretch Metrics (SaaS Readiness)
- 50+ unique users engage in scenario planning mode
- 3+ requests for added destinations (beyond Portugal)
- 1+ unsolicited offers to pay or donate
- Scenario export or sharing feature used by >25% of users

--

## Risks & Mitigations

Identifying potential risks early allows us to proactively design around complexity, manage expectations, and make development trade-offs consciously.

### 1. 🔁 Exchange Rate Volatility
**Risk:** Real-world exchange rates fluctuate daily, which could significantly affect cost projections and confuse users.

**Mitigation:**
- Use a reliable API (e.g., ECB or Open Exchange Rates) for daily rate fetching
- Allow manual override for planning under custom assumptions
- Always display both currencies for transparency

---

### 2. ⚖️ Tax Modeling Oversimplification
**Risk:** Even simplified tax models (like NHR in Portugal) can mislead if not well-documented or properly constrained.

**Mitigation:**
- Stick to known, high-confidence tax scenarios (e.g., fixed 20% NHR employment rate)
- Clearly state assumptions in UI ("This is a planning tool, not a tax calculator")
- Allow manual override for net income when unsure

---

### 3. 🧠 Misuse Due to Overconfidence
**Risk:** Users may treat the tool as a definitive source for planning, overlooking nuances like regional school differences or utility spikes.

**Mitigation:**
- Flag all major outputs as "planning guidance only"
- Use tooltips and helper text to explain variability
- Allow cost ranges (min–max sliders) in future versions

---

### 4. 💸 Cost Underestimation
**Risk:** Users might under-budget certain categories (e.g., healthcare or schooling) and get a falsely optimistic picture.

**Mitigation:**
- Pre-load typical regional defaults or heuristics
- AI module (later) could surface "You might be missing X"
- Consider showing percentile ranges (e.g., average grocery cost in Lisbon)

---

### 5. 📦 MVP Feature Bloat
**Risk:** The product becomes too complex in MVP stage and never ships.

**Mitigation:**
- Lock features to those required for Chad's use case
- Phase everything else (e.g., AI, sharing, export, account management)
- Maintain strict MVP/non-MVP boundary in dev

---

### 6. 👫 Partner Alignment
**Risk:** Financial tools often create friction if only one partner drives them or if assumptions aren't shared.

**Mitigation:**
- Output dashboard should be easy to screen-share, export, or review together
- Scenarios can reflect "my plan" vs. "our plan" vs. "dream plan" to open up discussion
