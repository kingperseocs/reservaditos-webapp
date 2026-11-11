/** Mirrors the backend AdminAreaDto and suspension DTOs. */
export interface Suspension {
  id: string;
  /** yyyy-MM-dd */
  from: string;
  /** yyyy-MM-dd */
  to: string;
  reason: string;
}

export interface AdminArea {
  id: string;
  name: string;
  /** Icon key from the backend: flame | users | waves */
  icon: string;
  fee: number;
  deposit: number;
  status: 'ACTIVE' | 'SUSPENDED';
  suspensions: Suspension[];
}

export interface SuspensionImpact {
  /** Paid bookings that will be refunded 100 % */
  paidCount: number;
  refundAmount: number;
  /** Pending or approved bookings that will be rejected */
  unpaidCount: number;
}

export interface SuspendAreaRequest {
  reason: string;
  from: string;
  to: string;
}

export interface SuspensionResult extends SuspensionImpact {
  suspension: Suspension;
}
