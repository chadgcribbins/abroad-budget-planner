export interface OneOffPurchase {
  id: string;
  description: string; // e.g., 'New Laptop', 'Annual Kayak Club Fee'
  amount: number;
  year?: number; // Optional: Target year
}

export interface HomeServiceCost {
  id: string;
  type: string; // e.g., 'Cleaner', 'Babysitter', 'Gardener', 'Pet Care'
  monthlyCost: number;
}

export interface Lifestyle {
  monthlyGeneralShopping?: number; // Groceries separate in Utilities
  monthlyDiningOutEntertainment?: number; // Added for clarity
  monthlyMembershipsSubscriptions?: number; // Gym, streaming etc. Added for clarity
  monthlyPersonalCare?: number; // Haircuts, toiletries etc. Added for clarity
  monthlyHobbiesKidsExtras?: number; // Existing field refined
  oneOffPurchases: OneOffPurchase[];
  annualTravelHolidayBudget?: number;
  homeServices: HomeServiceCost[];
  monthlyContingencyAmount?: number; // Fixed amount
  contingencyPercentage?: number; // % of other lifestyle costs
} 