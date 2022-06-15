import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1000,
    lib: {
      formats: ['es', 'cjs', 'iife'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Vue3DModel',
      fileName: (format) => {
        const fileNamePrefix = 'vue-3d-model';
        if (format === 'es') {
          return `${fileNamePrefix}.esm.js`;
        }
        if (format === 'iife') {
          return `${fileNamePrefix}.global.js`;
        }
        return `${fileNamePrefix}.${format}.js`;
      }
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
