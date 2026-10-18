
// A development-only tool for finding bugs
// Double render components to find side effects in render phase 
// Finds deprecated lifecycles, legacy API usage, and other potential problems
// Detects unexpected side effects by intentionally double-invoking certain functions
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

// Check which pages the user can access and what they can do with it, based on their authentication status and roles
import { RouterProvider } from 'react-router-dom';

// Check who can access the app and what they can do with it, based on their authentication status and roles
import { AuthProvider } from '@/features/auth/auth-context/AuthProvider';

// The router object defines the routes and their corresponding components for the application
import { router } from '@/routes/router';
import '@/styles/index.css';


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

