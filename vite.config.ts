import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = path.resolve(rootDir, '..')
const bundledAssets = path.resolve(rootDir, 'assets')

/** Prefer parent workspace folders locally; fall back to bundled assets/ for standalone deploys (e.g. Netlify). */
function assetDir(...segments: string[]): string {
  const parentPath = path.resolve(workspaceRoot, ...segments)
  const bundledPath = path.resolve(bundledAssets, ...segments)
  if (fs.existsSync(parentPath)) return parentPath
  return bundledPath
}

export default defineConfig(() => ({
  // Netlify and most hosts use "/". GitHub Pages sets BASE_PATH=/Marketing-Asset-Hub/ in CI.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@brand': assetDir('Brand'),
      '@event': assetDir('Event'),
      '@stocks': assetDir('Stocks'),
      '@templates': assetDir('Marketing', 'png'),
    },
  },
  server: {
    fs: {
      allow: [workspaceRoot, bundledAssets],
    },
  },
}))
