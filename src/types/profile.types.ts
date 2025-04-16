import { Household } from './household.types';
import { Income } from './income.types';
import { Housing } from './housing.types';
import { Transport } from './transport.types';
import { Lifestyle } from './lifestyle.types';
import { Utilities } from './utilities.types';
import { Education } from './education.types';
import { Healthcare } from './healthcare.types';
import { EmergencyBuffer } from './emergency.types';
import { FXSettings } from './fx.types';

export interface BudgetProfile {
  // Optional metadata for the profile itself
  profileId?: string; // Unique identifier for this budget scenario
  profileName?: string; // User-defined name, e.g., "Baseline Portugal Move"
  createdAt?: Date;
  updatedAt?: Date;

  // Core Data Models
  household: Household;
  income: Income;
  housing: Housing;
  transport: Transport;
  lifestyle: Lifestyle;
  utilities: Utilities;
  education: Education;
  healthcare: Healthcare;
  emergencyBuffer: EmergencyBuffer;
  fxSettings: FXSettings;

  // We might add derived summary data later, but keep the core profile clean for now
  // summary?: BudgetSummary; // See next steps
} 