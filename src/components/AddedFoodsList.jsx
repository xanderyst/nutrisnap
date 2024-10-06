import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import IngredientsList from "./IngredientsList";

export default function AddedFoodsList({ foods, onDelete }) {
  const [expandedFoodId, setExpandedFoodId] = useState(null);

  const toggleFoodExpansion = (foodId) => {
    setExpandedFoodId((prevId) => (prevId === foodId ? null : foodId));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Food Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dish Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Protein</TableHead>
              <TableHead className="text-right">Carbs</TableHead>
              <TableHead className="text-right">Fat</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No foods have been added yet.
                </TableCell>
              </TableRow>
            ) : (
              foods.map((food) => (
                <Collapsible
                  key={food.id}
                  open={expandedFoodId === food.id}
                  onOpenChange={() => toggleFoodExpansion(food.id)}
                  asChild
                >
                  <>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-bold">
                        {food.dishName}
                      </TableCell>
                      <TableCell className="text-right">{}</TableCell>
                      <TableCell className="text-right font-bold">
                        {food.totalNutrition.calories.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {food.totalNutrition.protein.toFixed(1)}g
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {food.totalNutrition.carbs.toFixed(1)}g
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {food.totalNutrition.fat.toFixed(1)}g
                      </TableCell>
                      <CollapsibleTrigger asChild>
                        <TableCell>
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(food.id);
                              }}
                              aria-label={`Delete ${food.dishName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {expandedFoodId === food.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableCell>
                      </CollapsibleTrigger>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <IngredientsList ingredients={food.ingredients} />
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
