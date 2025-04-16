import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import Budget from '../../../models/Budget';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Future: Add userId filter when authentication is implemented
    // const budget = await Budget.findOne({ userId: session.user.id });
    
    const budget = await Budget.findOne().sort({ createdAt: -1 });
    
    if (!budget) {
      return NextResponse.json(
        { message: 'No budget found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ budget }, { status: 200 });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      destination,
      startDate,
      endDate,
      accommodation,
      food,
      transportation,
      activities,
      miscellaneous,
      currency
    } = body;
    
    if (!destination || !startDate || !endDate || 
        accommodation === undefined || food === undefined || 
        transportation === undefined || activities === undefined || 
        miscellaneous === undefined || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Create new budget
    const budget = await Budget.create({
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      accommodation,
      food,
      transportation,
      activities,
      miscellaneous,
      currency,
      // Future: Add userId when authentication is implemented
      // userId: session.user.id
    });
    
    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      id,
      destination,
      startDate,
      endDate,
      accommodation,
      food,
      transportation,
      activities,
      miscellaneous,
      currency
    } = body;
    
    if (!id || !destination || !startDate || !endDate || 
        accommodation === undefined || food === undefined || 
        transportation === undefined || activities === undefined || 
        miscellaneous === undefined || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const budget = await Budget.findById(id);
    
    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    // Future: Check if the budget belongs to the current user
    // if (budget.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        accommodation,
        food,
        transportation,
        activities,
        miscellaneous,
        currency
      },
      { new: true }
    );
    
    return NextResponse.json({ budget: updatedBudget }, { status: 200 });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
} 