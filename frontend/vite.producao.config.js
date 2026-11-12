import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  root: resolve('production-src'),
  envDir: resolve('.'),
  base: '/',
  publicDir: resolve('production-src/public'),
  build: {
    outDir:resolve('dist-uso-real'),emptyOutDir:true,
    rollupOptions:{input:{main:resolve('production-src/index.html'),app:resolve('production-src/app.html')}}
  },
  preview:{host:'0.0.0.0'}
});
