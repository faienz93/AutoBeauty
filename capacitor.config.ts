import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'car.maintenance.app',
  appName: 'car-maintenance-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
