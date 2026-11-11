import { Routes } from '@angular/router';

export const RESIDENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Residentes · Reservaditos',
    loadComponent: () =>
      import('./pages/residents-coming-soon/residents-coming-soon.page').then(
        (m) => m.ResidentsComingSoonPage,
      ),
  },
];
