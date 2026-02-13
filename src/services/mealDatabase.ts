import Dexie, { Table } from 'dexie';
import type { MealEntry } from '../types/meal';

interface DailyMealsDB {
  id?: number;
  date: string;
  meals: Omit<MealEntry, 'date'>[];
}

class CalorieDB extends Dexie {
  meals!: Table<DailyMealsDB>;

  constructor() {
    super('CalorieCounterDB');
    this.version(1).stores({
      meals: 'date' // date is primary key
    });
  }
}

export const db = new CalorieDB();

export const getMealsByDate = async (date: string): Promise<DailyMealsDB | undefined> => {
  return db.meals.get(date);
};

export const saveMealsByDate = async (date: string, meals: Omit<MealEntry, 'date'>[]): Promise<void> => {
  await db.meals.put({ date, meals });
};

export const deleteMeal = async (date: string, mealIndex: number): Promise<void> => {
  const entry = await db.meals.get(date);
  if (entry) {
    entry.meals.splice(mealIndex, 1);
    await db.meals.put(entry);
  }
};
