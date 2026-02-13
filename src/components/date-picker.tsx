import { useState, useRef, useEffect } from 'react';
import * as styles from './date-picker.module.css';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
}

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const [year, month] = value.split('-');
    return new Date(parseInt(year), parseInt(month) - 1);
  });
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert from Sunday=0 to Monday=0
    return (dayOfWeek + 6) % 7;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleSelectDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setCurrentMonth(today);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const selectedDay = value.split('-')[2];
  const selectedMonth = value.split('-')[1];
  const selectedYear = value.split('-')[0];

  return (
    <div ref={pickerRef} className={styles.container}>
      <button
        className={styles.dateButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={styles.dateText}>{value}</span>
        <span className={styles.calendarIcon}>📅</span>
      </button>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.header}>
            <button
              className={styles.navBtn}
              onClick={handlePrevMonth}
              type="button"
            >
              ◀
            </button>
            <h3 className={styles.monthYear}>{monthName}</h3>
            <button
              className={styles.navBtn}
              onClick={handleNextMonth}
              type="button"
            >
              ▶
            </button>
          </div>

          <div className={styles.weekDays}>
            <div className={styles.weekDay}>Mon</div>
            <div className={styles.weekDay}>Tue</div>
            <div className={styles.weekDay}>Wed</div>
            <div className={styles.weekDay}>Thu</div>
            <div className={styles.weekDay}>Fri</div>
            <div className={styles.weekDay}>Sat</div>
            <div className={styles.weekDay}>Sun</div>
          </div>

          <div className={styles.daysGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div key={`empty-${index}`} className={styles.emptyDay} />
                );
              }

              const isSelected =
                day === parseInt(selectedDay) &&
                currentMonth.getMonth() === parseInt(selectedMonth) - 1 &&
                currentMonth.getFullYear() === parseInt(selectedYear);

              const isToday = (() => {
                const today = new Date();
                return (
                  day === today.getDate() &&
                  currentMonth.getMonth() === today.getMonth() &&
                  currentMonth.getFullYear() === today.getFullYear()
                );
              })();

              return (
                <button
                  key={day}
                  className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                  onClick={() => handleSelectDay(day)}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>

          <button
            className={styles.todayBtn}
            onClick={handleToday}
            type="button"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
};
