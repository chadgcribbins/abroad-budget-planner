import { Schema, model, models, Document, Model } from 'mongoose';

// Define interface for Budget document
export interface IBudget extends Document {
  destination: string;
  startDate: Date;
  endDate: Date;
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  currency: string;
  userId?: string; // For future authentication implementation
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const BudgetSchema = new Schema<IBudget>(
  {
    destination: { 
      type: String, 
      required: [true, 'Please provide a destination'],
      trim: true,
      maxlength: [100, 'Destination cannot be more than 100 characters']
    },
    startDate: { 
      type: Date, 
      required: [true, 'Please provide a start date']
    },
    endDate: { 
      type: Date, 
      required: [true, 'Please provide an end date']
    },
    accommodation: { 
      type: Number, 
      required: [true, 'Please provide an accommodation budget'],
      min: [0, 'Budget amount cannot be negative'] 
    },
    food: { 
      type: Number, 
      required: [true, 'Please provide a food budget'],
      min: [0, 'Budget amount cannot be negative'] 
    },
    transportation: { 
      type: Number, 
      required: [true, 'Please provide a transportation budget'],
      min: [0, 'Budget amount cannot be negative'] 
    },
    activities: { 
      type: Number, 
      required: [true, 'Please provide an activities budget'],
      min: [0, 'Budget amount cannot be negative'] 
    },
    miscellaneous: { 
      type: Number, 
      required: [true, 'Please provide a miscellaneous budget'],
      min: [0, 'Budget amount cannot be negative'] 
    },
    currency: { 
      type: String, 
      required: [true, 'Please provide a currency'],
      enum: {
        values: ['USD', 'EUR', 'GBP'],
        message: '{VALUE} is not a supported currency'
      },
      default: 'USD'
    },
    userId: { 
      type: String,
      // This will be required once authentication is implemented
      // required: [true, 'User ID is required']
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Create or retrieve the model
const Budget: Model<IBudget> = models.Budget || model<IBudget>('Budget', BudgetSchema);

export default Budget; 