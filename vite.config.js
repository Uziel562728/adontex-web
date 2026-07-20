import { defineConfig } from 'vite';

export default defineConfig({
  // Vite dev and preview servers config for Single Page Application SPA routing fallback
  server: {
    port: 5173,
    strictPort: true,
    // Connect History API Fallback is active by default, ensuring index.html fallback
  },
  preview: {
    port: 4173,
    strictPort: true,
  }
});
