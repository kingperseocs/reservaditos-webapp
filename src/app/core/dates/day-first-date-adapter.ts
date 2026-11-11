import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

const DAY_FIRST = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;

/**
 * The native adapter parses typed dates as month/day (US). In Peru dates are
 * written day/month, so "14/11/2026" must be 14 November, not an invalid date.
 * Display stays as the native one, which already prints dd/MM/yyyy for es-PE.
 */
@Injectable()
export class DayFirstDateAdapter extends NativeDateAdapter {
  override parse(value: unknown, parseFormat?: unknown): Date | null {
    if (typeof value === 'string') {
      const match = DAY_FIRST.exec(value.trim());
      if (match) {
        const [day, month, year] = match.slice(1).map(Number);
        const date = new Date(year, month - 1, day);
        const exists = date.getMonth() === month - 1 && date.getDate() === day;
        return exists ? date : this.invalid();
      }
    }
    return super.parse(value, parseFormat);
  }
}
