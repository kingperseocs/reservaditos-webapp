/** Mirrors the backend AdminReservationDto (GET /v1/admin/reservations). */
export type ReservationStatus =
  'PENDING_APPROVAL' | 'APPROVED' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED' | 'REFUNDED';

export interface Slot {
  start: string;
  end: string;
  label: string;
}

export interface AreaSummary {
  id: string;
  name: string;
  icon: string;
}

export interface ResidentSummary {
  id: string;
  name: string;
  apartment: string | null;
}

export interface AdminReservation {
  id: string;
  status: ReservationStatus;
  resident: ResidentSummary;
  area: AreaSummary;
  /** yyyy-MM-dd */
  date: string;
  slot: Slot;
  /** ISO instant */
  requestedAt: string;
  /** Earliest of several requests for the same slot («Pedida primero»). */
  firstInLine: boolean;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  areaId?: string;
  /** yyyy-MM */
  month?: string;
}
