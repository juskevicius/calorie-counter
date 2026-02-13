import { useEffect, useState, useCallback } from 'react';
import type { MealEntry } from '../types/meal';
import { getMealsByDate, saveMealsByDate, deleteMeal } from '../services/mealDatabase';

export const useDailyMeals = (date: string) => {
  const [meals, setMeals] = useState<Omit<MealEntry, 'date'>[]>([]);
  const [loading, setLoading] = useState(true);

  // Load meals from database
  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      const data = await getMealsByDate(date);
      if (data) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
      setLoading(false);
    };
    loadMeals();
  }, [date]);

  // Save meals to database whenever they change
  const saveMeals = useCallback(
    async (updatedMeals: Omit<MealEntry, 'date'>[]) => {
      setMeals(updatedMeals);
      await saveMealsByDate(date, updatedMeals);
    },
    [date]
  );

  const addMeal = useCallback(
    async (meal: Omit<MealEntry, 'date'>) => {
      const newMeals = [...meals, meal];
      await saveMeals(newMeals);
    },
    [meals, saveMeals]
  );

  const updateMeal = useCallback(
    async (index: number, meal: Omit<MealEntry, 'date'>) => {
      const newMeals = [...meals];
      newMeals[index] = meal;
      await saveMeals(newMeals);
    },
    [meals, saveMeals]
  );

  const removeMeal = useCallback(
    async (index: number) => {
      await deleteMeal(date, index);
      const newMeals = meals.filter((_, i) => i !== index);
      setMeals(newMeals);
    },
    [meals, date]
  );

  return {
    meals,
    loading,
    addMeal,
    updateMeal,
    removeMeal,
    saveMeals
  };
};
