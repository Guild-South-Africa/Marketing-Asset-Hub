import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = path.resolve(rootDir, '..')

export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH ?? (mode === 'production' ? '/Marketing-Asset-Hub/' : '/'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@brand': path.resolve(workspaceRoot, 'Brand'),
      '@event': path.resolve(workspaceRoot, 'Event'),
      '@stocks': path.resolve(workspaceRoot, 'Stocks'),
      '@templates': path.resolve(workspaceRoot, 'Marketing/png'),
    },
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
}))
