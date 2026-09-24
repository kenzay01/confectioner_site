import { addDays, isBefore, isSameDay } from "date-fns";
import type { Masterclass } from "@/types/masterclass";

/** Parse YYYY-MM-DD (and optional time) as local calendar date — avoids UTC shift. */
export function parseMasterclassDate(value: string | undefined | null): Date {
  if (!value) return new Date(NaN);
  const datePart = value.split("T")[0];
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getMasterclassStartDate(mc: Masterclass): Date {
  return startOfLocalDay(parseMasterclassDate(mc.date));
}

export function getMasterclassEndDate(mc: Masterclass): Date {
  return endOfLocalDay(
    parseMasterclassDate(mc.dateEnd || mc.date)
  );
}

export function isMasterclassPast(mc: Masterclass, today: Date): boolean {
  return isBefore(getMasterclassEndDate(mc), startOfLocalDay(today));
}

export function masterclassOccursOnDay(mc: Masterclass, day: Date): boolean {
  const normalized = startOfLocalDay(day);
  const start = getMasterclassStartDate(mc);
  const endDay = startOfLocalDay(
    parseMasterclassDate(mc.dateEnd || mc.date)
  );

  if (mc.dateType === "single") {
    return isSameDay(start, normalized);
  }

  return normalized >= start && normalized <= endDay;
}

export function getMasterclassCalendarDays(mc: Masterclass): Date[] {
  if (mc.dateType === "single") {
    return [getMasterclassStartDate(mc)];
  }

  const days: Date[] = [];
  let current = getMasterclassStartDate(mc);
  const end = startOfLocalDay(parseMasterclassDate(mc.dateEnd || mc.date));

  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  return days;
}

export function sortMasterclassesByStart(
  list: Masterclass[],
  direction: "asc" | "desc" = "asc"
): Masterclass[] {
  return [...list].sort((a, b) => {
    const diff =
      getMasterclassStartDate(a).getTime() -
      getMasterclassStartDate(b).getTime();
    return direction === "asc" ? diff : -diff;
  });
}
