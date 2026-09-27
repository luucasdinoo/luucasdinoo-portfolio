import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // Only reached via lazy import() (the About globe); pre-bundle them at startup so the dev
    // server doesn't discover them mid-session and force a reload / fail the dynamic import.
    include: ['d3-geo', 'topojson-client'],
  },
})
