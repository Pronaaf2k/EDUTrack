import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // PASTE THIS 'test' SECTION
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // A file that runs before your tests
    css: true,
  },
})