"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function AnalysisResult({ result, onAddDish, loading }) {
  // Sample loading component
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    console.log("use effect is called");
    setIsLogged(false);
  }, [result]);

  if (loading) {
    return (
      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onLogMeal = () => {
    onAddDish();
    setIsLogged(true);
  };

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
      <h2 className="text-2xl font-bold mb-4">Dish Name: {result.dishName}</h2>
      <div>
        <Card className="mb-6">
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
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            {!isLogged && (
              <Button onClick={onLogMeal}>Click to Log Meal</Button>
            )}
            {isLogged && <Label>Meal Logged!</Label>}
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
    </>
  );
}
