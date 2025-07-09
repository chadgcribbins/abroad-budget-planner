# Task #7 Implementation Plan - OpenExchangeRates API Integration

## Overview
Implement currency exchange rate functionality using the OpenExchangeRates API to support real-time currency conversions throughout the application.

## Objectives
1. Integrate with OpenExchangeRates API
2. Fetch and cache exchange rates
3. Update FX store with current rates
4. Implement currency conversion utilities
5. Add UI components for FX display
6. Handle API errors and rate limits

## Implementation Steps

### 1. API Integration Setup
- [ ] Register for OpenExchangeRates API key
- [ ] Create environment variable for API key
- [ ] Implement API client with rate limiting
- [ ] Add types for API responses

### 2. FX Service Layer
- [ ] Create service for fetching exchange rates
- [ ] Implement caching mechanism (1 hour cache)
- [ ] Add fallback rates for offline mode
- [ ] Handle API errors gracefully

### 3. Store Integration
- [ ] Update FX store with fetched rates
- [ ] Add actions for refreshing rates
- [ ] Implement rate override functionality
- [ ] Add loading and error states

### 4. UI Components
- [ ] Create FX rate display component
- [ ] Add manual rate override modal
- [ ] Implement currency selector dropdown
- [ ] Add last updated timestamp display

### 5. Integration Points
- [ ] Update scenario creation to use FX rates
- [ ] Add currency conversion to all monetary displays
- [ ] Implement dual currency display format
- [ ] Add FX refresh button to UI

### 6. Error Handling
- [ ] Handle API rate limits (1000 req/month free tier)
- [ ] Implement offline fallback
- [ ] Add user notifications for errors
- [ ] Log errors for debugging

## Technical Specifications

### API Endpoint
```
https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID
```

### Response Format
```json
{
  "disclaimer": "...",
  "license": "...",
  "timestamp": 1609459200,
  "base": "USD",
  "rates": {
    "EUR": 0.813399,
    "GBP": 0.732398,
    "JPY": 103.25,
    ...
  }
}
```

### Store Structure
```typescript
interface FXState {
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  rateOverrides: Record<string, number>;
}
```

## File Structure
```
src/
├── services/
│   └── openExchangeRates.ts    # API client
├── store/slices/
│   └── fxSlice.ts              # Enhanced FX store
├── components/
│   ├── fx/
│   │   ├── FXRateDisplay.tsx  # Rate display component
│   │   ├── CurrencySelector.tsx # Currency dropdown
│   │   └── RateOverrideModal.tsx # Manual override
│   └── ui/
│       └── DualCurrencyAmount.tsx # Formatted amount display
└── utils/
    └── currency.ts             # Conversion utilities
```

## Success Criteria
- [ ] Exchange rates fetch successfully from API
- [ ] Rates are cached for 1 hour minimum
- [ ] All monetary values show dual currency
- [ ] Manual rate override works
- [ ] Offline mode with fallback rates
- [ ] No API rate limit violations
- [ ] Clean error handling and user feedback