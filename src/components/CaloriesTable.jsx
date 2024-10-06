import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Sample data for the dish
let dishName = "Chicken Salad";
const sampleIngredients = [
  {
    name: "Chicken Breast",
    amount: "100g",
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    name: "Mixed Greens",
    amount: "50g",
    nutrition: { calories: 10, protein: 1, carbs: 2, fat: 0 },
  },
  {
    name: "Cherry Tomatoes",
    amount: "50g",
    nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  },
  {
    name: "Cucumber",
    amount: "30g",
    nutrition: { calories: 4, protein: 0.3, carbs: 1, fat: 0 },
  },
  {
    name: "Olive Oil",
    amount: "15ml",
    nutrition: { calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  },
];

// Sample daily nutritional goals
const dailyGoals = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
};

export default function CaloriesTable({ rawData }) {
  console.log("rawData", rawData);
  let ingredients;
  if (!rawData) {
    ingredients = sampleIngredients;
  } else {
    ingredients = rawData.ingredients;
    dishName = rawData.name;
  }
  console.log("ingredients", ingredients);
  // Calculate total nutrition
  const totalNutrition = ingredients.reduce(
    (acc, ingredient) => ({
      calories: acc.calories + ingredient.nutrition.calories,
      protein: acc.protein + ingredient.nutrition.protein,
      carbs: acc.carbs + ingredient.nutrition.carbs,
      fat: acc.fat + ingredient.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">
        {dishName} - Nutrition Breakdown
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Protein
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Carbs</TableHead>
                  <TableHead className="hidden sm:table-cell">Fat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient, index) => (
                  <TableRow key={index}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.amount}</TableCell>
                    <TableCell>{ingredient.nutrition.calories}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {ingredient.nutrition.protein}g
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {ingredient.nutrition.carbs}g
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {ingredient.nutrition.fat}g
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg">Calories</h3>
                <p className="text-3xl font-bold">{totalNutrition.calories}</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg">Protein</h3>
                <p className="text-3xl font-bold">
                  {totalNutrition.protein.toFixed(1)}g
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg">Carbs</h3>
                <p className="text-3xl font-bold">
                  {totalNutrition.carbs.toFixed(1)}g
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg">Fat</h3>
                <p className="text-3xl font-bold">
                  {totalNutrition.fat.toFixed(1)}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Nutritional Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm font-medium">
                    {totalNutrition.calories} / {dailyGoals.calories}
                  </span>
                </div>
                <Progress
                  value={(totalNutrition.calories / dailyGoals.calories) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm font-medium">
                    {totalNutrition.protein.toFixed(1)}g / {dailyGoals.protein}g
                  </span>
                </div>
                <Progress
                  value={(totalNutrition.protein / dailyGoals.protein) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm font-medium">
                    {totalNutrition.carbs.toFixed(1)}g / {dailyGoals.carbs}g
                  </span>
                </div>
                <Progress
                  value={(totalNutrition.carbs / dailyGoals.carbs) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm font-medium">
                    {totalNutrition.fat.toFixed(1)}g / {dailyGoals.fat}g
                  </span>
                </div>
                <Progress
                  value={(totalNutrition.fat / dailyGoals.fat) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
