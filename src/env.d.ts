// Source - https://stackoverflow.com/a
// Posted by Dario Mincioni
// Retrieved 2025-11-10, License - CC BY-SA 4.0

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_AUTH_EMAIL: string;
  readonly VITE_AUTH_PASS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
