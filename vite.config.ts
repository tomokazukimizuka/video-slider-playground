import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      directoryAsNamespace: false,
      dts: '.d.ts/components.d.ts'
    }),
    AutoImport({
      imports: ['vue'],
      dirs: ['src/composables'],
      vueTemplate: true,
      dts: '.d.ts/auto-imports.d.ts',
      resolvers: []
    }),
    viteSingleFile({
      useRecommendedBuildConfig: true,
      removeViteModuleLoader: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    outDir: 'docs',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});
