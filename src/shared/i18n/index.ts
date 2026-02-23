import { enUSMessages } from '@/shared/i18n/messages/en-US';

type Locale = 'en-US';
type Messages = typeof enUSMessages;
export type MessageKey = keyof Messages;

const dictionaries: Record<Locale, Messages> = {
  'en-US': enUSMessages,
};

let currentLocale: Locale = 'en-US';

function getDictionary() {
  return dictionaries[currentLocale];
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, token: string) => {
    const value = params[token];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale() {
  return currentLocale;
}

export function isMessageKey(value: string): value is MessageKey {
  return Object.prototype.hasOwnProperty.call(enUSMessages, value);
}

export function t(key: MessageKey, params?: Record<string, string | number>) {
  const dictionary = getDictionary();
  const fallback = enUSMessages[key];
  const text = dictionary[key] ?? fallback ?? key;

  return interpolate(text, params);
}

export function tMaybeKey(value: string | undefined | null, fallback = '') {
  if (!value) {
    return fallback;
  }

  return isMessageKey(value) ? t(value) : value;
}

