const defaultApiBaseUrl = 'http://localhost:5000';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const env = {
  apiBaseUrl: rawApiBaseUrl && rawApiBaseUrl.length > 0 ? rawApiBaseUrl : defaultApiBaseUrl,
};
