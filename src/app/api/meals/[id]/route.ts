import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Meal from '@/app/models/Meals';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { userId } = auth();
    console.log('in the post function');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log('delete function');
    console.log('this is the id', id);
    try {
      await dbConnect();
      console.log('after connect');
      const findMeal = await Meal.findById(id);
      console.log('findMeal', findMeal);
  
      const deletedMeal = await Meal.findByIdAndDelete(id);
      console.log('deletedMeal', deletedMeal);
      if (!deletedMeal) {
        return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Meal deleted successfully' });
    } catch (error) {
      console.error('Error deleting meal:', error);
      return NextResponse.json({ error: 'Error deleting meal' }, { status: 500 });
    }
  }