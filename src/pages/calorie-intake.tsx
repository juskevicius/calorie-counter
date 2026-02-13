import { useState, useCallback } from 'react';
import { MealInputRow } from '../components/meal-input-row';
import { MealCalculatedRow } from '../components/meal-calculated-row';
import { DatePicker } from '../components/date-picker';
import { useDailyMeals } from '../hooks/useDailyMeals';
import type { MealEntry } from '../types/meal';
import * as styles from './calorie-intake.module.css';

export const CalorieIntakePage = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(today);
  const { meals, loading, addMeal, updateMeal, removeMeal } =
    useDailyMeals(selectedDate);
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleAddMeal = async () => {
    const newMeal: Omit<MealEntry, 'date'> = {
      name: `Meal ${meals.length + 1}`,
      weight: 100,
      caloriesPer100g: 0,
    };
    await addMeal(newMeal);
  };

  const toggleExpanded = useCallback((index: number) => {
    setExpandedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleDeleteClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setDeletingIndex(index);
  };

  const confirmDelete = async () => {
    if (deletingIndex !== null) {
      await removeMeal(deletingIndex);
      setExpandedMeals((prev) => {
        const next = new Set(prev);
        next.delete(deletingIndex);
        return next;
      });
      setDeletingIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeletingIndex(null);
  };

  const calculateTotalCalories = (): number => {
    return meals.reduce((total, meal) => {
      const mealCalories = (meal.caloriesPer100g * meal.weight) / 100;
      return total + mealCalories;
    }, 0);
  };

  const calculateTotalNutrients = () => {
    return {
      protein: meals.reduce((total, meal) => {
        if (!meal.proteinPer100g) return total;
        return total + (meal.proteinPer100g * meal.weight) / 100;
      }, 0),
      fat: meals.reduce((total, meal) => {
        if (!meal.fatPer100g) return total;
        return total + (meal.fatPer100g * meal.weight) / 100;
      }, 0),
      carbs: meals.reduce((total, meal) => {
        if (!meal.carbsPer100g) return total;
        return total + (meal.carbsPer100g * meal.weight) / 100;
      }, 0),
    };
  };

  const totals = calculateTotalNutrients();
  const totalCalories = calculateTotalCalories();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Daily Calorie Tracker</h1>
        <DatePicker value={selectedDate} onChange={setSelectedDate} />
      </header>

      <main className={styles.main}>
        {meals.length === 0 ? (
          <div className={styles.empty}>
            <p>No meals added yet. Start by clicking "Add Meal"</p>
          </div>
        ) : (
          <div className={styles.mealsContainer}>
            {meals.map((meal, index) => {
              const isExpanded = expandedMeals.has(index);
              const mealCalories = (meal.caloriesPer100g * meal.weight) / 100;

              return (
                <div key={index} className={styles.mealCard}>
                  <div
                    className={styles.mealCardHeader}
                    onClick={() => toggleExpanded(index)}
                  >
                    <button
                      className={styles.expandToggle}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse meal' : 'Expand meal'}
                    >
                      <span className={styles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </button>

                    <div className={styles.mealSummary}>
                      <h3 className={styles.mealName}>{meal.name}</h3>
                      <p className={styles.mealCalories}>
                        {mealCalories.toFixed(0)} cal
                      </p>
                    </div>

                    <button
                      className={styles.deleteBtn}
                      onClick={(event) => handleDeleteClick(event, index)}
                      aria-label="Delete meal"
                      title="Delete this meal"
                    >
                      ✕
                    </button>
                  </div>

                  {isExpanded && (
                    <div className={styles.mealContent}>
                      <MealInputRow
                        meal={meal}
                        onUpdate={(updatedMeal) =>
                          updateMeal(index, updatedMeal)
                        }
                      />
                      <MealCalculatedRow meal={meal} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {deletingIndex !== null && (
          <div className={styles.modalOverlay} onClick={cancelDelete}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Delete Meal?</h3>
              <p>
                Are you sure you want to delete "{meals[deletingIndex].name}"?
              </p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={cancelDelete}>
                  Cancel
                </button>
                <button className={styles.confirmBtn} onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <button className={styles.addMealBtn} onClick={handleAddMeal}>
          + Add Meal
        </button>

        <div className={styles.summary}>
          <h2>Daily Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.label}>Total Calories</span>
              <span className={styles.value}>{totalCalories.toFixed(0)}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.label}>Total Protein (g)</span>
              <span className={styles.value}>{totals.protein.toFixed(1)}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.label}>Total Fat (g)</span>
              <span className={styles.value}>{totals.fat.toFixed(1)}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.label}>Total Carbs (g)</span>
              <span className={styles.value}>{totals.carbs.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
