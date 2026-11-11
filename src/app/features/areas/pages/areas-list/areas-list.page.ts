import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../../../../core/config/app-config.token';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { toDayMonth } from '../../../../shared/utils/local-date';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { AreasTable } from '../../components/areas-table/areas-table';
import {
  SuspendAreaDialog,
  SuspendAreaDialogData,
} from '../../components/suspend-area-dialog/suspend-area-dialog';
import { AreasStore } from '../../data-access/areas.store';
import { AdminArea, SuspendAreaRequest, SuspensionResult } from '../../models/area';

/** Screen 6 · Áreas comunes and «Suspender área». */
@Component({
  selector: 'app-areas-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, EmptyState, AreasTable, MatButtonModule, MatProgressBarModule],
  template: `
    <app-page-header title="Áreas comunes" [subtitle]="subtitle()" />

    @if (store.error(); as error) {
      <div class="error-banner" role="alert">
        <span class="material-symbols-outlined" aria-hidden="true">cloud_off</span>
        <span>{{ error.message }}</span>
        <button mat-button (click)="reload()">Reintentar</button>
      </div>
    }

    @if (!store.error() || store.areas().length > 0) {
      <section class="card" aria-label="Áreas comunes">
        @if (store.loading() && !store.loaded()) {
          <mat-progress-bar mode="indeterminate" />
        }
        @if (store.areas().length > 0) {
          <app-areas-table [areas]="store.areas()" (suspendRequested)="openSuspendDialog($event)" />
        } @else if (store.loaded()) {
          <app-empty-state icon="grid_view" title="Este edificio no tiene áreas registradas" />
        }
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 1280px;
    }
    .card {
      overflow: hidden;
      background: var(--rs-color-surface);
      border: 1px solid var(--rs-color-border);
      border-radius: var(--rs-radius-md);
      --rs-empty-border: 0;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding: 10px 12px 10px 16px;
      border: 1px solid var(--rs-color-danger-border);
      border-radius: var(--rs-radius-sm);
      background: var(--rs-color-danger-soft);
      color: var(--rs-color-danger);
      font-size: 14px;
    }
    .error-banner span:nth-child(2) {
      flex: 1;
    }
  `,
})
export class AreasListPage implements OnInit {
  protected readonly store = inject(AreasStore);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);
  private readonly buildingName = inject(APP_CONFIG).buildingName;

  protected readonly subtitle = computed(() => {
    const count = this.store.areas().length;
    if (!this.store.loaded()) return this.buildingName;
    return `${count} ${count === 1 ? 'área' : 'áreas'} en ${this.buildingName}`;
  });

  ngOnInit(): void {
    void this.store.load();
  }

  protected reload(): void {
    void this.store.load();
  }

  protected async openSuspendDialog(area: AdminArea): Promise<void> {
    const request = await firstValueFrom(
      this.dialog
        .open<SuspendAreaDialog, SuspendAreaDialogData, SuspendAreaRequest>(SuspendAreaDialog, {
          data: { area, preview: (from, to) => this.store.preview(area.id, from, to) },
          autoFocus: 'textarea',
        })
        .afterClosed(),
    );
    if (!request) return;

    const outcome = await this.store.suspend(area.id, request);
    if (outcome.ok) {
      this.notifications.success(this.successMessage(area, outcome.result));
    } else {
      this.notifications.error(outcome.error.message);
    }
  }

  private successMessage(area: AdminArea, result: SuspensionResult): string {
    const { from, to } = result.suspension;
    const range =
      from === to ? `el ${toDayMonth(from)}` : `del ${toDayMonth(from)} al ${toDayMonth(to)}`;
    const refunds =
      result.paidCount > 0
        ? ` Se devolvieron S/ ${result.refundAmount} a ${result.paidCount} ${result.paidCount === 1 ? 'residente' : 'residentes'}.`
        : '';
    return `${area.name} suspendida ${range}.${refunds}`;
  }
}
