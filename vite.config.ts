//This file is the Vite configuration file . 
// It tells Vite how to run your React frontend during development, 
// where to find your source files, and 
// how to forward API requests to your backend.


// Converts a file URL into a normal filesystem path.
import { fileURLToPath } from 'node:url';

// Enables Vite to process react code, including JSX.
import react from '@vitejs/plugin-react';


// Helps define the vite configuration with better editor support such as
// auto-complete, red underlines, go to definition, hover docs and type checking. 
// It also allows you to use TypeScript in this file.

// Loads environment variables from .env files into process.env.
import { defineConfig, loadEnv } from 'vite';

// ({ mode }): Extracts the mode property from an object passed to the function.
// the current mode of the Vite build process, such as 'development' or 'production'.

export default defineConfig(({ mode }) => {

  // Empty prefix loads every variable, so DEV_PROXY_TARGET stays server-side
  // and is never exposed to the browser bundle.

  // Normally, Vite exposes only variables beginning with VITE_ to frontend code 
  // through import.meta.env.

  // here, the empty prefix allows the configuration file to read a variable such as DEV_PROXY_TARGET, 
  // which does not begin with VITE_.
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.DEV_PROXY_TARGET;

  return {
    // This enables the official Vite React plugin.
    // It helps Vite handle React features, 
    // including JSX and React Fast Refresh during development.
    // It is an array, so you can add more plugins if needed later.
    plugins: [react()],
    // This creates a shortcut for importing files from your src directory.
    resolve: {
    // import.meta.url identifies the URL of the current configuration file.
    // new URL('./src', import.meta.url) constructs a URL pointing 
    // to the src directory relative to that file.
    // fileURLToPath converts that URL into a normal filesystem path.
    // The alias '@' can then be used in your code to refer to the src directory,
    // making imports cleaner and easier to read. 
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // The port on which the Vite development server will run.
      // You can change this to any port you prefer, as long as it is not already in use.
      // The default port is 5173, but you can change it to any other port if needed.
      port: 5173,
      // Proxying in dev keeps the API same-origin, 
      // so cookies work without CORS setup.

      // This works for the backend mounted under /api.
      // If your backend is NOT mounted under /api, add:
      // rewrite: (path) => path.replace(/^\/api/, ''),

      // If proxyTarget is defined, set up a proxy for /api requests to the backend server.
      // If proxyTarget is not defined, no proxy is set up, and /api requests will go to the frontend server.
      // The changeOrigin option modifies the origin of the host header to match the target URL,
      // which can be necessary for some backend servers to accept the request.
      proxy: proxyTarget
        ? { '/api': { target: proxyTarget, changeOrigin: true } }
        : undefined,
    },
  };
});
