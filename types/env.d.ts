/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_BASIC_API_URL: string;
  readonly VITE_GLOB_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}