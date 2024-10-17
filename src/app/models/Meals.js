import mongoose from 'mongoose';

const NutritionInfoSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

const IngredientSchema = new mongoose.Schema({
  name: String,
  amount: String,
  nutrition: NutritionInfoSchema,
});

const MealSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  dishName: String,
  ingredients: [IngredientSchema],
  totalNutrition: NutritionInfoSchema,
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Meal || mongoose.model('Meal', MealSchema);
