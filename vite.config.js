import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` must match the GitHub Pages project path so built asset URLs resolve
// to https://navybluecheese.github.io/carry-trade-monitor/. Kept at '/' in dev.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/carry-trade-monitor/' : '/',
  server: {
    port: 5290,
    strictPort: true,
  },
}))
