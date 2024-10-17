"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import ImageUploader from "./ImageUploader";
import AnalysisResult from "./AnalysisResult";
import AddedFoodsList from "./AddedFoodsList";
import TotalDailyNutrition from "./TotalDailyNutrition";
import LoginButton from "./LoginButton";
import {
  simulateOpenAIAnalysis,
  sendToAnalyze,
} from "@/lib/simulateOpenAIAnalysis";
import { useAuth } from "@clerk/nextjs";

export default function AIFoodAnalyzer() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [addedFoods, setAddedFoods] = useState(null);
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [isLoadingFoods, setIsLoadingFoods] = useState(true);

  const { isSignedIn, userId } = useAuth();

  // Compress the image to 2MB if it exceeds 2MB
  const handleImageUpload = async (file) => {
    let compressedFile = file;

    // If the image size exceeds 2MB, compress it
    if (file.size > 2 * 1024 * 1024) {
      // 2MB = 2 * 1024 * 1024 bytes
      const options = {
        maxSizeMB: 2, // Set the maximum file size to 2MB
        useWebWorker: true, // Use Web Worker for better performance
      };
      try {
        compressedFile = await imageCompression(file, options);
        console.log("Original file size:", file.size / 1024 / 1024, "MB");
        console.log(
          "Compressed file size:",
          compressedFile.size / 1024 / 1024,
          "MB"
        );
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }

    // Convert the compressed image to a base64 string and set the preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(compressedFile);
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      // const result = await simulateOpenAIAnalysis(image);
      const result = await sendToAnalyze(image);
      console.log("result", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addDish = async () => {
    if (analysisResult) {
      const totalNutrition = analysisResult.ingredients.reduce(
        (acc, ingredient) => ({
          calories: acc.calories + ingredient.nutrition.calories,
          protein: acc.protein + ingredient.nutrition.protein,
          carbs: acc.carbs + ingredient.nutrition.carbs,
          fat: acc.fat + ingredient.nutrition.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      try {
        const response = await fetch("/api/meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dishName: analysisResult.dishName,
            ingredients: analysisResult.ingredients,
            totalNutrition: totalNutrition,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to log meal");
        }

        const data = await response.json();
        const { meal } = data;
        console.log("Meal logged successfully:", data);

        const newFood = {
          id: meal._id,
          dishName: meal.dishName,
          ingredients: meal.ingredients,
          totalNutrition: meal.totalNutrition,
        };

        setAddedFoods((prevFoods) => [...prevFoods, newFood]);
      } catch (error) {
        console.error("Error logging meal:", error);
        throw error; // Re-throw the error to be caught in AnalysisResult
      }
    }
  };

  const deleteFood = async (foodId) => {
    console.log("foodId", foodId);
    if (isSignedIn && userId) {
      setDeletingMealId(foodId);
      try {
        const response = await fetch(`/api/meals/${foodId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setAddedFoods((prevFoods) =>
            prevFoods.filter((food) => food.id !== foodId)
          );
        } else {
          console.error("Failed to delete meal from the database");
        }
      } catch (error) {
        console.error("Error deleting meal:", error);
      } finally {
        setDeletingMealId(null);
      }
    } else {
      setAddedFoods((prevFoods) =>
        prevFoods.filter((food) => food.id !== foodId)
      );
    }
  };

  useEffect(() => {
    const fetchTodaysMeals = async () => {
      if (isSignedIn && userId) {
        try {
          const response = await fetch(
            `/api/meals?date=${new Date().toISOString().split("T")[0]}`
          );
          if (response.ok) {
            const meals = await response.json();
            setAddedFoods(
              meals.map((meal) => ({
                id: meal._id,
                dishName: meal.dishName,
                ingredients: meal.ingredients,
                totalNutrition: meal.totalNutrition,
              }))
            );
          } else {
            setAddedFoods([]); // Set to empty array if request fails
          }
        } catch (error) {
          console.error("Error fetching today's meals:", error);
          setAddedFoods([]); // Set to empty array if request fails
        } finally {
          setIsLoadingFoods(false);
        }
      } else {
        setAddedFoods([]); // Set to empty array if user is not signed in
        setIsLoadingFoods(false);
      }
    };

    fetchTodaysMeals();
  }, [isSignedIn, userId]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">NutriSnap</h1>
        <LoginButton />
      </div>
      <ImageUploader
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
        onAnalyze={analyzeImage}
        isAnalyzing={isAnalyzing}
      />
      {analysisResult && (
        <AnalysisResult
          loading={isAnalyzing}
          result={analysisResult}
          onAddDish={addDish}
        />
      )}
      <AddedFoodsList
        foods={addedFoods}
        onDelete={deleteFood}
        deletingMealId={deletingMealId}
        isLoading={isLoadingFoods}
      />
      <TotalDailyNutrition foods={addedFoods} />
    </div>
  );
}
