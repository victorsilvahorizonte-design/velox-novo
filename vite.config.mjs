import { defineConfig } from 'vite';
// Servidor local de desenvolvimento. Impede requisições externas a dados reais.
const csp = [
  "default-src 'self' data: blob:",
  "connect-src 'self' ws: wss:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "frame-src 'none'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');
export default defineConfig({
  server: { host: '0.0.0.0', port: 5173, headers: {
    'Content-Security-Policy': csp,
    'Cache-Control': 'no-store'
  }},
  // Nunca confundir a prévia com a publicação da empresa.
  build: { outDir: 'dist-dev', emptyOutDir: true }
});
