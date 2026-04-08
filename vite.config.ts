import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  envDir: resolve(__dirname),        // load .env from project root, not src/
  plugins: [react()],
  publicDir: resolve(__dirname, 'src/static'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
})
