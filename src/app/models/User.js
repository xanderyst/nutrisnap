import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  dailyGoals: {
    calories: { type: Number, default: 2000 },
    protein: { type: Number, default: 50 },
    carbs: { type: Number, default: 300 },
    fat: { type: Number, default: 65 },
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
