// Polyfill for AbortSignal.any — not supported in Safari < 17.4 (all iOS browsers)
if (typeof AbortSignal.any === 'undefined') {
  (AbortSignal as any).any = (signals: AbortSignal[]) => {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        return controller.signal;
      }
      signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
    }
    return controller.signal;
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
