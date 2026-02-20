import type { ApiError } from '@/shared/api/apiError';
import { env } from '@/shared/config/env';

type RequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  body?: unknown;
};

function isAbsoluteUrl(path: string) {
  return /^https?:\/\//i.test(path);
}

function resolveUrl(path: string) {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const baseUrl = env.apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  const objectPayload = (typeof payload === 'object' && payload !== null ? payload : {}) as Record<string, unknown>;
  const code = typeof objectPayload.code === 'string'
    ? objectPayload.code
    : typeof objectPayload.Code === 'string'
      ? objectPayload.Code
      : undefined;

  const message = typeof objectPayload.message === 'string'
    ? objectPayload.message
    : typeof objectPayload.Message === 'string'
      ? objectPayload.Message
      : response.statusText || 'Request failed.';

  return {
    status: response.status,
    code,
    message,
  };
}

async function request<T>(path: string, method: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(resolveUrl(path), {
    ...options,
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export const httpClient = {
  get<T>(path: string, options: Omit<RequestOptions, 'body'> = {}) {
    return request<T>(path, 'GET', options);
  },
  post<T>(path: string, body: unknown, options: Omit<RequestOptions, 'body'> = {}) {
    return request<T>(path, 'POST', { ...options, body });
  },
};
