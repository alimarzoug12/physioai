import './sentry';
import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'flag-icons/css/flag-icons.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100vh', fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#e11d48' }}>Something went wrong</h2>
          <p style={{ color: '#6b7280' }}>Our team has been notified automatically.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16, padding: '10px 24px',
              background: '#2563eb', color: 'white',
              border: 'none', borderRadius: 8, cursor: 'pointer'
            }}
          >
            Reload page
          </button>
        </div>
      }
      onError={(error) => {
        console.error('Sentry caught:', error);
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);