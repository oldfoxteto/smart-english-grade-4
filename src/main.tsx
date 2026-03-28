import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ProgressProvider } from './core/ProgressContext';
import { MissionProvider } from './core/MissionContext';
import { NotificationProvider } from './core/NotificationContext';
import { initSentry } from './core/sentry';

initSentry();

function normalizeLocalDevHost() {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.hostname !== '127.0.0.1') {
    return;
  }

  const targetUrl = new URL(window.location.href);
  targetUrl.hostname = 'localhost';
  window.location.replace(targetUrl.toString());
}

async function clearLocalDevServiceWorkers() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const isLoopbackHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!import.meta.env.DEV || !isLoopbackHost) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    const cacheKeys = await window.caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => window.caches.delete(cacheKey)));
  }
}

normalizeLocalDevHost();
void clearLocalDevServiceWorkers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <MissionProvider>
        <ProgressProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProgressProvider>
      </MissionProvider>
    </NotificationProvider>
  </StrictMode>,
);
