import { apiPaths } from '@/app/router/paths';
import type { ApiError } from '@/shared/api/apiError';
import { env } from '@/shared/config/env';

type RequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  body?: unknown;
};

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(accessTokenValue: string) {
  accessToken = accessTokenValue;
}

export function clearAccessToken() {
  accessToken = null;
}

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

function shouldAttemptTokenRefresh(path: string) {
  return !path.includes(apiPaths.auth.login) && !path.includes(apiPaths.auth.refresh);
}

function extractAccessTokenFromPayload(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const objectPayload = payload as Record<string, unknown>;
  const accessTokenValue = typeof objectPayload.token === 'string' ? objectPayload.token : null;

  return accessTokenValue && accessTokenValue.trim().length > 0 ? accessTokenValue : null;
}

async function toApiError(response: Response): Promise<ApiError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  const objectPayload = (typeof payload === 'object' && payload !== null ? payload : {}) as Record<string, unknown>;
  const code = typeof objectPayload.code === 'string' ? objectPayload.code : undefined;

  const message = typeof objectPayload.message === 'string' ? objectPayload.message : response.statusText || 'Request failed.';

  return {
    status: response.status,
    code,
    message,
  };
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await fetch(resolveUrl(apiPaths.auth.refresh), {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      accessToken = null;
      return null;
    }

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json') ? await response.json() : undefined;
    const refreshedAccessToken = extractAccessTokenFromPayload(payload);

    if (!refreshedAccessToken) {
      accessToken = null;
      return null;
    }

    accessToken = refreshedAccessToken;
    return refreshedAccessToken;
  })()
    .catch(() => {
      accessToken = null;
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request<T>(
  path: string,
  method: string,
  options: RequestOptions = {},
  allowRefreshRetry = true,
): Promise<T> {
  const { body, headers: rawHeaders, ...requestOptions } = options;
  const requestBody = body !== undefined ? JSON.stringify(body) : undefined;

  const headers = new Headers(rawHeaders ?? {});

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(resolveUrl(path), {
    ...requestOptions,
    method,
    headers,
    body: requestBody,
  });

  if (allowRefreshRetry && response.status === 401 && shouldAttemptTokenRefresh(path)) {
    const refreshedAccessToken = await refreshAccessToken();

    if (refreshedAccessToken) {
      const retryHeaders = new Headers(rawHeaders ?? {});

      if (body !== undefined && !retryHeaders.has('Content-Type')) {
        retryHeaders.set('Content-Type', 'application/json');
      }

      retryHeaders.set('Authorization', `Bearer ${refreshedAccessToken}`);

      response = await fetch(resolveUrl(path), {
        ...requestOptions,
        method,
        headers: retryHeaders,
        body: requestBody,
      });
    }
  }

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
  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'body'> = {}) {
    return request<T>(path, 'POST', body === undefined ? options : { ...options, body });
  },
};
