import dbConnect from "@/lib/mongodb";
import Calorie from "@/models/Calories";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  await dbConnect();

  const { userId } = getAuth(req);

  if (req.method === "POST") {
    try {
      const { food, calories } = req.body;
      const calorieEntry = await Calorie.create({
        userId,
        food,
        calories,
      });
      res.status(201).json(calorieEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create calorie entry" });
    }
  }
}
