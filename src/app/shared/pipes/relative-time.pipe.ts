import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "hace 20 min", "hace 2 h", "hace 1 día" — the "Pedida hace" column.
 * Pure function so it can be tested and reused outside templates.
 */
export function relativeTime(value: string | Date, now: Date = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - new Date(value).getTime());
  if (elapsed < MINUTE) return 'hace un momento';
  if (elapsed < HOUR) return `hace ${Math.floor(elapsed / MINUTE)} min`;
  if (elapsed < DAY) return `hace ${Math.floor(elapsed / HOUR)} h`;
  const days = Math.floor(elapsed / DAY);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, now?: Date): string {
    return value ? relativeTime(value, now) : '';
  }
}
