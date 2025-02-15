const availableEnvironments = Object.keys(import.meta.env)
  .filter((x) => x.startsWith("VITE_"))
  .filter((x) => x.endsWith("_ENV_NAME"))
  .map((x) => x.split("_")[1]);

export const getEnv = () => {
    const envName = availableEnvironments[0];
    console.log(envName)
    console.log(import.meta.env)
    if (!envName) {
        console.error(`Environment variable ${envName} is not defined`);
        return;
    }
    
    return {
        apiKey: import.meta.env[`VITE_${envName}_API_KEY`],
        authDomain: import.meta.env[`VITE_${envName}_AUTH_DOMAIN`],
        projectId: import.meta.env[`VITE_${envName}_PROJECT_ID`],
        storageBucket: import.meta.env[`VITE_${envName}_STORAGE_BUCKET`],
        messagingSenderId: import.meta.env[`VITE_${envName}_MESSAGING_SENDER_ID`],
        appId: import.meta.env[`VITE_${envName}_APP_ID`],
        collection: import.meta.env[`VITE_${envName}_COLLECTION`],
    };
};