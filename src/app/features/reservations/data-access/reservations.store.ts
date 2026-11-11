import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { NavBadges } from '../../../core/state/nav-badges';
import { ApiError } from '../../../shared/models/api-error';
import { toMonth } from '../../../shared/utils/month-options';
import { AdminReservation } from '../models/reservation';
import { ReservationsApi } from './reservations.api';

export interface RequestFilters {
  /** null = all areas */
  areaId: string | null;
  /** yyyy-MM, null = all dates */
  month: string | null;
}

export type ActionResult = { ok: true } | { ok: false; error: ApiError };

const NEW_HIGHLIGHT_MS = 6000;
const NAV_PATH = '/reservas';

/**
 * State of «Solicitudes por aprobar».
 * Always loads every pending request (a small list) and filters on the client,
 * so the sidebar counter shows the real total and filters respond instantly.
 */
@Injectable({ providedIn: 'root' })
export class ReservationsStore {
  private readonly api = inject(ReservationsApi);
  private readonly config = inject(APP_CONFIG);
  private readonly badges = inject(NavBadges);
  private readonly document = inject(DOCUMENT);

  private readonly _pending = signal<AdminReservation[]>([]);
  private readonly _loading = signal(false);
  private readonly _loaded = signal(false);
  private readonly _error = signal<ApiError | null>(null);
  private readonly _busyIds = signal<ReadonlySet<string>>(new Set());
  private readonly _newIds = signal<ReadonlySet<string>>(new Set());
  private readonly _now = signal(new Date());

  readonly filters = signal<RequestFilters>({ areaId: null, month: toMonth(new Date()) });

  readonly pending = this._pending.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();
  readonly busyIds = this._busyIds.asReadonly();
  readonly newIds = this._newIds.asReadonly();
  /** Reference time for «hace 2 h»; refreshed on every load. */
  readonly now = this._now.asReadonly();

  readonly totalPending = computed(() => this._pending().length);
  readonly visible = computed(() => {
    const { areaId, month } = this.filters();
    return this._pending().filter(
      (r) => (!areaId || r.area.id === areaId) && (!month || r.date.startsWith(month)),
    );
  });

  private knownIds: Set<string> | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private inFlight: Promise<void> | null = null;

  /** Starts the auto refresh. Safe to call many times. */
  startPolling(): void {
    if (this.timer) return;
    void this.load();
    this.timer = setInterval(() => {
      if (!this.document.hidden) void this.load();
    }, this.config.pollIntervalMs);
    this.document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  stopPolling(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  setFilters(patch: Partial<RequestFilters>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  /** Fetches the pending requests. Concurrent calls share the same request. */
  load(): Promise<void> {
    this.inFlight ??= this.fetch().finally(() => (this.inFlight = null));
    return this.inFlight;
  }

  async approve(reservation: AdminReservation): Promise<ActionResult> {
    return this.run(reservation.id, () => firstValueFrom(this.api.approve(reservation.id)));
  }

  async reject(reservation: AdminReservation, reason: string): Promise<ActionResult> {
    return this.run(reservation.id, () => firstValueFrom(this.api.reject(reservation.id, reason)));
  }

  private async fetch(): Promise<void> {
    this._loading.set(true);
    try {
      const pending = await firstValueFrom(this.api.list({ status: 'PENDING_APPROVAL' }));
      this.markNew(pending);
      this._pending.set(pending);
      this._error.set(null);
      this.badges.set(NAV_PATH, pending.length);
    } catch (error) {
      this._error.set(error as ApiError);
    } finally {
      this._now.set(new Date());
      this._loading.set(false);
      this._loaded.set(true);
    }
  }

  /** Requests that were not in the previous load get highlighted for a few seconds. */
  private markNew(pending: AdminReservation[]): void {
    const ids = pending.map((r) => r.id);
    if (this.knownIds) {
      const fresh = ids.filter((id) => !this.knownIds!.has(id));
      if (fresh.length) {
        this._newIds.update((current) => new Set([...current, ...fresh]));
        setTimeout(
          () =>
            this._newIds.update((current) => {
              const next = new Set(current);
              fresh.forEach((id) => next.delete(id));
              return next;
            }),
          NEW_HIGHLIGHT_MS,
        );
      }
    }
    this.knownIds = new Set(ids);
  }

  private async run(id: string, action: () => Promise<unknown>): Promise<ActionResult> {
    this._busyIds.update((ids) => new Set(ids).add(id));
    try {
      await action();
      await this.load();
      return { ok: true };
    } catch (error) {
      await this.load();
      return { ok: false, error: error as ApiError };
    } finally {
      this._busyIds.update((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  }

  private readonly onVisibilityChange = (): void => {
    if (!this.document.hidden) void this.load();
  };
}
