import preact from '@preact/preset-vite'
import webExtension from '@samrum/vite-plugin-web-extension'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

import { getManifest } from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      preact(),
      webExtension({
        manifest: getManifest(Number(env.MANIFEST_VERSION) || 3),
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  }
})
