import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';

/** Sends the simulated admin identity expected by the backend on every API call. */
export const userIdInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(APP_CONFIG);
  if (!request.url.startsWith(config.apiBaseUrl)) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { 'x-user-id': config.adminUserId } }));
};
