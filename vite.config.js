import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rubik-s-cube-simulator-main/',  // Important for GitHub Pages
})
