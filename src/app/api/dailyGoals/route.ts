import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user.dailyGoals);
  } catch (error) {
    console.error('Error fetching daily goals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dailyGoals = await request.json();
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { dailyGoals } },
      { new: true, upsert: true }
    );
    return NextResponse.json(user.dailyGoals);
  } catch (error) {
    console.error('Error updating daily goals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
