import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ProgressProvider } from './core/ProgressContext';
import { MissionProvider } from './core/MissionContext';
import { NotificationProvider } from './core/NotificationContext';

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
