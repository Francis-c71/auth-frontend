// Detects unexpected side effects by intentionally double-invoking certain functions
// A development-only tool for finding bugs
// Double render components to find side effects in render phase 
// Finds deprecated lifecycles, legacy API usage, and other potential problems

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

// Check which pages the user can access and what they can do with it, based on their authentication status and roles
import { RouterProvider } from 'react-router-dom';

// Check who can access the app and what they can do with it, based on their authentication status and roles
import { AuthProvider } from '@/5_features/auth/context/AuthProvider';

// The router object defines the routes and their corresponding components for the application
import { router } from '@/6_routes/router';
import '@/4_styles/index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeColor } from './3_components/ui/MobileBrowserTheme';


// Finds an empty HTML div element with the id of 'root',
// TypeScript's non-null assertion operator (!) is used to tell the compiler that the value will not be null or undefined,
// convert it to a react root, 
// and render put a react component tree inside it.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
    {/* <ThemeColor theme="dark" /> */}
    <ThemeColor />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);




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


