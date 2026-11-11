export interface MonthOption {
  /** yyyy-MM */
  value: string;
  /** «Noviembre 2026» */
  label: string;
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/** yyyy-MM of a date in local time. */
export function toMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** The current month and the next ones, for the «Fecha» filter. */
export function upcomingMonths(from: Date, count = 3): MonthOption[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(from.getFullYear(), from.getMonth() + i, 1);
    return { value: toMonth(date), label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}` };
  });
}
