import { Routes } from '@angular/router';

export const AREAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Áreas comunes · Reservaditos',
    loadComponent: () => import('./pages/areas-list/areas-list.page').then((m) => m.AreasListPage),
  },
];
