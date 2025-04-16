import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongoose';
import Expense from '../../../../models/Expense';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Future: Check if the expense belongs to the current user
    // const expense = await Expense.findOne({ _id: id, userId: session.user.id });
    
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    await Expense.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await connectDB();
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ expense }, { status: 200 });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expense' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate required fields
    const { date, amount, category, description, currency } = body;
    
    if (!date || !amount || !category || !description || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    // Future: Check if the expense belongs to the current user
    // if (expense.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        date: new Date(date),
        amount,
        category,
        description,
        currency,
      },
      { new: true }
    );
    
    return NextResponse.json({ expense: updatedExpense }, { status: 200 });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
} 