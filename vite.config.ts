import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

// The mock API's service worker, which public/ copies into every build.
const MOCK_WORKER_FILE = 'mockServiceWorker.js'

// A real build has no mock API, so it does not need the mock API's service
// worker either. This removes the copy from the build output once it is
// written.
function leaveOutMockWorker(): Plugin {
  return {
    name: 'leave-out-mock-worker',
    apply: 'build',
    async writeBundle(options) {
      if (options.dir) {
        await this.fs.unlink(`${options.dir}/${MOCK_WORKER_FILE}`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_ENABLE_MOCKS=true builds the mock API in, for demos and preview
  // (see .env.example). Without it, a build has none of the mock code. '.' is
  // the project folder, where the .env files are.
  const mocksEnabled = loadEnv(mode, '.').VITE_ENABLE_MOCKS === 'true'

  return {
    plugins: [react(), ...(mocksEnabled ? [] : [leaveOutMockWorker()])],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
    },
  }
})
