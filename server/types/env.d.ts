    // env.d.ts
    declare global {
      namespace NodeJS {
        interface ProcessEnv {
          NODE_ENV: 'development' | 'production' | 'test';
          KINDE_DOMAIN_URL: string;
          KINDE_CLIENT_ID: string;
          KINDE_CLIENT_SECRET: string;
          // Add other environment variables here with their respective types
        }
      }
    }

    // This ensures the file is treated as a module and not a global script.
    export {};