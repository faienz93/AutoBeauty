export const getEnv = () => {
    const envName = import.meta.env['VITE_ENV_NAME'];
    if (!envName) {
        console.error(`Environment variable ${envName} is not defined`);
        return;
    }

    return {
        car_table: import.meta.env[`VITE_${envName}_CAR_TABLE`],
        km_table: import.meta.env[`VITE_${envName}_KM_TABLE`]
    };
};