import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongoose';
import Budget from '../../../../models/Budget';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    return NextResponse.json({ budget }, { status: 200 });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    await Budget.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: 'Budget deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
} 