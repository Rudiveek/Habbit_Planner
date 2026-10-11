/**
 * Streak Calculation Engine
 * Accurately calculates current streak and longest streak taking scheduled days and rest days into account.
 */

/**
 * Format a Date object to 'YYYY-MM-DD' string
 * @param {Date} date 
 * @returns {string} 'YYYY-MM-DD'
 */
export const formatDateStr = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is a scheduled day for a given habit
 * @param {Date} date 
 * @param {number[]} scheduledDays Array of days (0 = Sun, 1 = Mon, ..., 6 = Sat)
 * @returns {boolean}
 */
export const isDayScheduled = (date, scheduledDays = [0, 1, 2, 3, 4, 5, 6]) => {
  if (!scheduledDays || scheduledDays.length === 0) return true;
  const dayOfWeek = date.getDay();
  return scheduledDays.includes(dayOfWeek);
};

/**
 * Calculate streak metrics for a habit based on its completions
 * @param {Object} habit 
 * @param {string[]} completedDatesArray Array of date strings 'YYYY-MM-DD'
 * @param {Date} [referenceDate=new Date()]
 * @returns {{ currentStreak: number, longestStreak: number, totalCompleted: number }}
 */
export const calculateStreaks = (habit, completedDatesArray = [], referenceDate = new Date()) => {
  const completedSet = new Set(completedDatesArray);
  const scheduledDays = habit.scheduledDays && habit.scheduledDays.length > 0 
    ? habit.scheduledDays 
    : [0, 1, 2, 3, 4, 5, 6];

  const totalCompleted = completedSet.size;

  // 1. Calculate Current Streak
  let currentStreak = 0;
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDateStr(today);
  const isTodayScheduled = isDayScheduled(today, scheduledDays);
  const isTodayCompleted = completedSet.has(todayStr);

  let checkDate = new Date(today);

  if (isTodayCompleted) {
    currentStreak++;
    // Move to yesterday to continue checking
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (!isTodayScheduled) {
    // If today is a rest day, start checking from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Today is scheduled but not yet completed.
    // Check if the streak from yesterday is still alive (grace period during the current day)
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Iterate backwards up to 365 days or until streak breaks
  for (let i = 0; i < 365; i++) {
    const dateStr = formatDateStr(checkDate);
    const scheduled = isDayScheduled(checkDate, scheduledDays);

    if (scheduled) {
      if (completedSet.has(dateStr)) {
        currentStreak++;
      } else {
        // Uncompleted scheduled day breaks the current streak
        break;
      }
    }
    // Non-scheduled day (rest day): skipped without breaking streak

    checkDate.setDate(checkDate.getDate() - 1);
  }

  // 2. Calculate Longest Streak
  let longestStreak = currentStreak;
  if (completedDatesArray.length > 0) {
    const sortedDates = Array.from(completedSet).sort();
    let tempStreak = 0;

    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    let iterDate = new Date(startDate);

    while (iterDate <= endDate) {
      const iterStr = formatDateStr(iterDate);
      const scheduled = isDayScheduled(iterDate, scheduledDays);

      if (scheduled) {
        if (completedSet.has(iterStr)) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      }

      iterDate.setDate(iterDate.getDate() + 1);
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalCompleted,
  };
};

export default {
  formatDateStr,
  isDayScheduled,
  calculateStreaks,
};
