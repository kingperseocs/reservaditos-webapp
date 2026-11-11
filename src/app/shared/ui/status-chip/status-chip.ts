import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusChipVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

/** Pill with a colored dot: «Activa», «Pedida primero», «Suspendida». */
@Component({
  selector: 'app-status-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"chip chip--" + variant()' },
  template: `<span class="dot" aria-hidden="true"></span><ng-content />`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid;
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }
    :host(.chip--info) {
      color: var(--rs-color-primary-text);
      background: var(--rs-color-primary-soft);
      border-color: var(--rs-color-primary-border);
    }
    :host(.chip--success) {
      color: var(--rs-color-success-text);
      background: var(--rs-color-success-soft);
      border-color: var(--rs-color-success-border);
    }
    :host(.chip--warning) {
      color: var(--rs-color-warning-title);
      background: var(--rs-color-warning-soft);
      border-color: var(--rs-color-warning-border);
    }
    :host(.chip--danger) {
      color: var(--rs-color-danger);
      background: var(--rs-color-danger-soft);
      border-color: var(--rs-color-danger-border);
    }
    :host(.chip--neutral) {
      color: var(--rs-color-text-muted);
      background: var(--rs-color-avatar);
      border-color: var(--rs-color-border);
    }
  `,
})
export class StatusChip {
  readonly variant = input<StatusChipVariant>('neutral');
}
