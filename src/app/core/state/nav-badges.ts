import { Injectable, signal } from '@angular/core';

/**
 * Counters shown next to the sidebar items (e.g. pending requests).
 * Features write them; the shell reads them, so core never depends on features.
 */
@Injectable({ providedIn: 'root' })
export class NavBadges {
  private readonly _counts = signal<Readonly<Record<string, number>>>({});

  readonly counts = this._counts.asReadonly();

  set(path: string, count: number): void {
    this._counts.update((counts) => ({ ...counts, [path]: count }));
  }
}
