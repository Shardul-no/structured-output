/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Google AI API key for accessing Google's Generative AI services
   * @example "your-google-ai-api-key-here"
   */
  readonly VITE_GOOGLE_AI_API_KEY: string;
  
  // Add other environment variables here as needed
  // Example:
  // readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}