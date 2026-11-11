import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { AdminArea, SuspendAreaRequest, SuspensionImpact, SuspensionResult } from '../models/area';

/** HTTP access to the administration area endpoints. No state, no UI. */
@Injectable({ providedIn: 'root' })
export class AreasApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/admin/areas`;

  list(): Observable<AdminArea[]> {
    return this.http.get<AdminArea[]>(this.baseUrl);
  }

  previewSuspension(areaId: string, from: string, to: string): Observable<SuspensionImpact> {
    return this.http.get<SuspensionImpact>(`${this.baseUrl}/${areaId}/suspensions/preview`, {
      params: { from, to },
    });
  }

  suspend(areaId: string, request: SuspendAreaRequest): Observable<SuspensionResult> {
    return this.http.post<SuspensionResult>(`${this.baseUrl}/${areaId}/suspensions`, request);
  }
}
