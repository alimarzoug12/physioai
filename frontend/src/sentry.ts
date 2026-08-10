import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://f8ea4c95817a4300a5bd396bc0ef9548@o4511885835370496.ingest.de.sentry.io/4511885932953680',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
});

export default Sentry;