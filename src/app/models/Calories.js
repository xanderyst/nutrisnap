import mongoose from "mongoose";

const CalorieSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Calorie || mongoose.model("Calorie", CalorieSchema);
