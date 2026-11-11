export interface AppEnvironment {
  production: boolean;
  /** Backend base URL including the API version, e.g. http://localhost:8000/v1 */
  apiBaseUrl: string;
  /** Simulated identity sent as x-user-id (the backend has no login). */
  adminUserId: string;
  /** Shown in the sidebar and page subtitles. */
  buildingName: string;
  /** How often the pending requests list refreshes itself. */
  pollIntervalMs: number;
}
