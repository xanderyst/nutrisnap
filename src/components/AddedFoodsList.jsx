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
import { ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import IngredientsList from "./IngredientsList";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddedFoodsList({
  foods,
  onDelete,
  deletingMealId,
  disableDelete,
  isLoading,
}) {
  const [expandedFoodId, setExpandedFoodId] = useState(null);

  const toggleFoodExpansion = (foodId) => {
    setExpandedFoodId((prevId) => (prevId === foodId ? null : foodId));
  };

  if (isLoading || foods === null) {
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
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fat</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

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
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Protein</TableHead>
              <TableHead className="text-right">Carbs</TableHead>
              <TableHead className="text-right">Fat</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foods.length === 0 && !isLoading ? (
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
                            {!disableDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(food.id)}
                                disabled={deletingMealId === food.id}
                              >
                                {deletingMealId === food.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            )}
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
