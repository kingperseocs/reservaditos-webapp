import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../shared/models/api-error';
import { AdminArea } from '../models/area';
import { AreasApi } from './areas.api';
import { AreasStore } from './areas.store';

describe('AreasStore', () => {
  const grill: AdminArea = {
    id: 'grill',
    name: 'Parrilla',
    icon: 'flame',
    fee: 50,
    deposit: 100,
    status: 'ACTIVE',
    suspensions: [],
  };
  const result = {
    paidCount: 2,
    refundAmount: 300,
    unpaidCount: 0,
    suspension: { id: 's1', from: '2026-11-20', to: '2026-11-22', reason: 'Mantenimiento' },
  };
  const api = {
    list: vi.fn(() => of([grill])),
    previewSuspension: vi.fn(() => of({ paidCount: 2, refundAmount: 300, unpaidCount: 0 })),
    suspend: vi.fn(() => of(result)),
  };

  const createStore = () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: AreasApi, useValue: api }],
    });
    return TestBed.inject(AreasStore);
  };

  beforeEach(() => vi.clearAllMocks());

  it('loads the building areas', async () => {
    const store = createStore();

    await store.load();

    expect(store.areas()).toEqual([grill]);
    expect(store.loaded()).toBe(true);
  });

  it('suspends an area and reloads the list', async () => {
    const store = createStore();
    const request = { reason: 'Mantenimiento', from: '2026-11-20', to: '2026-11-22' };

    const outcome = await store.suspend('grill', request);

    expect(api.suspend).toHaveBeenCalledWith('grill', request);
    expect(outcome).toEqual({ ok: true, result });
    expect(api.list).toHaveBeenCalledTimes(1);
  });

  it('returns the backend message when the suspension fails', async () => {
    const error: ApiError = {
      statusCode: 400,
      code: 'SUSPENSION_IN_PAST',
      message: 'La suspensión no puede empezar en una fecha pasada.',
    };
    api.suspend.mockReturnValueOnce(throwError(() => error));
    const store = createStore();

    const outcome = await store.suspend('grill', {
      reason: 'x',
      from: '2026-11-01',
      to: '2026-11-02',
    });

    expect(outcome).toEqual({ ok: false, error });
  });
});
