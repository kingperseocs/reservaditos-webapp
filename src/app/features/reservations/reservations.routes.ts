import { Routes } from '@angular/router';

export const RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    title: 'Solicitudes por aprobar · Reservaditos',
    loadComponent: () =>
      import('./pages/pending-requests/pending-requests.page').then((m) => m.PendingRequestsPage),
  },
];
