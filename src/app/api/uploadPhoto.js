import { Configuration, OpenAIApi } from "openai";
import dbConnect from "@/lib/mongodb";
import Calorie from "@/models/Calories";
import { getAuth } from "@clerk/nextjs/server";

// Set up OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Adjust size limit for photo uploads
    },
  },
};

export default async function handler(req, res) {
  await dbConnect();
  const { userId } = getAuth(req);

  if (req.method === "POST") {
    try {
      const { photoBase64 } = req.body;

      // Step 1: Send the photo to OpenAI to recognize the food
      const response = await openai.createImageRecognition({
        image: photoBase64,
        // Example of using OpenAI's hypothetical image recognition endpoint
      });

      // Assuming OpenAI returns the recognized food and estimated calories
      const foodItems = response.data.food_items; // [{name: "Apple", calories: 95}, ...]

      // Step 2: Record food and calorie data in MongoDB
      const calorieEntries = foodItems.map((item) => ({
        userId,
        food: item.name,
        calories: item.calories,
      }));

      await Calorie.insertMany(calorieEntries);

      // Respond with the recorded data
      res.status(200).json({ message: "Calorie data recorded successfully!", foodItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process photo and record calorie data" });
    }
  }
}
