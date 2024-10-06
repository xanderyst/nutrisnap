export const simulateOpenAIAnalysis = async (imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      dishName: "AI-Identified Salad",
      ingredients: [
        {
          name: "Mixed Greens",
          amount: "100g",
          nutrition: { calories: 20, protein: 2, carbs: 4, fat: 0.5 }
        },
        {
          name: "Grilled Chicken",
          amount: "150g",
          nutrition: { calories: 250, protein: 45, carbs: 0, fat: 5.5 }
        },
        {
          name: "Cherry Tomatoes",
          amount: "50g",
          nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }
        },
        {
          name: "Balsamic Vinaigrette",
          amount: "30ml",
          nutrition: { calories: 90, protein: 0, carbs: 6, fat: 9 }
        }
      ]
    }
  }

export const sendToAnalyze = async (imageFile) => {
    const res = await fetch("api/analyzeImage", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        image: imageFile, // base64 image
        }),
    });
    const data = await res.json();
    console.log("data", data);
    const foodRawData = data.choices[0].message.content;
    console.log("foodRawData", foodRawData);
    const processedData = JSON.parse(foodRawData);
    console.log("processedData", processedData);
    return processedData;
}