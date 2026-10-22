
// A development-only tool for finding bugs
// Double render components to find side effects in render phase 
// Finds deprecated lifecycles, legacy API usage, and other potential problems
// Detects unexpected side effects by intentionally double-invoking certain functions
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

// Check which pages the user can access and what they can do with it, based on their authentication status and roles
import { RouterProvider } from 'react-router-dom';

// Check who can access the app and what they can do with it, based on their authentication status and roles
import { AuthProvider } from '@/5_features/auth/context/AuthProvider';

// The router object defines the routes and their corresponding components for the application
import { router } from '@/6_routes/router';
import '@/4_styles/index.css';


// Finds an empty HTML div element with the id of 'root',
// TypeScript's non-null assertion operator (!) is used to tell the compiler that the value will not be null or undefined,
// convert it to a react root, 
// and render put a react component tree inside it.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

// Helper to read css var
const getCssVar = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const syncBrowswerThemeColor = (): void => {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;

  // DARK = navy, LIGHT = white -change to mist if you want.
  const cssVarName = isDark ? '--color-navy' : '--color-white';
  const fallback = isDark ? '#0a0a23' : '#ffffff';

  const color = getCssVar(cssVarName) || fallback;

  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = color;

};

//---------Render here when it fails--------------

// Sync after render
syncBrowswerThemeColor();

// Auto-sync when system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncBrowswerThemeColor);

// Auto-sync when you toggle `class="dark"` with tailwind
new MutationObserver(syncBrowswerThemeColor).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});


// import { createRoot } from 'react-dom/client';
// import App from './App';

// // 1. Find the HTML element where the app should live
// const container = document.getElementById('root');

// // 2. Create a React root for that element
// const root = createRoot(container);

// // 3. Render your main component into the DOM
// root.render(
//   <StrictMode>
//      <App />
//   </StrictMode>
// );

// The App.tsx will have the following contents
// function App() {
//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   );
// }

// export default App;

