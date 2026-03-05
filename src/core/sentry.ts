import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  const tracesSampleRateRaw = Number(import.meta.env.VITE_SENTRY_TRACES_RATE ?? 0.1);
  const tracesSampleRate = Number.isFinite(tracesSampleRateRaw)
    ? Math.max(0, Math.min(1, tracesSampleRateRaw))
    : 0.1;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate,
    sendDefaultPii: false,
    beforeSend(event) {
      // Remove query strings from URLs to reduce accidental PII capture.
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url);
          url.search = '';
          event.request.url = url.toString();
        } catch {
          // Keep original if URL parsing fails.
        }
      }
      return event;
    },
  });
}
