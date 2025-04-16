import { Schema, model, models, Document, Model } from 'mongoose';

// Define interface for Expense document
export interface IExpense extends Document {
  date: Date;
  amount: number;
  category: 'accommodation' | 'food' | 'transportation' | 'activities' | 'miscellaneous';
  description: string;
  currency: string;
  userId?: string; // For future authentication implementation
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const ExpenseSchema = new Schema<IExpense>(
  {
    date: { 
      type: Date, 
      required: [true, 'Please provide a date for the expense'],
      default: Date.now 
    },
    amount: { 
      type: Number, 
      required: [true, 'Please provide an amount for the expense'],
      min: [0, 'Amount cannot be negative'] 
    },
    category: { 
      type: String, 
      required: [true, 'Please provide a category for the expense'],
      enum: {
        values: ['accommodation', 'food', 'transportation', 'activities', 'miscellaneous'],
        message: '{VALUE} is not a valid category'
      }
    },
    description: { 
      type: String, 
      required: [true, 'Please provide a description for the expense'],
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    currency: { 
      type: String, 
      required: [true, 'Please provide a currency for the expense'],
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
const Expense: Model<IExpense> = models.Expense || model<IExpense>('Expense', ExpenseSchema);

export default Expense; 