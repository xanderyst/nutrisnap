"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dailyGoals as initialDailyGoals } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

export default function TotalDailyNutrition({ foods, disableEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoals, setDailyGoals] = useState(initialDailyGoals);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn, userId } = useAuth();
  const [isValid, setIsValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDailyGoals = async () => {
      if (isSignedIn && userId) {
        try {
          const response = await fetch("/api/dailyGoals");
          if (response.ok) {
            const data = await response.json();
            setDailyGoals(data);
          }
        } catch (error) {
          console.error("Error fetching daily goals:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchDailyGoals();
  }, [isSignedIn, userId]);

  const totalNutrition = (foods || []).reduce(
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

  const handleSave = async () => {
    if (isSignedIn && userId) {
      setIsSaving(true);
      try {
        const response = await fetch("/api/dailyGoals", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dailyGoals),
        });
        if (response.ok) {
          const updatedGoals = await response.json();
          setDailyGoals(updatedGoals);
          setIsEditing(false);
        } else {
          console.error("Failed to update daily goals");
        }
      } catch (error) {
        console.error("Error updating daily goals:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleChange = (key, value) => {
    const newValue = parseFloat(value);
    const newDailyGoals = { ...dailyGoals, [key]: newValue };
    setDailyGoals(newDailyGoals);

    // Check if any value is invalid
    const isAnyInvalid = Object.values(newDailyGoals).some(
      (val) => val === "" || val === undefined || isNaN(val) || val === null
    );
    setIsValid(!isAnyInvalid);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDailyGoals(initialDailyGoals); // Reset to initial values
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Daily Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Total Daily Nutrition</CardTitle>
        {isSignedIn && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={!isValid || isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              !disableEdit && (
                <Button onClick={handleEdit}>Edit Daily Goals</Button>
              )
            )}
          </div>
        )}
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
                value={Math.min((value / dailyGoals[key]) * 100, 100)}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
