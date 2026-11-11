import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeEsPe from '@angular/common/locales/es-PE';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { DayFirstDateAdapter } from './core/dates/day-first-date-adapter';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { userIdInterceptor } from './core/http/user-id.interceptor';
import { ReservationsStore } from './features/reservations/data-access/reservations.store';

registerLocaleData(localeEsPe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([userIdInterceptor, apiErrorInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    provideNativeDateAdapter(),
    // Typed dates are day/month in Peru (the native adapter reads month/day).
    { provide: DateAdapter, useClass: DayFirstDateAdapter },
    // New requests from the app keep the sidebar counter up to date on every page.
    provideAppInitializer(() => inject(ReservationsStore).startPolling()),
  ],
};
