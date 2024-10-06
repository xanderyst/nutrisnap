import { TableCell, TableRow } from "@/components/ui/table";
import { forwardRef } from "react";

const IngredientsList = forwardRef(({ ingredients }, ref) => {
  return (
    <>
      {ingredients.map((ingredient, index) => (
        <TableRow key={ingredient.name}>
          <TableCell>{ingredient.name}</TableCell>
          <TableCell>{ingredient.amount}</TableCell>
          <TableCell className="text-right">
            {ingredient.nutrition.calories}
          </TableCell>
          <TableCell className="text-right">
            {ingredient.nutrition.protein}g
          </TableCell>
          <TableCell className="text-right">
            {ingredient.nutrition.carbs}g
          </TableCell>
          <TableCell className="text-right">
            {ingredient.nutrition.fat}g
          </TableCell>
        </TableRow>
      ))}
    </>
  );
});

IngredientsList.displayName = "IngredientsList";

export default IngredientsList;
