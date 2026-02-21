const API_BASE_URL_ENV = 'VITE_API_BASE_URL';

function requireEnvValue(name: string): string {
  const value = import.meta.env[name];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `[config] Missing required env var ${name}. Provide it in the active Vite env file for mode "${import.meta.env.MODE}".`,
    );
  }

  return value.trim();
}

function normalizeApiBaseUrl(rawValue: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawValue);
  } catch {
    throw new Error(`[config] ${API_BASE_URL_ENV} must be a valid absolute URL. Received: "${rawValue}".`);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`[config] ${API_BASE_URL_ENV} must use http or https protocol. Received: "${parsedUrl.protocol}".`);
  }

  return rawValue.replace(/\/+$/, '');
}

const apiBaseUrl = normalizeApiBaseUrl(requireEnvValue(API_BASE_URL_ENV));

export const env = Object.freeze({
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  apiBaseUrl,
});
