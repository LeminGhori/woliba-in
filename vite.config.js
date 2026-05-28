import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // PDF lists dev.woliba.io but that host is static S3. Real API: dev.api.woliba.io
  const apiTarget = env.VITE_API_PROXY_TARGET || 'https://dev.api.woliba.io';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/v1': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
