import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { ShortDatePipe } from '../../../../shared/pipes/short-date.pipe';
import { InitialsAvatar } from '../../../../shared/ui/initials-avatar/initials-avatar';
import { StatusChip } from '../../../../shared/ui/status-chip/status-chip';
import { AdminReservation } from '../../models/reservation';

/** Table of screen 5. Presentational: data in, approve/reject events out. */
@Component({
  selector: 'app-requests-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    InitialsAvatar,
    StatusChip,
    RelativeTimePipe,
    ShortDatePipe,
  ],
  templateUrl: './requests-table.html',
  styleUrl: './requests-table.scss',
})
export class RequestsTable {
  readonly requests = input.required<AdminReservation[]>();
  readonly now = input.required<Date>();
  readonly busyIds = input<ReadonlySet<string>>(new Set());
  readonly newIds = input<ReadonlySet<string>>(new Set());

  readonly approve = output<AdminReservation>();
  readonly reject = output<AdminReservation>();

  /** Keeps existing rows (and their buttons) when the list refreshes every 10 s. */
  protected readonly trackById = (_: number, request: AdminReservation): string => request.id;

  protected readonly columns = [
    'resident',
    'apartment',
    'area',
    'date',
    'slot',
    'requestedAt',
    'actions',
  ];
}
