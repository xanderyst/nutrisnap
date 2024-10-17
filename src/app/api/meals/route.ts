import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Meal from '@/app/models/Meals';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log('in the post function');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { dishName, ingredients, totalNutrition, date } = await req.json();

    if (!dishName || !ingredients || !totalNutrition || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const loggedMeal = await Meal.create({
      userId,
      dishName,
      ingredients,
      totalNutrition,
      date
    });

    return NextResponse.json({ message: 'Meal logged successfully', meal: loggedMeal });
  } catch (error) {
    console.error('Error logging meal:', error);
    return NextResponse.json({ error: 'Error logging meal' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  console.log('get function is called');
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!userId || !date) {
    return NextResponse.json({ error: 'Missing userId or date' }, { status: 400 });
  }

  try {
    await dbConnect();

    const meals = await Meal.find({ userId, date });
    return NextResponse.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ error: 'Error fetching meals' }, { status: 500 });
  }
}
