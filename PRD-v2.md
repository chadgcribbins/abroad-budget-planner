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
- Currency Settings for Income:
  - The MVP will let users input a salary in GBP which the tool converts to EUR using an exchange rate input. Each income item can be tagged with a currency, and users can provide or adjust the exchange rate manually.

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

### 7. Healthcare Module (MVP)
- A dedicated healthcare module will be included in the MVP.
- Public/private coverage toggle per person (e.g., public for children, private for adults)
- Monthly premiums for private health insurance
- Expected out-of-pocket (OOP) costs for each family member (e.g., dental, vision, pediatric visits)
- Support for both individual and family plan structures
- Ability to enter known ongoing health conditions or additional care needs

### 8. Output / Summary Dashboard
- Total Monthly Expenses (with and without school)
- Total Annual Expenses
- Monthly & Annual Income Summary
- Disposable Income (monthly & yearly)
- "Felt Cost" of school (net after tax savings)
- Required gross income to sustain lifestyle
- Optional comparison to UK/US scenario (toggle)

---

# Add-on Modules & Enhancements – Living Abroad Budgeting Tool

## 1. Emergency & Cash Flow Buffer Module
- Define monthly fixed + flexible expenses
- Emergency fund goals (3, 6, 12 months)
- “Runway meter” showing months of coverage
- Cash flow forecast for irregular payments

## 2. FX Sensitivity / Dual-Currency Impact
- Base currency selector
- Exchange rate override or slider
- Output adjusted by FX rate changes

## 3. Healthcare Planning *(moved to Core Features)*

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

## Suggested Stack
- Frontend: React + TailwindCSS
- Backend: Node/Express or Vercel Serverless
- Storage: Firebase or local JSON
- Tax Logic: Python or TypeScript module
- AI: GPT-powered “what if” assistant

## Next Steps
- Define component structure
- Build interactive form flow
- Integrate base calculators
- Test with sample expat scenarios
