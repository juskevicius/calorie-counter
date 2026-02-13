export interface MealEntry {
  id?: number;
  date: string; // YYYY-MM-DD format
  name: string;
  weight: number; // grams
  caloriesPer100g: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
}

export interface DailyMeals {
  date: string; // YYYY-MM-DD format
  meals: Omit<MealEntry, 'date'>[];
}

export interface CalculatedMeal extends MealEntry {
  totalCalories: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarbs?: number;
}
