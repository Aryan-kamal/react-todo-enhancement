import type { Task, DateFilterOption, TaskDateRange } from "../types/user";

/**
 * Utility functions for date-based task filtering
 */

/**
 * Get the start and end of today's date range
 */
export const getTodayRange = (): TaskDateRange => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  return { start, end };
};

/**
 * Get the start and end of this week's date range (Monday to Sunday)
 */
export const getThisWeekRange = (): TaskDateRange => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday is 0, adjust to make Monday 0

  const start = new Date(today);
  start.setDate(today.getDate() - daysFromMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Check if a date falls within a date range
 */
export const isDateInRange = (date: Date, range: TaskDateRange): boolean => {
  if (!range.start || !range.end) return false;

  const dateTime = date.getTime();
  const startTime = range.start.getTime();
  const endTime = range.end.getTime();

  return dateTime >= startTime && dateTime <= endTime;
};

/**
 * Filter tasks based on date criteria
 */
export const filterTasksByDate = (
  tasks: Task[],
  filterOption: DateFilterOption,
  customRange?: TaskDateRange,
): Task[] => {
  if (filterOption === "all") {
    return tasks;
  }

  let dateRange: TaskDateRange;

  switch (filterOption) {
    case "today":
      dateRange = getTodayRange();
      break;
    case "thisWeek":
      dateRange = getThisWeekRange();
      break;
    case "customRange":
      if (!customRange || !customRange.start || !customRange.end) {
        return tasks; // Return all tasks if custom range is invalid
      }
      dateRange = customRange;
      break;
    default:
      return tasks;
  }

  return tasks.filter((task) => {
    // Filter by task creation date
    return isDateInRange(new Date(task.date), dateRange);
  });
};

/**
 * Get formatted date range string for display
 */
export const getDateRangeDisplayString = (
  filterOption: DateFilterOption,
  customRange?: TaskDateRange,
): string => {
  switch (filterOption) {
    case "all":
      return "All tasks";
    case "today":
      return "Today";
    case "thisWeek":
      return "This week";
    case "customRange":
      if (!customRange || !customRange.start || !customRange.end) {
        return "Custom range";
      }
      {
        const startStr = customRange.start.toLocaleDateString();
        const endStr = customRange.end.toLocaleDateString();
        return `${startStr} - ${endStr}`;
      }
    default:
      return "All tasks";
  }
};

/**
 * Validate if a custom date range is valid
 */
export const isValidDateRange = (range: TaskDateRange): boolean => {
  if (!range.start || !range.end) return false;
  return range.start <= range.end;
};
