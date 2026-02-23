import { type MessageKey, isMessageKey, t } from '@/shared/i18n';

export interface ApiError {
  status: number;
  code?: string;
  message: string;
}

interface ErrorMessageOptions {
  exposeUnexpectedErrorMessage?: boolean;
}

const apiErrorCodeToMessageKey: Partial<Record<string, MessageKey>> = {
  'Auth.Validation.InvalidEmail': 'error.api.auth.validation.invalidEmail',
  'Auth.Validation.InvalidPassword': 'error.api.auth.validation.invalidPassword',
  'Auth.Validation.MissingRefreshToken': 'error.api.auth.validation.missingRefreshToken',
  'Auth.Unauthorized.InvalidCredentials': 'error.api.auth.unauthorized.invalidCredentials',
  'Auth.Unauthorized.InvalidRefreshToken': 'error.api.auth.unauthorized.invalidRefreshToken',
  'Auth.Unauthorized.ExpiredRefreshToken': 'error.api.auth.unauthorized.expiredRefreshToken',
  'Auth.Unauthorized.ReusedRefreshToken': 'error.api.auth.unauthorized.reusedRefreshToken',
  'Auth.Conflict.AlreadyLoggedInOnThisDevice': 'error.api.auth.conflict.alreadyLoggedInOnThisDevice',
  'Auth.NotFound.User': 'error.api.auth.notFound.user',
  'User.Validation.InvalidEmail': 'error.api.user.validation.invalidEmail',
  'User.Validation.InvalidPassword': 'error.api.user.validation.invalidPassword',
  'User.Conflict.EmailAlreadyInUse': 'error.api.user.conflict.emailAlreadyInUse',
  'User.NotFound.ByEmail': 'error.api.user.notFound.byEmail',
};

function resolveFallback(fallback: string) {
  return isMessageKey(fallback) ? t(fallback) : fallback;
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
  fallback: string = 'error.requestFailed',
  options: ErrorMessageOptions = {},
) {
  const resolvedFallback = resolveFallback(fallback);

  if (isApiError(error)) {
    if (error.code) {
      const mappedKey = apiErrorCodeToMessageKey[error.code];
      if (mappedKey) {
        return t(mappedKey);
      }

      if (isMessageKey(error.code)) {
        return t(error.code);
      }
    }

    if (isMessageKey(error.message)) {
      return t(error.message);
    }

    return options.exposeUnexpectedErrorMessage ? error.message : resolvedFallback;
  }

  if (options.exposeUnexpectedErrorMessage && error instanceof Error) {
    return error.message;
  }

  return resolvedFallback;
}

