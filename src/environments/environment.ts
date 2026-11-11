import { AppEnvironment } from '../app/core/config/app-environment';

/** Production build. */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: 'http://localhost:8000/v1',
  adminUserId: 'admin',
  buildingName: 'Edificio Demo',
  pollIntervalMs: 10_000,
};
