declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test' | 'provision';
            PORT: string;
            DATABASE_URL: string;
            CORS_ORIGIN: string;
        }
    }
}

export {};
