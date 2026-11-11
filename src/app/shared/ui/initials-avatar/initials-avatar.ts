import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Round avatar with the person's initials: "María Torres" → "MT". */
@Component({
  selector: 'app-initials-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ initials() }}`,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--rs-color-avatar);
      color: #475569;
      font-size: 12px;
      font-weight: 600;
    }
  `,
})
export class InitialsAvatar {
  readonly name = input.required<string>();

  protected readonly initials = computed(() =>
    this.name()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join(''),
  );
}
