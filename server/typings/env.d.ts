declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            CORS_ORIGIN: string;
        }
    }
}

export {};
