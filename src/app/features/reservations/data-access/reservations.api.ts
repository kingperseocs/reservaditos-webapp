import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AdminReservation, ReservationFilters } from '../models/reservation';

/** HTTP access to the administration reservation endpoints. No state, no UI. */
@Injectable({ providedIn: 'root' })
export class ReservationsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/admin/reservations`;

  list(filters: ReservationFilters = {}): Observable<AdminReservation[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params = params.set(key, value);
    }
    return this.http.get<AdminReservation[]>(this.baseUrl, { params });
  }

  approve(id: string): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: string, reason: string): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/${id}/reject`, { reason });
  }
}
