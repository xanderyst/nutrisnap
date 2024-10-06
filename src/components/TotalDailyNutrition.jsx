"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dailyGoals as initialDailyGoals } from "@/lib/constants";

export default function TotalDailyNutrition({ foods }) {
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoals, setDailyGoals] = useState(initialDailyGoals);

  const totalNutrition = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.totalNutrition.calories,
      protein: acc.protein + food.totalNutrition.protein,
      carbs: acc.carbs + food.totalNutrition.carbs,
      fat: acc.fat + food.totalNutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the updated dailyGoals to your backend
  };

  const handleChange = (key, value) => {
    setDailyGoals((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Total Daily Nutrition</CardTitle>
        <Button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? "Save" : "Edit Daily Goals"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(totalNutrition).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize">{key}</span>
                <span className="text-sm font-medium">
                  {value.toFixed(1)}
                  {key !== "calories" ? "g" : ""} /{" "}
                  {isEditing ? (
                    <Input
                      type="number"
                      value={dailyGoals[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-20 h-6 px-1 py-0 inline-block"
                    />
                  ) : (
                    dailyGoals[key]
                  )}
                  {key !== "calories" ? "g" : ""}
                </span>
              </div>
              <Progress
                value={(value / dailyGoals[key]) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
