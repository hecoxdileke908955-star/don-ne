// Dọn Nè operates on Vietnam time (Asia/Ho_Chi_Minh, UTC+7, no DST) — but
// Postgres/Prisma store and compare `createdAt` in UTC. Using UTC midnight
// directly as a day boundary would misclassify any record created between
// 00:00–07:00 VN time into the wrong VN calendar day. These helpers convert
// "today/yesterday/this week in Vietnam" into the correct UTC instants to
// use as Prisma `gte`/`lt` range boundaries, without adding a timezone
// library — the +7h offset is fixed and never changes (no DST in Vietnam).
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Reads the VN wall-clock calendar date/weekday for a given real-time
 * instant, by shifting it +7h and reading the UTC calendar fields of that
 * shifted instant (which then equal the VN local calendar fields).
 */
function vnCalendarParts(instant: Date) {
  const shifted = new Date(instant.getTime() + VN_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(), // 0=Sun..6=Sat, in VN wall-clock terms
  };
}

/** The real UTC instant corresponding to 00:00 VN time on the given VN calendar date. */
function startOfVnDay(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 0, 0, 0) - VN_OFFSET_MS);
}

export interface VnDateBoundaries {
  /** 00:00 VN today, as a UTC instant. */
  startToday: Date;
  /** 00:00 VN tomorrow, as a UTC instant — the exclusive upper bound for "today". */
  startTomorrow: Date;
  /** 00:00 VN yesterday, as a UTC instant. */
  startYesterday: Date;
  /** 00:00 VN on the Monday of the current week, as a UTC instant. */
  startWeek: Date;
}

/** All VN-calendar boundaries needed by the Dashboard, computed from one `now`. */
export function getVnDateBoundaries(now: Date = new Date()): VnDateBoundaries {
  const { year, month, day, weekday } = vnCalendarParts(now);
  // weekday: Sun=0..Sat=6. Days since the most recent Monday: Mon(1)->0, Tue(2)->1, ..., Sun(0)->6.
  const daysSinceMonday = (weekday + 6) % 7;
  return {
    startToday: startOfVnDay(year, month, day),
    startTomorrow: startOfVnDay(year, month, day + 1),
    startYesterday: startOfVnDay(year, month, day - 1),
    startWeek: startOfVnDay(year, month, day - daysSinceMonday),
  };
}
