import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DayFirstDateAdapter } from './day-first-date-adapter';

describe('DayFirstDateAdapter', () => {
  let adapter: DayFirstDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        DayFirstDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
      ],
    });
    adapter = TestBed.inject(DayFirstDateAdapter);
  });

  it('reads typed dates as day/month/year', () => {
    const date = adapter.parse('14/11/2026');

    expect(date).toEqual(new Date(2026, 10, 14));
  });

  it('accepts single digits and other separators', () => {
    expect(adapter.parse('5-1-2027')).toEqual(new Date(2027, 0, 5));
    expect(adapter.parse('05.01.2027')).toEqual(new Date(2027, 0, 5));
  });

  it('marks dates that do not exist as invalid', () => {
    const date = adapter.parse('31/02/2027');

    expect(date && adapter.isValid(date)).toBe(false);
  });

  it('shows dates as dd/MM/yyyy', () => {
    expect(adapter.format(new Date(2026, 10, 14), {})).toMatch(/^14\/11\/2026$/);
  });
});
