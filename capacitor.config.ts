// Capacitor configuration for AnestesiaScales
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anestesiapp.jose',
  appName: 'AnestesiApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
