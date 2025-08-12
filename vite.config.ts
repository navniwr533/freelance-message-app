import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // If building for GitHub Pages, serve under repo subpath
  const isGhPages = process.env.GHPAGES === 'true'
  return {
    plugins: [react()],
    base: isGhPages ? '/freelance-message-app/' : '/',
  }
})
