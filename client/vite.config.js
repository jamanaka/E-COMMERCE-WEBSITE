import path from 'path'; // Import path using ES Module syntax
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(new URL('.', import.meta.url).pathname, './src'), // Use ES Module-friendly __dirname alternative
    },
  },
});
