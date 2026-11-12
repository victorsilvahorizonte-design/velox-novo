// VELOX - WEB PREVIEW ONLY. CSP blocks all external data connections.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
const csp=["default-src 'self' data: blob:","connect-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src 'self' data: https://fonts.gstatic.com", "img-src 'self' data: blob:", "frame-src 'none'", "form-action 'self'", "object-src 'none'", "base-uri 'self'"].join('; ');
http.createServer((req,res)=>{
  res.setHeader('Content-Security-Policy',csp);
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','no-store');
  let pathname;
  try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch {res.writeHead(400).end('Endereço inválido');return}
  if(pathname==='/timeclock-vendor-pdf.js'){const library=path.join(root,'node_modules/pdf-lib/dist/pdf-lib.min.js');res.setHeader('Content-Type','text/javascript; charset=utf-8');const stream=fs.createReadStream(library);stream.on('error',()=>{if(!res.headersSent)res.writeHead(503);res.end('Biblioteca PDF indisponível. Execute npm install.');});stream.pipe(res);return;}
  const relative=path.normalize(pathname).replace(/^[/\\]+/,'');
  const full=path.resolve(root,relative||'index.html');
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()) {res.writeHead(404).end('Não encontrado');return}
  res.setHeader('Content-Type',mime[path.extname(full)]||'application/octet-stream');
  res.writeHead(200);fs.createReadStream(full).pipe(res);
}).listen(Number(process.env.PORT)||5173,'0.0.0.0',()=>console.log('VeloX - prévia segura / porta 5173'));
