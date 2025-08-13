// /client/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // ✅ Import the Tailwind CSS plugin

export default defineConfig({
  // Add the plugins for React and Tailwind
  plugins: [
    react(),
    tailwindcss(), // ✅ Add the Tailwind plugin here
  ],
  
  // Keep the existing test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});