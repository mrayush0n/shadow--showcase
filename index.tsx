import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// --- API KEY CONFIGURATION ---
// The user provided keys for multitasking/load-balancing.
const API_KEYS = [
  "AIzaSyC7omMcW61riL_qlnNaBdr8-wEaDd1K-II",
  "AIzaSyClH8pQxPyJffVJgh6kK0IMPN5dFBmMbSU"
];

// Helper to initialize the environment for the browser
// Ensure window.process and window.process.env exist before accessing them
// This polyfill is crucial for libraries like @google/genai that may check process.env
try {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (typeof window.process === 'undefined') {
      // @ts-ignore
      window.process = { env: {} };
    }
    // @ts-ignore
    if (typeof window.process.env === 'undefined') {
      // @ts-ignore
      window.process.env = {};
    }
  }
} catch (e) {
  console.warn("Error initializing process polyfill", e);
}

// Implement Round-Robin Key Rotation
// Every time code accesses process.env.API_KEY, it gets the next key in the list.
let keyIndex = 0;

try {
  // @ts-ignore
  if (window.process && window.process.env) {
    Object.defineProperty((window as any).process.env, 'API_KEY', {
      get: () => {
        const key = API_KEYS[keyIndex];
        // Rotate to the next key for the next request
        keyIndex = (keyIndex + 1) % API_KEYS.length;
        return key;
      },
      configurable: true
    });
    console.log("Shadow Showcase: Multi-Key Load Balancing Enabled.");
  }
} catch (e) {
  console.warn("Failed to define API_KEY property on process.env", e);
}
// -----------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
