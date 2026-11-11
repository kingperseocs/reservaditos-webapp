import { relativeTime } from './relative-time.pipe';
import { shortDate } from './short-date.pipe';

describe('shortDate', () => {
  it('formats a business date like the Figma table', () => {
    expect(shortDate('2026-11-14')).toBe('Sáb 14/11');
    expect(shortDate('2026-11-15')).toBe('Dom 15/11');
    expect(shortDate('2026-11-13')).toBe('Vie 13/11');
  });
});

describe('relativeTime', () => {
  const now = new Date('2026-11-11T14:00:00Z');
  const ago = (ms: number) => new Date(now.getTime() - ms);

  it('uses minutes, hours and days', () => {
    expect(relativeTime(ago(20 * 60_000), now)).toBe('hace 20 min');
    expect(relativeTime(ago(2 * 3_600_000), now)).toBe('hace 2 h');
    expect(relativeTime(ago(26 * 3_600_000), now)).toBe('hace 1 día');
    expect(relativeTime(ago(3 * 86_400_000), now)).toBe('hace 3 días');
  });

  it('says "hace un momento" for very recent requests', () => {
    expect(relativeTime(ago(10_000), now)).toBe('hace un momento');
  });
});
