import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiError } from '../../../shared/models/api-error';
import { AdminArea, SuspendAreaRequest, SuspensionImpact, SuspensionResult } from '../models/area';
import { AreasApi } from './areas.api';

export type SuspendResult = { ok: true; result: SuspensionResult } | { ok: false; error: ApiError };

/** State of «Áreas comunes»: the area list and the suspension action. */
@Injectable({ providedIn: 'root' })
export class AreasStore {
  private readonly api = inject(AreasApi);

  private readonly _areas = signal<AdminArea[]>([]);
  private readonly _loading = signal(false);
  private readonly _loaded = signal(false);
  private readonly _error = signal<ApiError | null>(null);

  readonly areas = this._areas.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();

  async load(): Promise<void> {
    this._loading.set(true);
    try {
      this._areas.set(await firstValueFrom(this.api.list()));
      this._error.set(null);
    } catch (error) {
      this._error.set(error as ApiError);
    } finally {
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  /** How many bookings a suspension would refund or reject (shown before confirming). */
  preview(areaId: string, from: string, to: string): Observable<SuspensionImpact> {
    return this.api.previewSuspension(areaId, from, to);
  }

  async suspend(areaId: string, request: SuspendAreaRequest): Promise<SuspendResult> {
    try {
      const result = await firstValueFrom(this.api.suspend(areaId, request));
      await this.load();
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error as ApiError };
    }
  }
}
