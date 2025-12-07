import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.palenque.app',
  appName: 'palenqueFrontendIonic',
  webDir: 'www',
  
  // 👇 ESTO ES LO QUE TE FALTA AGREGAR:
  server: {
    androidScheme: 'http',    // Obliga a la App a usar HTTP (no seguro) para coincidir con tu API
    cleartext: true,          // Permite tráfico de texto plano (sin cifrar)
    allowNavigation: ['*']    // Permite navegar a cualquier IP (tu computadora)
  }
};

export default config;