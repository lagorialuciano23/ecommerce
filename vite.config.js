import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// 2. Cambiar la exportación a una función
export default ({ mode }) => {
  // 3. Cargar las variables de entorno
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BACKEND_URL || 'http://localhost:5000'; // Fallback por si falla

  // 4. Devolver la configuración
  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: target, // 5. Usar la variable 'target'
          changeOrigin: true,
          secure: false, // Necesario para proxies a localhost con HTTPS
        },
      },
    },
    plugins: [react()],
  });
};