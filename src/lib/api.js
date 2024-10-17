function formatData (data) {
  data.forEach(item => {
    item.id = item._id;
  });
  return data;
}

export async function addMeal(meal) {
  const response = await fetch("/api/meals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meal),
  });

  if (!response.ok) {
    throw new Error("Failed to log meal");
  }
  const data = await response.json();
  return formatData(data);
}

export async function deleteMeal(mealId) {
  const response = await fetch(`/api/meals/${mealId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete meal from the database");
  }
}

export async function fetchMealsOnDate(date) {
  const response = await fetch(`/api/meals?date=${date}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch today's meals");
  }

  const data = await response.json();
  return formatData(data);
}
