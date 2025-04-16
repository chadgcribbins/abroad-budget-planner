import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import Expense from '../../../models/Expense';
import Budget from '../../../models/Budget';

// Define the structure for budget comparison
interface BudgetCategoryComparison {
  budget: number;
  spent: number;
}

interface BudgetComparison {
  accommodation: BudgetCategoryComparison;
  food: BudgetCategoryComparison;
  transportation: BudgetCategoryComparison;
  activities: BudgetCategoryComparison;
  miscellaneous: BudgetCategoryComparison;
  [key: string]: BudgetCategoryComparison;
}

interface ExpenseByCategoryResult {
  _id: string;
  total: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Create a filter object for the query
    const filter: any = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    // Future: Add userId filter when authentication is implemented
    // filter.userId = session.user.id;
    
    await connectDB();
    
    // Get the latest budget
    const budget = await Budget.findOne().sort({ createdAt: -1 });
    
    // Get expenses by category
    const expensesByCategory = await Expense.aggregate<ExpenseByCategoryResult>([
      { $match: filter },
      { $group: { 
        _id: '$category', 
        total: { $sum: '$amount' } 
      }},
      { $sort: { total: -1 } }
    ]);
    
    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: { 
        _id: null, 
        total: { $sum: '$amount' } 
      }}
    ]);
    
    // Get expenses by date
    const expensesByDate = await Expense.aggregate([
      { $match: filter },
      { $group: { 
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$date' } 
        }, 
        total: { $sum: '$amount' } 
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Prepare budget comparison data
    let budgetComparison: BudgetComparison | null = null;
    if (budget) {
      budgetComparison = {
        accommodation: {
          budget: budget.accommodation,
          spent: 0
        },
        food: {
          budget: budget.food,
          spent: 0
        },
        transportation: {
          budget: budget.transportation,
          spent: 0
        },
        activities: {
          budget: budget.activities,
          spent: 0
        },
        miscellaneous: {
          budget: budget.miscellaneous,
          spent: 0
        }
      };
      
      // Update with actual expenses
      expensesByCategory.forEach((item: ExpenseByCategoryResult) => {
        if (budgetComparison && item._id in budgetComparison) {
          budgetComparison[item._id].spent = item.total;
        }
      });
    }
    
    return NextResponse.json({
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
      expensesByCategory,
      expensesByDate,
      budgetComparison,
      budget
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 