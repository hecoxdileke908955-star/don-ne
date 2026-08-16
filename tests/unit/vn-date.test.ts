import { getVnDateBoundaries } from '../../src/lib/vn-date';

// All fixed instants below are picked and verified against a real calendar:
// 2026-08-17 is a Monday, 2026-08-19 is a Wednesday (midweek),
// 2026-08-23 is a Sunday (same week as the Monday above).

describe('getVnDateBoundaries — VN (Asia/Ho_Chi_Minh, UTC+7) day/week boundaries', () => {
  test('Monday: startWeek is 00:00 VN of that same Monday', () => {
    // 2026-08-17 10:00 VN = 2026-08-17T03:00:00.000Z
    const now = new Date('2026-08-17T03:00:00.000Z');
    const { startWeek, startToday } = getVnDateBoundaries(now);
    // 00:00 VN on 2026-08-17 = 2026-08-16T17:00:00.000Z in UTC.
    expect(startWeek.toISOString()).toBe('2026-08-16T17:00:00.000Z');
    expect(startToday.toISOString()).toBe('2026-08-16T17:00:00.000Z');
  });

  test('midweek (Wednesday): startWeek rolls back to Monday of the same week', () => {
    // 2026-08-19 10:00 VN = 2026-08-19T03:00:00.000Z
    const now = new Date('2026-08-19T03:00:00.000Z');
    const { startWeek, startToday } = getVnDateBoundaries(now);
    // Monday of that week is still 2026-08-17 → 00:00 VN = 2026-08-16T17:00:00.000Z UTC.
    expect(startWeek.toISOString()).toBe('2026-08-16T17:00:00.000Z');
    // startToday must be Wednesday's own midnight, not Monday's.
    expect(startToday.toISOString()).toBe('2026-08-18T17:00:00.000Z');
  });

  test('Sunday: startWeek rolls back to the Monday of the CURRENT week, never forward', () => {
    // 2026-08-23 is the Sunday closing the same week as Monday 2026-08-17.
    // 10:00 VN = 2026-08-23T03:00:00.000Z
    const now = new Date('2026-08-23T03:00:00.000Z');
    const { startWeek, startToday } = getVnDateBoundaries(now);
    // Must still resolve to 2026-08-17 Monday — NOT 2026-08-24 (next Monday).
    expect(startWeek.toISOString()).toBe('2026-08-16T17:00:00.000Z');
    expect(startToday.toISOString()).toBe('2026-08-22T17:00:00.000Z');
  });

  test('VN midnight boundary: 00:00 Asia/Ho_Chi_Minh is 17:00 UTC of the previous UTC day', () => {
    // Exactly at VN midnight on 2026-08-17 (00:00:00 VN).
    const now = new Date('2026-08-16T17:00:00.000Z');
    const { startToday, startTomorrow, startYesterday } = getVnDateBoundaries(now);
    expect(startToday.toISOString()).toBe('2026-08-16T17:00:00.000Z');
    expect(startTomorrow.toISOString()).toBe('2026-08-17T17:00:00.000Z');
    expect(startYesterday.toISOString()).toBe('2026-08-15T17:00:00.000Z');
  });

  test('a record 1ms before VN midnight still belongs to the previous VN day', () => {
    // 2026-08-16T16:59:59.999Z is 2026-08-16T23:59:59.999 VN — still Aug 16 VN, not Aug 17.
    const justBefore = new Date('2026-08-16T16:59:59.999Z');
    const now = new Date('2026-08-17T03:00:00.000Z'); // "now" is Aug 17 VN
    const { startToday } = getVnDateBoundaries(now);
    expect(justBefore.getTime()).toBeLessThan(startToday.getTime());
  });
});
