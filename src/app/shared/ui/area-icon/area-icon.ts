import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Backend icon keys → Material Symbols, as drawn in the Figma. */
const ICONS: Record<string, string> = {
  flame: 'local_fire_department',
  users: 'group',
  waves: 'pool',
};

export const areaIconName = (key: string): string => ICONS[key] ?? 'meeting_room';

/** Light blue square with the area icon (Parrilla, Salón, Piscina). */
@Component({
  selector: 'app-area-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="material-symbols-outlined" aria-hidden="true">{{ name() }}</span>`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: var(--rs-radius-sm);
      background: var(--rs-color-primary-soft);
      color: var(--rs-color-primary);
    }
    span {
      font-size: 22px;
    }
  `,
})
export class AreaIcon {
  readonly icon = input.required<string>();
  protected readonly name = computed(() => areaIconName(this.icon()));
}
