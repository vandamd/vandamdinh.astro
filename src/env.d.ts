declare namespace App {
    interface Locals {
        runtime: {
            env: {
                LASTFM_API_KEY: string;
                LASTFM_USERNAME: string;
            };
        };
    }
}

interface ImportMetaEnv {
    readonly PUBLIC_LASTFM_USERNAME?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}