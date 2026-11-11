import { HttpErrorResponse } from '@angular/common/http';

/** Error shape returned by the backend: { statusCode, code, message, details? }. */
export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as Partial<ApiError> | null;
    if (body && typeof body.code === 'string' && typeof body.message === 'string') {
      return {
        statusCode: error.status,
        code: body.code,
        message: body.message,
        details: body.details,
      };
    }
    if (error.status === 0) {
      return {
        statusCode: 0,
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.',
      };
    }
    return {
      statusCode: error.status,
      code: 'HTTP_ERROR',
      message: 'Ocurrió un error inesperado.',
    };
  }
  return { statusCode: 0, code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado.' };
}
