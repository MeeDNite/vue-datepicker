import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

function cssInjectedByJsPlugin() {
  let cssCode = '';

  return {
    name: 'vite-plugin-css-injected-by-js',
    apply: 'build',
    enforce: 'post',

    generateBundle(options, bundle) {
      const cssFiles = [];

      for (const key in bundle) {
        const chunk = bundle[key];
        if (chunk.type === 'asset' && key.endsWith('.css')) {
          cssFiles.push(key);
          cssCode += chunk.source.toString();
        }
      }

      cssFiles.forEach((file) => delete bundle[file]);

      if (!cssCode) {
        console.warn('[css-inject] No CSS found to inject');
        return;
      }

      const escapedCss = cssCode
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')
        .replace(/\r?\n/g, '');

      for (const key in bundle) {
        const chunk = bundle[key];
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const injectCode = `
(function(){
  try {
    if (typeof document !== 'undefined') {
      var existing = document.getElementById('vue-datepicker-style');
      if (!existing) {
        var style = document.createElement('style');
        style.id = 'vue-datepicker-style';
        style.textContent = \`${escapedCss}\`;
        document.head.appendChild(style);
      }
    }
  } catch(e) {
    console.error('[vue-datepicker] Failed to inject styles:', e);
  }
})();
`;
          chunk.code = injectCode + chunk.code;
          console.log('[css-inject] CSS injected into:', key);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/abstracts/variables" as *;
          @use "@/assets/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueDatepicker',
      fileName: (format) => `vue-datepicker.${format}.js`,
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
        compact: true,
        manualChunks: undefined,
      },
    },
  },
});
