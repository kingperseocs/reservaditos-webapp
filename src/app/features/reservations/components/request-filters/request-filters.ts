import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { AreaOption } from '../../../../shared/data-access/area-catalog';
import { MonthOption } from '../../../../shared/utils/month-options';
import { RequestFilters } from '../../data-access/reservations.store';

/** mat-select shows nothing for a null value, so «Todas» uses a sentinel. */
const ALL = 'all';

/** «Área: Todas ⌄» and «Fecha: Noviembre 2026 ⌄» from the Figma. */
@Component({
  selector: 'app-request-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule],
  template: `
    <div class="filter">
      <span class="filter-label" id="area-filter-label">Área:</span>
      <mat-select
        class="filter-select"
        aria-labelledby="area-filter-label"
        panelWidth=""
        [value]="filters().areaId ?? ALL"
        (valueChange)="changed.emit({ areaId: fromOption($event) })"
      >
        <mat-option [value]="ALL">Todas</mat-option>
        @for (area of areas(); track area.id) {
          <mat-option [value]="area.id">{{ area.name }}</mat-option>
        }
      </mat-select>
    </div>

    <div class="filter">
      <span class="filter-label" id="month-filter-label">Fecha:</span>
      <mat-select
        class="filter-select"
        aria-labelledby="month-filter-label"
        panelWidth=""
        [value]="filters().month ?? ALL"
        (valueChange)="changed.emit({ month: fromOption($event) })"
      >
        <mat-option [value]="ALL">Todas las fechas</mat-option>
        @for (month of months(); track month.value) {
          <mat-option [value]="month.value">{{ month.label }}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .filter {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 12px 0 16px;
      background: var(--rs-color-surface);
      border: 1px solid var(--rs-color-border);
      border-radius: var(--rs-radius-sm);
      font-size: 15px;
    }
    .filter:focus-within {
      border-color: var(--rs-color-primary);
    }
    .filter-label {
      color: var(--rs-color-text-muted);
    }
    .filter-select {
      --mat-select-enabled-trigger-text-color: var(--rs-color-text);
      --mat-select-trigger-text-size: 15px;
      --mat-select-trigger-text-weight: 500;
      --mat-select-enabled-arrow-color: var(--rs-color-text);
      width: auto;
      min-width: 60px;
    }
  `,
})
export class RequestFiltersBar {
  readonly filters = input.required<RequestFilters>();
  readonly areas = input.required<AreaOption[]>();
  readonly months = input.required<MonthOption[]>();
  readonly changed = output<Partial<RequestFilters>>();

  protected readonly ALL = ALL;

  protected fromOption(value: string): string | null {
    return value === ALL ? null : value;
  }
}
