import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { AreaCatalog } from '../../../../shared/data-access/area-catalog';
import { upcomingMonths } from '../../../../shared/utils/month-options';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { RejectDialog } from '../../components/reject-dialog/reject-dialog';
import { RequestFiltersBar } from '../../components/request-filters/request-filters';
import { RequestsTable } from '../../components/requests-table/requests-table';
import { RequestFilters, ReservationsStore } from '../../data-access/reservations.store';
import { AdminReservation } from '../../models/reservation';

/** Screen 5 · Solicitudes por aprobar. */
@Component({
  selector: 'app-pending-requests-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeader,
    EmptyState,
    RequestFiltersBar,
    RequestsTable,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './pending-requests.page.html',
  styleUrl: './pending-requests.page.scss',
})
export class PendingRequestsPage implements OnInit {
  protected readonly store = inject(ReservationsStore);
  private readonly catalog = inject(AreaCatalog);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);

  protected readonly areas = this.catalog.areas;
  protected readonly months = upcomingMonths(new Date());

  protected readonly subtitle = computed(() => {
    const total = this.store.totalPending();
    if (this.store.error() && total === 0) return 'Sin conexión con el servidor';
    if (total === 0) return 'No hay pedidos esperando respuesta';
    return total === 1 ? '1 pedido espera respuesta' : `${total} pedidos esperan respuesta`;
  });

  protected readonly footer = computed(() => {
    const shown = this.store.visible().length;
    return shown === 1 ? 'Mostrando 1 solicitud' : `Mostrando ${shown} solicitudes`;
  });

  ngOnInit(): void {
    this.catalog.load();
    this.store.startPolling();
  }

  protected onFiltersChange(patch: Partial<RequestFilters>): void {
    this.store.setFilters(patch);
  }

  protected refresh(): void {
    void this.store.load();
  }

  protected async approve(request: AdminReservation): Promise<void> {
    const result = await this.store.approve(request);
    if (result.ok) {
      this.notifications.success(
        `Solicitud de ${request.resident.name} aprobada. Ya tiene su link de pago.`,
      );
    } else {
      this.notifications.error(result.error.message);
    }
  }

  protected async reject(request: AdminReservation): Promise<void> {
    const reason = await firstValueFrom(
      this.dialog
        .open<RejectDialog, AdminReservation, string>(RejectDialog, {
          data: request,
          autoFocus: 'textarea',
        })
        .afterClosed(),
    );
    if (!reason) return;

    const result = await this.store.reject(request, reason);
    if (result.ok) {
      this.notifications.success(`Solicitud de ${request.resident.name} rechazada.`);
    } else {
      this.notifications.error(result.error.message);
    }
  }
}
