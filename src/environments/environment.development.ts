import { AppEnvironment } from '../app/core/config/app-environment';

/** `pnpm start`: the backend runs locally on port 8000. */
export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/v1',
  adminUserId: 'admin',
  buildingName: 'Edificio Demo',
  pollIntervalMs: 10_000,
};
