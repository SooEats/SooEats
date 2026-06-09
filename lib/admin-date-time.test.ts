import { describe, expect, it } from "vitest";
import { formatAdminDateTime, startOfAdminDay } from "./admin-date-time";

describe("admin date and time", () => {
  it("formats timestamps in Ontario time", () => {
    expect(formatAdminDateTime("2026-06-09T16:00:00.000Z")).toContain("12:00 p.m.");
  });

  it("finds midnight in Ontario during daylight-saving time", () => {
    expect(startOfAdminDay(new Date("2026-06-09T16:00:00.000Z")).toISOString()).toBe(
      "2026-06-09T04:00:00.000Z"
    );
  });

  it("finds midnight in Ontario during standard time", () => {
    expect(startOfAdminDay(new Date("2026-01-09T16:00:00.000Z")).toISOString()).toBe(
      "2026-01-09T05:00:00.000Z"
    );
  });
});
