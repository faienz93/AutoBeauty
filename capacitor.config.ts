import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'car.maintenance.app',
  appName: 'MyCar Diary',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
