import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get the budgets from the database
    const budgets = await db.collection('budgets').find({}).toArray();
    
    // Return the budgets
    return NextResponse.json({ status: 'success', data: budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body.destination || !body.currency || !body.categories) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Create a new budget object with timestamp
    const budget = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert the budget into the database
    const result = await db.collection('budgets').insertOne(budget);
    
    // Return the new budget
    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Budget created successfully',
        data: { ...budget, _id: result.insertedId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create budget' },
      { status: 500 }
    );
  }
} 