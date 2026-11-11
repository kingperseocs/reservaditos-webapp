import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Page title + subtitle, as in "Solicitudes por aprobar · 6 pedidos esperan respuesta". */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div>
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <div class="actions"><ng-content /></div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      line-height: 36px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    p {
      margin: 2px 0 0;
      font-size: 14px;
      color: var(--rs-color-text-muted);
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
