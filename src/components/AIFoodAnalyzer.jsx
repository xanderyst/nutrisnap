"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import ImageUploader from "./ImageUploader";
import AnalysisResult from "./AnalysisResult";
import AddedFoodsList from "./AddedFoodsList";
import TotalDailyNutrition from "./TotalDailyNutrition";
import { sendToAnalyze } from "@/lib/simulateOpenAIAnalysis";
import { useAuth } from "@clerk/nextjs";
import { addMeal, deleteMeal, fetchMealsOnDate } from "@/lib/api";

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
        const { meal } = await addMeal({
          dishName: analysisResult.dishName,
          ingredients: analysisResult.ingredients,
          totalNutrition: totalNutrition,
          date: new Date().toISOString().split("T")[0],
        });

        const newFood = {
          id: meal.id,
          dishName: meal.dishName,
          ingredients: meal.ingredients,
          totalNutrition: meal.totalNutrition,
        };

        setAddedFoods((prevFoods) => [...prevFoods, newFood]);
      } catch (error) {
        console.error("Error logging meal:", error);
        throw error;
      }
    }
  };

  const deleteFood = async (foodId) => {
    if (isSignedIn && userId) {
      setDeletingMealId(foodId);
      try {
        await deleteMeal(foodId);
        setAddedFoods((prevFoods) =>
          prevFoods.filter((food) => food.id !== foodId)
        );
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
    const loadTodaysMeals = async () => {
      if (isSignedIn && userId) {
        try {
          const meals = await fetchMealsOnDate(
            new Date().toISOString().split("T")[0]
          );
          setAddedFoods(
            meals.map((meal) => ({
              id: meal.id,
              dishName: meal.dishName,
              ingredients: meal.ingredients,
              totalNutrition: meal.totalNutrition,
            }))
          );
        } catch (error) {
          console.error("Error fetching today's meals:", error);
          setAddedFoods([]);
        } finally {
          setIsLoadingFoods(false);
        }
      } else {
        setAddedFoods([]);
        setIsLoadingFoods(false);
      }
    };

    loadTodaysMeals();
  }, [isSignedIn, userId]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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
