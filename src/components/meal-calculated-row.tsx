import * as styles from './meal-calculated-row.module.css';
import type { MealEntry } from '../types/meal';

interface MealCalculatedRowProps {
  meal: Omit<MealEntry, 'date'>;
}

export const MealCalculatedRow = ({ meal }: MealCalculatedRowProps) => {
  const calculateValue = (valuePerHundred: number | undefined): number => {
    if (!valuePerHundred || !meal.weight) return 0;
    return (valuePerHundred * meal.weight) / 100;
  };

  const totalCalories = calculateValue(meal.caloriesPer100g);
  const totalProtein = calculateValue(meal.proteinPer100g);
  const totalFat = calculateValue(meal.fatPer100g);
  const totalCarbs = calculateValue(meal.carbsPer100g);

  return (
    <div className={styles.calculatedRow}>
      <div className={styles.label}>Calculated per {meal.weight}g:</div>

      <div className={styles.valueGroup}>
        <span className={styles.label_small}>Calories</span>
        <span className={styles.value}>{totalCalories.toFixed(1)}</span>
      </div>

      <div className={styles.valueGroup}>
        <span className={styles.label_small}>Protein (g)</span>
        <span className={styles.value}>{totalProtein.toFixed(1)}</span>
      </div>

      <div className={styles.valueGroup}>
        <span className={styles.label_small}>Fat (g)</span>
        <span className={styles.value}>{totalFat.toFixed(1)}</span>
      </div>

      <div className={styles.valueGroup}>
        <span className={styles.label_small}>Carbs (g)</span>
        <span className={styles.value}>{totalCarbs.toFixed(1)}</span>
      </div>
    </div>
  );
};
