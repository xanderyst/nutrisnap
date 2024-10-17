"use client";

import { useState, useEffect } from "react";
import { format, subDays, addDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import AddedFoodsList from "@/components/AddedFoodsList";
import TotalDailyNutrition from "@/components/TotalDailyNutrition";
import { fetchMealsOnDate } from "@/lib/api";

// Mock data for demonstration
const mockData = {
  "2023-05-01": { calories: 2100, protein: 100, carbs: 250, fat: 70 },
  "2023-05-02": { calories: 2300, protein: 110, carbs: 280, fat: 75 },
  "2023-05-03": { calories: 1900, protein: 95, carbs: 220, fat: 65 },
  "2023-05-04": { calories: 2200, protein: 105, carbs: 260, fat: 72 },
  "2023-05-05": { calories: 2000, protein: 98, carbs: 240, fat: 68 },
};

export default function DailyNutrition() {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

  const formattedDate = format(date, "yyyy-MM-dd");

  useEffect(() => {
    async function loadMeals() {
      setIsLoading(true);
      try {
        const fetchedMeals = await fetchMealsOnDate(formattedDate);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMeals();
  }, [formattedDate]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Food Log for {date.toDateString()}
        </h1>
      </div>

      <DateNavigation
        date={date}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onSelectDate={setDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TotalDailyNutrition disableEdit={true} foods={meals} />
        <AddedFoodsList
          foods={meals}
          isLoading={isLoading}
          disableDelete={true}
        />
      </div>

      {/* <TrendChart
        data={Object.entries(mockData).map(([date, data]) => ({
          date,
          ...data,
        }))}
      /> */}
    </div>
  );
}

function DateNavigation({ date, onPrevDay, onNextDay, onSelectDate }) {
  return (
    <div className="flex items-center justify-between">
      <Button onClick={onPrevDay} variant="outline" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button onClick={onNextDay} variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function TrendChart({ data }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Calorie Intake Trend</CardTitle>
        <CardDescription>Your calorie intake over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
