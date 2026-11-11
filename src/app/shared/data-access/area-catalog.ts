import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { APP_CONFIG } from '../../core/config/app-config.token';

export interface AreaOption {
  id: string;
  name: string;
}

/**
 * The building's areas (id + name) for filters and labels, shared by any feature.
 * Loaded once and cached; feature-specific details stay in each feature's API.
 */
@Injectable({ providedIn: 'root' })
export class AreaCatalog {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(APP_CONFIG).apiBaseUrl}/admin/areas`;
  private readonly _areas = signal<AreaOption[]>([]);
  private requested = false;

  readonly areas = this._areas.asReadonly();

  load(): void {
    if (this.requested) return;
    this.requested = true;
    this.http.get<AreaOption[]>(this.url).subscribe({
      next: (areas) => this._areas.set(areas.map(({ id, name }) => ({ id, name }))),
      error: () => (this.requested = false),
    });
  }
}
