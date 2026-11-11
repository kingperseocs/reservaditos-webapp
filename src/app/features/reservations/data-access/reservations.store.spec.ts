import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { aReservation } from '../../../../testing/reservation.fixtures';
import { NavBadges } from '../../../core/state/nav-badges';
import { ApiError } from '../../../shared/models/api-error';
import { AdminReservation } from '../models/reservation';
import { ReservationsApi } from './reservations.api';
import { ReservationsStore } from './reservations.store';

describe('ReservationsStore', () => {
  let pending: AdminReservation[];
  const api = {
    list: vi.fn(() => of(pending)),
    approve: vi.fn(() => of({})),
    reject: vi.fn(() => of({})),
  };

  const createStore = () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: ReservationsApi, useValue: api }],
    });
    return TestBed.inject(ReservationsStore);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    pending = [
      aReservation({ id: 'jorge', area: { id: 'grill', name: 'Parrilla', icon: 'flame' } }),
      aReservation({
        id: 'lucia',
        date: '2026-12-05',
        area: { id: 'multipurpose-room', name: 'Salón de usos múltiples', icon: 'users' },
      }),
    ];
  });

  it('loads every pending request and updates the sidebar counter', async () => {
    const store = createStore();

    await store.load();

    expect(api.list).toHaveBeenCalledWith({ status: 'PENDING_APPROVAL' });
    expect(store.totalPending()).toBe(2);
    expect(TestBed.inject(NavBadges).counts()['/reservas']).toBe(2);
  });

  it('filters by area and month on the client', async () => {
    const store = createStore();
    await store.load();

    store.setFilters({ areaId: null, month: '2026-11' });
    expect(store.visible().map((r) => r.id)).toEqual(['jorge']);

    store.setFilters({ areaId: 'multipurpose-room', month: null });
    expect(store.visible().map((r) => r.id)).toEqual(['lucia']);
  });

  it('highlights requests that arrive after the first load (sent from the app)', async () => {
    const store = createStore();
    await store.load();
    expect(store.newIds().size).toBe(0);

    pending = [...pending, aReservation({ id: 'ana' })];
    await store.load();

    expect([...store.newIds()]).toEqual(['ana']);
  });

  it('approves, reloads and reports success', async () => {
    const store = createStore();
    await store.load();

    const result = await store.approve(pending[0]);

    expect(result).toEqual({ ok: true });
    expect(api.approve).toHaveBeenCalledWith('jorge');
    expect(api.list).toHaveBeenCalledTimes(2);
    expect(store.busyIds().size).toBe(0);
  });

  it('returns the backend message when approving breaks a rule', async () => {
    const error: ApiError = {
      statusCode: 409,
      code: 'NOT_FIRST_IN_LINE',
      message: 'Otro residente pidió este horario primero; resuelve esa solicitud antes.',
    };
    api.approve.mockReturnValueOnce(throwError(() => error));
    const store = createStore();

    const result = await store.approve(pending[0]);

    expect(result).toEqual({ ok: false, error });
  });

  it('sends the rejection reason', async () => {
    const store = createStore();

    await store.reject(pending[1], 'El área está en mantenimiento ese día.');

    expect(api.reject).toHaveBeenCalledWith('lucia', 'El área está en mantenimiento ese día.');
  });

  it('keeps the list and exposes the error when the backend is down', async () => {
    const store = createStore();
    await store.load();
    const down: ApiError = { statusCode: 0, code: 'NETWORK_ERROR', message: 'Sin conexión' };
    api.list.mockReturnValueOnce(throwError(() => down));

    await store.load();

    expect(store.error()).toEqual(down);
    expect(store.totalPending()).toBe(2);
  });
});
