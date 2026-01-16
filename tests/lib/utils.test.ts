import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatRelativeDate,
  truncate,
  getInitials,
  getStatusColor,
  getPriorityColor,
} from "@/lib/utils";

describe("cn", () => {
  it("combines class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("handles undefined values", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });
});

describe("formatDate", () => {
  it("formats a date object", () => {
    const date = new Date("2024-03-15T10:00:00Z");
    expect(formatDate(date)).toMatch(/Mar/);
    expect(formatDate(date)).toMatch(/15/);
    expect(formatDate(date)).toMatch(/2024/);
  });

  it("formats a date string", () => {
    const result = formatDate("2024-06-20");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/20/);
    expect(result).toMatch(/2024/);
  });
});

describe("formatRelativeDate", () => {
  it('returns "just now" for recent dates', () => {
    const now = new Date();
    expect(formatRelativeDate(now)).toBe("just now");
  });

  it("returns minutes ago", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeDate(fiveMinutesAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoHoursAgo)).toBe("2h ago");
  });

  it("returns days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(threeDaysAgo)).toBe("3d ago");
  });
});

describe("truncate", () => {
  it("returns original text if shorter than max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long text with ellipsis", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("getInitials", () => {
  it("returns first letters of first and last name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("handles single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("handles multiple names", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("returns uppercase", () => {
    expect(getInitials("john doe")).toBe("JD");
  });
});

describe("getStatusColor", () => {
  it("returns correct color for todo", () => {
    expect(getStatusColor("todo")).toContain("gray");
  });

  it("returns correct color for in_progress", () => {
    expect(getStatusColor("in_progress")).toContain("blue");
  });

  it("returns correct color for review", () => {
    expect(getStatusColor("review")).toContain("yellow");
  });

  it("returns correct color for done", () => {
    expect(getStatusColor("done")).toContain("green");
  });

  it("returns default for unknown status", () => {
    expect(getStatusColor("unknown")).toContain("gray");
  });
});

describe("getPriorityColor", () => {
  it("returns correct color for low", () => {
    expect(getPriorityColor("low")).toContain("gray");
  });

  it("returns correct color for medium", () => {
    expect(getPriorityColor("medium")).toContain("blue");
  });

  it("returns correct color for high", () => {
    expect(getPriorityColor("high")).toContain("orange");
  });

  it("returns correct color for urgent", () => {
    expect(getPriorityColor("urgent")).toContain("red");
  });
});
