# Living Abroad Budgeting Tool – Product Requirements Document (PRD)

## Overview
An interactive budgeting web application designed for families living abroad (starting with Portugal under NHR). It helps users estimate and plan their monthly and yearly finances by inputting a mix of lifestyle costs, housing decisions, educational expenses, and diverse income streams (salaries, passive income, and one-off inflows). The tool aims to support confident financial planning while adjusting to life abroad.

## Goals
- Enable users to calculate realistic cost-of-living scenarios.
- Compare budget impacts with and without schooling costs.
- Factor in both recurring and one-off income sources.
- Allow dual partner inputs for income and expenses.
- Support flexible housing and transport choices.
- Give feedback on required gross income based on net target needs.

## Users
- Expats and digital nomads
- Families planning to relocate
- Couples evaluating lifestyle trade-offs abroad
- Long-term NHR-eligible professionals in Portugal

## Core Features

### 1. User Profile Input
- Country of residence (default: Portugal)
- Family size (number of adults + children, ages)
- Residency/tax regime (e.g., NHR in Portugal)
- Years planning to stay

### 2. Income Sources
- Partner 1: Monthly/Annual Salary
- Partner 2: Monthly/Annual Salary
- Passive Income Streams (rental, investments, etc.)
  - Type, frequency, and amount
- One-Off Inflows
  - Lump sums (e.g., bonuses, asset sales)
  - Recurring but infrequent (quarterly, yearly)

### 3. Housing Module
- Renting vs. Buying toggle
- If buying:
  - Purchase price range (€)
  - Down payment (% or fixed)
  - Mortgage term (years)
  - Interest rate (%)
- If renting:
  - Monthly rent
- Property taxes (IMI), insurance, maintenance

### 4. Transport Module
- Car ownership (Yes/No)
  - Purchase or lease
  - Vehicle budget (€)
  - Estimated monthly cost
- Public transport costs
- Fuel/charging costs
- Insurance & maintenance

### 5. Utilities & Essentials
- Electricity, water, heating
- Internet & mobile
- Groceries & household goods
- Optional line items for lifestyle (eating out, subscriptions)

### 6. Education
- Public vs Private toggle
- If private:
  - Annual tuition (€)
  - Monthly breakdown

### 7. Output / Summary Dashboard
- Total Monthly Expenses (with and without school)
- Total Annual Expenses
- Monthly & Annual Income Summary
- Disposable Income (monthly & yearly)
- "Felt Cost" of school (net after tax savings)
- Required gross income to sustain lifestyle
- Optional comparison to UK/US scenario (toggle)

---

# Non-Goals / Out of Scope
- Real-time investment tracking or advice.
- Automated bank account linking (initially).
- Tax filing or submission features.
- Complex financial modeling beyond budgeting scenarios.

---

# User Flow (High Level)
1.  User inputs profile details (family size, location, etc.).
2.  User inputs income streams (salaries, passive, one-off).
3.  User selects and inputs costs for Housing, Transport, Utilities, Education.
4.  User views the Summary Dashboard with calculated monthly/annual figures, disposable income, etc.
5.  (Optional) User explores add-on modules like Emergency Fund or Scenario Planning.

---

# Add-on Modules & Enhancements – Living Abroad Budgeting Tool

## 1. Emergency & Cash Flow Buffer Module
- Define monthly fixed + flexible expenses
- Emergency fund goals (3, 6, 12 months)
- "Runway meter" showing months of coverage
- Cash flow forecast for irregular payments

## 2. FX Sensitivity / Dual-Currency Impact
- Base currency selector
- Exchange rate override or slider
- Output adjusted by FX rate changes

## 3. Healthcare Planning
- Public/private coverage toggle per person
- Monthly premiums + OOP costs (GP, dental, etc.)
- Insurance deductible inputs

## 4. Savings & Pension Contributions
- Recurring savings goals
- Pension contributions (UK or PT)
- Optional net worth projection

## 5. Debt Management
- Define debts (loan type, balance, rate)
- Min. payment + custom overpayment
- Repayment timeframes and interest tracking

## 6. Scenario Planning
- Save/load custom lifestyle scenarios
- Adjust income, expenses, housing, school, etc.
- Compare net impact across plans

## 7. Alerts & Planning Nudges (Stretch)
- Budget alerts: "Your cash buffer is low"
- FX volatility warnings
- Goal achievement nudges

---

# Data Model (High Level - Conceptual)
- **User Profile:** `familySize`, `location`, `taxRegime`, `stayDuration`
- **Income:** `partner1Salary`, `partner2Salary`, `passiveStreams[]`, `oneOffInflows[]`
- **Expenses:** `housing`, `transport`, `utilities`, `essentials`, `education` (each with detailed sub-fields like `rent`, `mortgageDetails`, `tuition`, etc.)
- **Scenario:** Contains snapshots of Profile, Income, and Expenses for comparison.

---

## Suggested Stack
- Frontend: React + TailwindCSS
- Backend: Node/Express or Vercel Serverless
- Storage: Firebase or local JSON
- Tax Logic: Python or TypeScript module
- AI: GPT-powered "what if" assistant

---

# Success Metrics
- Number of active users / scenarios saved.
- User feedback on accuracy and usefulness.
- Completion rate of the main budgeting flow.
- Positive reviews or recommendations.

---

# Risks and Mitigations
- **Complexity of Tax Logic:** Start with simplified NHR rules for Portugal, potentially abstracting tax calculation into a separate module for future expansion or refinement. (Mitigation: Phase implementation, clear documentation)
- **Accuracy of Estimates:** Provide clear labels and potentially info tooltips explaining assumptions for costs like utilities or maintenance. (Mitigation: User education, allow overrides)
- **Scope Creep:** Stick to core budgeting features for MVP, deferring complex add-ons. (Mitigation: Prioritize features based on PRD, use Task Master)

---

# Next Steps
- **Phase 1 (MVP):**
    - Implement Core Features 1-7 (User Profile, Income, Housing, Transport, Utilities, Essentials, Education).
    - Build the core calculation logic for the Summary Dashboard (Feature 8).
    - Basic UI implementation using React + TailwindCSS.
    - Simple data persistence (e.g., local storage or basic JSON structure).
- **Phase 2:**
    - Implement Data Storage (Feature 9 - Firebase/Cloud).
    - Develop selected Add-on Modules (e.g., Emergency Fund, Scenario Planning).
    - Refine UI/UX based on feedback.
    - Add optional UK/US comparison logic.
- Define detailed component structure for MVP features.
- Build interactive form flow for MVP.
- Integrate base calculators for MVP.
- Test with sample expat scenarios for Portugal NHR.

