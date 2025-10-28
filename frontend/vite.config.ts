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
      strictPort: false,
      host: '0.0.0.0',
      allowedHosts: 'all',
      cors: {
        origin: true,
        credentials: true
      },
    },
    server: {
      port: 8080,
      strictPort: false,
      host: '0.0.0.0',
      allowedHosts: 'all',
      disableHostCheck: true,
      origin: false,
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['*'],
        exposedHeaders: ['*']
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      proxy:
        env.VITE_PROXY_ENABLED !== 'true'
          ? undefined
          : {
              '/api': {
                target: env.VITE_PROXY_JSON_RPC_SERVER_URL,
                changeOrigin: true,
                secure: false,
                ws: false,
                configure: (proxy, _options) => {
                  proxy.on('error', (err, _req, _res) => {
                    console.log('proxy error', err);
                  });
                  proxy.on('proxyReq', (proxyReq, req, _res) => {
                    console.log('Sending Request to the Target:', req.method, req.url);
                  });
                  proxy.on('proxyRes', (proxyRes, req, _res) => {
                    console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                  });
                },
              },
              '/socket.io': {
                target: env.VITE_PROXY_WS_SERVER_URL,
                ws: true,
                changeOrigin: true,
                secure: false,
                rewriteWsOrigin: true,
              },
            },
    },
  };

  return config;
});
