export const getEnv = (id: string) => {
    console.log(import.meta.env.VITE_TEST_ENV_NAME);
    const envName = `VITE_${id}_ENV_NAME`;
    if (!import.meta.env[envName]) {
        console.error(`Environment variable ${envName} is not defined`);
        return;
    }
    
    return {
        apiKey: import.meta.env[`VITE_${id}_API_KEY`],
        authDomain: import.meta.env[`VITE_${id}_AUTH_DOMAIN`],
        projectId: import.meta.env[`VITE_${id}_PROJECT_ID`],
        storageBucket: import.meta.env[`VITE_${id}_STORAGE_BUCKET`],
        messagingSenderId: import.meta.env[`VITE_${id}_MESSAGING_SENDER_ID`],
        appId: import.meta.env[`VITE_${id}_APP_ID`],
        collection: import.meta.env[`VITE_${id}_COLLECTION`],
    };
};