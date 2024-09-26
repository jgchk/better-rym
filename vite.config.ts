import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json')
  const pkg = readJsonFile('package.json')
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

export default defineConfig({
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  plugins: [
    preact(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
      webExtConfig: {
        startUrl:
          'https://rateyourmusic.com/release/album/electric-wizard/dopethrone/',
      },
    }),
  ],
})
