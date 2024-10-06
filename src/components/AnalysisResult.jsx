import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AnalysisResult({ result, onAddDish }) {
  const totalNutrition = result.ingredients.reduce(
    (acc, ingredient) => ({
      calories: acc.calories + ingredient.nutrition.calories,
      protein: acc.protein + ingredient.nutrition.protein,
      carbs: acc.carbs + ingredient.nutrition.carbs,
      fat: acc.fat + ingredient.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-4">
        {result.dishName} - Nutrition Breakdown
      </h2>
      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(totalNutrition).map(([key, value]) => (
                <div
                  key={key}
                  className="text-center p-4 bg-primary/10 rounded-lg"
                >
                  <h3 className="font-semibold text-lg capitalize">{key}</h3>
                  <p className="text-3xl font-bold">
                    {value.toFixed(1)}
                    {key !== "calories" ? "g" : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.ingredients.map((ingredient, index) => (
                  <TableRow key={index}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.amount}</TableCell>
                    <TableCell className="text-right">
                      {ingredient.nutrition.calories}
                    </TableCell>
                    <TableCell className="text-right">
                      {ingredient.nutrition.protein}g
                    </TableCell>
                    <TableCell className="text-right">
                      {ingredient.nutrition.carbs}g
                    </TableCell>
                    <TableCell className="text-right">
                      {ingredient.nutrition.fat}g
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Button onClick={onAddDish} className="w-full mb-6">
        Log Meal
      </Button>
    </>
  );
}
