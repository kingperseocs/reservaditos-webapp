import { AdminReservation } from '../app/features/reservations/models/reservation';

let sequence = 0;

/** Builds an AdminReservation like the ones the backend returns. */
export function aReservation(overrides: Partial<AdminReservation> = {}): AdminReservation {
  sequence += 1;
  return {
    id: `res-${sequence}`,
    status: 'PENDING_APPROVAL',
    resident: { id: 'ana-perez', name: 'Ana Pérez', apartment: '502' },
    area: { id: 'grill', name: 'Parrilla', icon: 'flame' },
    date: '2026-11-14',
    slot: { start: '12:00', end: '15:00', label: '12:00–15:00' },
    requestedAt: '2026-11-11T12:00:00.000Z',
    firstInLine: false,
    ...overrides,
  };
}
