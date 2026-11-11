import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AreaIcon } from '../../../../shared/ui/area-icon/area-icon';
import { StatusChip } from '../../../../shared/ui/status-chip/status-chip';
import { toDayMonth } from '../../../../shared/utils/local-date';
import { AdminArea, Suspension } from '../../models/area';

/** Table of screen 6. Presentational: areas in, «Suspender» clicks out. */
@Component({
  selector: 'app-areas-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, AreaIcon, StatusChip],
  template: `
    <table mat-table [dataSource]="areas()" [trackBy]="trackById" class="areas-table">
      <ng-container matColumnDef="area">
        <th mat-header-cell *matHeaderCellDef>Área</th>
        <td mat-cell *matCellDef="let area">
          <span class="area">
            <app-area-icon [icon]="area.icon" />
            <span>
              <span class="area-name">{{ area.name }}</span>
              @for (suspension of area.suspensions; track suspension.id) {
                <span class="area-note">
                  {{ suspensionLabel(suspension) }}
                </span>
              }
            </span>
          </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="fee">
        <th mat-header-cell *matHeaderCellDef>Tarifa</th>
        <td mat-cell *matCellDef="let area">S/ {{ area.fee }}</td>
      </ng-container>

      <ng-container matColumnDef="deposit">
        <th mat-header-cell *matHeaderCellDef>Garantía</th>
        <td mat-cell *matCellDef="let area">S/ {{ area.deposit }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let area">
          @if (area.status === 'SUSPENDED') {
            <app-status-chip variant="danger">Suspendida</app-status-chip>
          } @else {
            <app-status-chip variant="success">Activa</app-status-chip>
          }
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef class="actions-header">Acciones</th>
        <td mat-cell *matCellDef="let area" class="actions-cell">
          <button
            mat-stroked-button
            class="suspend"
            [attr.aria-label]="'Suspender ' + area.name"
            (click)="suspendRequested.emit(area)"
          >
            Suspender
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let area; columns: columns"></tr>
    </table>
  `,
  styleUrl: './areas-table.scss',
})
export class AreasTable {
  readonly areas = input.required<AdminArea[]>();
  readonly suspendRequested = output<AdminArea>();

  protected readonly columns = ['area', 'fee', 'deposit', 'status', 'actions'];
  protected readonly trackById = (_: number, area: AdminArea): string => area.id;
  protected suspensionLabel({ from, to }: Suspension): string {
    return from === to
      ? `Suspendida ${toDayMonth(from)}`
      : `Suspendida ${toDayMonth(from)}–${toDayMonth(to)}`;
  }
}
