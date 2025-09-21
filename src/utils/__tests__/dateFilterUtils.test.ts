import { describe, it, expect } from "vitest";
import {
  getTodayRange,
  getThisWeekRange,
  isDateInRange,
  filterTasksByDate,
  getDateRangeDisplayString,
  isValidDateRange,
} from "../dateFilterUtils";
import type { Task, TaskDateRange } from "../../types/user";

describe("dateFilterUtils", () => {
  describe("getTodayRange", () => {
    it("should return today's date range", () => {
      const range = getTodayRange();
      const today = new Date();

      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
      expect(range.start?.getDate()).toBe(today.getDate());
      expect(range.start?.getMonth()).toBe(today.getMonth());
      expect(range.start?.getFullYear()).toBe(today.getFullYear());
      expect(range.start?.getHours()).toBe(0);
      expect(range.start?.getMinutes()).toBe(0);
      expect(range.start?.getSeconds()).toBe(0);

      expect(range.end?.getDate()).toBe(today.getDate());
      expect(range.end?.getMonth()).toBe(today.getMonth());
      expect(range.end?.getFullYear()).toBe(today.getFullYear());
      expect(range.end?.getHours()).toBe(23);
      expect(range.end?.getMinutes()).toBe(59);
      expect(range.end?.getSeconds()).toBe(59);
    });
  });

  describe("getThisWeekRange", () => {
    it("should return this week's date range", () => {
      const range = getThisWeekRange();

      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
      expect(range.start?.getDay()).toBe(1); // Monday
      expect(range.end?.getDay()).toBe(0); // Sunday

      // End date should be 6 days after start date
      const diffInDays = Math.floor(
        (range.end!.getTime() - range.start!.getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(diffInDays).toBe(6);
    });
  });

  describe("isDateInRange", () => {
    it("should return true for date within range", () => {
      const range: TaskDateRange = {
        start: new Date("2024-01-01T00:00:00"),
        end: new Date("2024-01-31T23:59:59"),
      };
      const date = new Date("2024-01-15T12:00:00");

      expect(isDateInRange(date, range)).toBe(true);
    });

    it("should return false for date outside range", () => {
      const range: TaskDateRange = {
        start: new Date("2024-01-01T00:00:00"),
        end: new Date("2024-01-31T23:59:59"),
      };
      const date = new Date("2024-02-01T00:00:00");

      expect(isDateInRange(date, range)).toBe(false);
    });

    it("should return false for invalid range", () => {
      const range: TaskDateRange = {
        start: null,
        end: new Date("2024-01-31T23:59:59"),
      };
      const date = new Date("2024-01-15T12:00:00");

      expect(isDateInRange(date, range)).toBe(false);
    });
  });

  describe("filterTasksByDate", () => {
    const mockTasks: Task[] = [
      {
        id: "12345678-1234-1234-1234-123456789001",
        name: "Task 1",
        done: false,
        pinned: false,
        color: "#ff0000",
        date: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "12345678-1234-1234-1234-123456789002",
        name: "Task 2",
        done: false,
        pinned: false,
        color: "#00ff00",
        date: new Date("2024-01-20T10:00:00"),
      },
      {
        id: "12345678-1234-1234-1234-123456789003",
        name: "Task 3",
        done: false,
        pinned: false,
        color: "#0000ff",
        date: new Date("2024-02-01T10:00:00"),
      },
    ];

    it("should return all tasks when filter is 'all'", () => {
      const filtered = filterTasksByDate(mockTasks, "all");
      expect(filtered).toHaveLength(3);
    });

    it("should filter tasks by custom date range", () => {
      const customRange: TaskDateRange = {
        start: new Date("2024-01-01T00:00:00"),
        end: new Date("2024-01-31T23:59:59"),
      };
      const filtered = filterTasksByDate(mockTasks, "customRange", customRange);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((t) => t.id)).toEqual([
        "12345678-1234-1234-1234-123456789001",
        "12345678-1234-1234-1234-123456789002",
      ]);
    });

    it("should return all tasks for invalid custom range", () => {
      const invalidRange: TaskDateRange = {
        start: null,
        end: null,
      };
      const filtered = filterTasksByDate(mockTasks, "customRange", invalidRange);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("getDateRangeDisplayString", () => {
    it("should return correct display strings", () => {
      expect(getDateRangeDisplayString("all")).toBe("All tasks");
      expect(getDateRangeDisplayString("today")).toBe("Today");
      expect(getDateRangeDisplayString("thisWeek")).toBe("This week");
      expect(getDateRangeDisplayString("customRange")).toBe("Custom range");
    });

    it("should format custom range correctly", () => {
      const customRange: TaskDateRange = {
        start: new Date("2024-01-15"),
        end: new Date("2024-01-20"),
      };
      const result = getDateRangeDisplayString("customRange", customRange);
      expect(result).toContain("1/15/2024");
      expect(result).toContain("1/20/2024");
    });
  });

  describe("isValidDateRange", () => {
    it("should return true for valid date range", () => {
      const range: TaskDateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      };
      expect(isValidDateRange(range)).toBe(true);
    });

    it("should return false for invalid date range", () => {
      const range: TaskDateRange = {
        start: null,
        end: new Date("2024-01-31"),
      };
      expect(isValidDateRange(range)).toBe(false);
    });

    it("should return false for reversed date range", () => {
      const range: TaskDateRange = {
        start: new Date("2024-01-31"),
        end: new Date("2024-01-01"),
      };
      expect(isValidDateRange(range)).toBe(false);
    });
  });
});
