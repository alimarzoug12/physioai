import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',

  replaysSessionSampleRate: 0.1,   // record 10% of sessions
  replaysOnErrorSampleRate: 1.0,   // record 100% of sessions with errors
  integrations: [
    Sentry.replayIntegration(),    // session replay on errors
  ],
});

export default Sentry;