import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

const commonConfig = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/abstracts" as *;`,
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      ...commonConfig,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'VueDatepicker',
          fileName: (format) => `vue-datepicker.${format}.js`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' },
            assetFileNames: (assetInfo) =>
              assetInfo.names && assetInfo.names[0] === 'style.css'
                ? 'style.css'
                : assetInfo.names
                  ? assetInfo.names[0]
                  : 'asset',
          },
        },
      },
    };
  }

  return {
    ...commonConfig,
    plugins: [...commonConfig.plugins, vueDevTools()],
  };
});
