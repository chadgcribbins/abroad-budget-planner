import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import connectDB from '../../../lib/mongoose';
import Expense from '../../../models/Expense';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build the query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    // Future: Add userId filter when authentication is implemented
    // filter.userId = session.user.id;
    
    await connectDB();
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    // Return the expenses
    return NextResponse.json({ status: 'success', data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body.date || !body.amount || !body.category || !body.description || !body.currency) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Create a new expense object with timestamp
    const expense = await Expense.create({
      date: new Date(body.date),
      amount: Number(body.amount),
      category: body.category,
      description: body.description,
      currency: body.currency,
      // Future: Add userId when authentication is implemented
      // userId: session.user.id
    });
    
    // Return the new expense
    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Expense created successfully',
        data: expense
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the ID from the query string
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Missing expense ID' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Import ObjectId from mongodb
    const { ObjectId } = require('mongodb');
    
    // Delete the expense
    const result = await db.collection('expenses').deleteOne({
      _id: new ObjectId(id),
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Expense not found' },
        { status: 404 }
      );
    }
    
    // Return success
    return NextResponse.json({
      status: 'success',
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete expense' },
      { status: 500 }
    );
  }
} 