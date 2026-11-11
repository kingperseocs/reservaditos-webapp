import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';

/** Every feature is lazy loaded inside the admin shell. */
export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reservas' },
      {
        path: 'reservas',
        loadChildren: () =>
          import('./features/reservations/reservations.routes').then((m) => m.RESERVATIONS_ROUTES),
      },
      {
        path: 'areas',
        loadChildren: () => import('./features/areas/areas.routes').then((m) => m.AREAS_ROUTES),
      },
      {
        path: 'residentes',
        loadChildren: () =>
          import('./features/residents/residents.routes').then((m) => m.RESIDENTS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'reservas' },
];
