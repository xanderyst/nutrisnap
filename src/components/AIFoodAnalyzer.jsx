"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import AnalysisResult from "./AnalysisResult";
import AddedFoodsList from "./AddedFoodsList";
import TotalDailyNutrition from "./TotalDailyNutrition";
import {
  simulateOpenAIAnalysis,
  sendToAnalyze,
} from "@/lib/simulateOpenAIAnalysis";

export default function AIFoodAnalyzer() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [addedFoods, setAddedFoods] = useState([]);

  const handleImageUpload = (file) => {
    // setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
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

  const addDish = () => {
    if (analysisResult) {
      const newFood = {
        id: Date.now().toString(),
        dishName: analysisResult.dishName,
        ingredients: analysisResult.ingredients,
        totalNutrition: analysisResult.ingredients.reduce(
          (acc, ingredient) => ({
            calories: acc.calories + ingredient.nutrition.calories,
            protein: acc.protein + ingredient.nutrition.protein,
            carbs: acc.carbs + ingredient.nutrition.carbs,
            fat: acc.fat + ingredient.nutrition.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        ),
      };

      setAddedFoods((prevFoods) => [...prevFoods, newFood]);
      // setAnalysisResult(null);
      // setImage(null);
      // setImagePreview(null);
    }
  };

  const deleteFood = (foodId) => {
    setAddedFoods((prevFoods) =>
      prevFoods.filter((food) => food.id !== foodId)
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">NutriSnap</h1>
      <ImageUploader
        imagePreview={imagePreview}
        onImageUpload={handleImageUpload}
        onAnalyze={analyzeImage}
        isAnalyzing={isAnalyzing}
      />
      {analysisResult && (
        <AnalysisResult result={analysisResult} onAddDish={addDish} />
      )}
      <AddedFoodsList foods={addedFoods} onDelete={deleteFood} />
      <TotalDailyNutrition foods={addedFoods} />
    </div>
  );
}
