import { fileURLToPath, URL } from 'node:url';
import svgLoader from 'vite-svg-loader';

import { defineConfig, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const config: UserConfig = {
    base: '/',
    plugins: [vue(), svgLoader(), vueJsx(), VueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    preview: {
      port: 8080,
      strictPort: true,
      host: true,
      allowedHosts: true, // Allow all hosts for ngrok
    },
    server: {
      port: 8080,
      strictPort: true,
      host: true,
      allowedHosts: true, // Allow all hosts for ngrok (dev mode)
      proxy:
        env.VITE_PROXY_ENABLED !== 'true'
          ? undefined
          : {
              '/api': {
                target: env.VITE_PROXY_JSON_RPC_SERVER_URL,
                changeOrigin: true,
                secure: false, // Internal Docker communication uses HTTP
              },
              '/socket.io': {
                target: env.VITE_PROXY_WS_SERVER_URL,
                ws: true,
                changeOrigin: true,
                secure: false, // Internal Docker communication uses HTTP
                rewriteWsOrigin: true,
              },
            },
    },
  };

  return config;
});
