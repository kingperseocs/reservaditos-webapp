import { AppEnvironment } from '../app/core/config/app-environment';

/**
 * `pnpm start:aws`: the web runs locally but talks to the backend deployed on
 * AWS (EC2 demo in São Paulo, active 11–13/11/2026).
 */
export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://15.229.3.0/v1',
  adminUserId: 'admin',
  buildingName: 'Edificio Demo',
  pollIntervalMs: 10_000,
};
