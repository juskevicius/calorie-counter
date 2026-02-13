import * as styles from './meal-input-row.module.css';
import type { MealEntry } from '../types/meal';

interface MealInputRowProps {
  meal: Omit<MealEntry, 'date'>;
  onUpdate: (meal: Omit<MealEntry, 'date'>) => void;
}

export const MealInputRow = ({ meal, onUpdate }: MealInputRowProps) => {
  const handleChange = (field: string, value: string | number) => {
    onUpdate({
      ...meal,
      [field]: value,
    });
  };

  const handleNameChange = (value: string) => {
    onUpdate({
      ...meal,
      name: value,
    });
  };

  return (
    <div className={styles.mealRow}>
      <div className={styles.inputGroup}>
        <label>Meal Name</label>
        <input
          type="text"
          value={meal.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., Breakfast, Lunch"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Weight (g) *</label>
        <input
          type="number"
          value={meal.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
          placeholder="0"
          min="0"
          step="1"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Calories/100g *</label>
        <input
          type="number"
          value={meal.caloriesPer100g}
          onChange={(e) => handleChange('caloriesPer100g', e.target.value)}
          placeholder="0"
          min="0"
          step="0.1"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Protein/100g (g)</label>
        <input
          type="number"
          value={meal.proteinPer100g ?? ''}
          onChange={(e) => handleChange('proteinPer100g', e.target.value)}
          placeholder="0"
          min="0"
          step="0.1"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Fat/100g (g)</label>
        <input
          type="number"
          value={meal.fatPer100g ?? ''}
          onChange={(e) => handleChange('fatPer100g', e.target.value)}
          placeholder="0"
          min="0"
          step="0.1"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Carbs/100g (g)</label>
        <input
          type="number"
          value={meal.carbsPer100g ?? ''}
          onChange={(e) => handleChange('carbsPer100g', e.target.value)}
          placeholder="0"
          min="0"
          step="0.1"
        />
      </div>
    </div>
  );
};
