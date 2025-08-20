import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'auto.beauty.app',
  appName: 'AutoBeauty',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
