import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Friendly placeholder for empty lists and pages that are not built yet. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="empty-state">
      <span class="material-symbols-outlined icon" aria-hidden="true">{{ icon() }}</span>
      <h2>{{ title() }}</h2>
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 56px 24px;
      background: var(--rs-color-surface);
      border: var(--rs-empty-border, 1px solid var(--rs-color-border));
      border-radius: var(--rs-radius-md);
    }
    .icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--rs-color-primary);
      margin-bottom: 12px;
    }
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    p {
      margin: 6px 0 0;
      max-width: 420px;
      font-size: 14px;
      color: var(--rs-color-text-muted);
    }
  `,
})
export class EmptyState {
  readonly icon = input('inbox');
  readonly title = input.required<string>();
  readonly description = input<string>();
}
