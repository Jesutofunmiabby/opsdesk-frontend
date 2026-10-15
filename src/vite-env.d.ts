/// <reference types="vite/client" />

// The VITE_ variables the app reads from .env, so import.meta.env knows
// their names and types. Optional, because the .env file may be missing.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_ENABLE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
