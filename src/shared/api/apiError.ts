export interface ApiError {
  status: number;
  code?: string;
  message: string;
}

interface ErrorMessageOptions {
  exposeUnexpectedErrorMessage?: boolean;
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Partial<ApiError>;

  return typeof candidate.status === 'number' && typeof candidate.message === 'string';
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Request failed.',
  options: ErrorMessageOptions = {},
) {
  if (isApiError(error)) {
    return error.message;
  }

  if (options.exposeUnexpectedErrorMessage && error instanceof Error) {
    return error.message;
  }

  return fallback;
}
