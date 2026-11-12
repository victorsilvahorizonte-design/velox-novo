/**
 * Gera as páginas de produção a partir das páginas aprovadas de desenvolvimento.
 * Não altera index.html/app.html originais e não publica nem executa migrations.
 */
 import {
  readFileSync, writeFileSync, mkdirSync, copyFileSync, cpSync, rmSync
} from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
let login = readFileSync(path.join(root, 'index.html'), 'utf8');
let app = readFileSync(path.join(root, 'app.html'), 'utf8');

function one(source, needle, replacement, description) {
  const count = source.split(needle).length - 1;
  if (count !== 1) {
    throw new Error(`Esperado 1 ocorrência de ${description}; encontrei ${count}. Nenhum arquivo de origem será alterado.`);
  }
  return source.replace(needle, replacement);
}

// O login demonstrativo navega para o app sem autenticar. Na produção, o módulo
// production-auth.mjs assume o submit em capture e autentica pelo Supabase Auth.
login = one(
  login,
  '<form id="v10form" action="./app.html" method="get" target="_top"><input type="hidden" name="view" value="app">',
  '<form id="v10form" action="#" method="post">',
  'formulário de demonstração'
);
login = one(
  login,
  '<input id="v10email" type="email" autocomplete="off" aria-describedby="v10feedback">',
  '<input id="v10email" type="email" autocomplete="username" required aria-describedby="v10feedback">',
  'campo de e-mail'
);
login = one(
  login,
  '<input id="v10password" type="password" autocomplete="off" aria-describedby="v10feedback">',
  '<input id="v10password" type="password" autocomplete="current-password" required aria-describedby="v10feedback">',
  'campo de senha'
);

const demoStart = '// Prévia local sem autenticação: navega somente para o app.html na mesma origem.\n// Não coleta nem envia credenciais.\nlet isLoading=false;';
const demoEnd = 'window.addEventListener(\'pageshow\',resetLogin);';
const demoStartAt = login.indexOf(demoStart);
const demoEndAt = login.indexOf(demoEnd, demoStartAt);
if (demoStartAt < 0 || demoEndAt < 0) {
  throw new Error('Handler de login demonstrativo não identificado. Nenhum arquivo de origem será alterado.');
}
login = login.slice(0, demoStartAt)
  + '// A autenticação de produção é controlada exclusivamente por frontend/production-auth.mjs.\n'
  + login.slice(demoEndAt + demoEnd.length);
const demoCapture = `<script>\ndocument.addEventListener('submit',function(e){if(e.target&&e.target.id==='v10form'){e.preventDefault();e.stopImmediatePropagation();location.href='./app.html';}},true);\n</script>`;
login = one(login, demoCapture, '', 'redirecionamento demonstrativo');
login = one(
  login,
  '</body>',
  '<script type="module" src="./frontend/production-auth.mjs"></script>\n</body>',
  'entrada do módulo de autenticação'
);

// Troca o adaptador local pelo cliente autenticado. documents-rules.js permanece
// carregado antes deste ponto e continua servindo a apresentação das categorias.
const demoScript = '<script src="./demo-bridge.js"></script>';
const safeLoader = `<script>
window.VX_PROD_READY = new Promise((resolve,reject)=>{
  window.__VX_PROD_READY=resolve;window.__VX_PROD_FAIL=reject;
  setTimeout(()=>reject(new Error('Conexão segura não inicializada.')),12000);
});
window.VeloXApi=Object.freeze({call:async (action,payload)=>{
  const remote=await window.VX_PROD_READY;return remote(action,payload);
}});
</script>
<script type="module" src="./frontend/production-api.mjs"></script>`;
app = one(app, demoScript, safeLoader, 'adaptador de demonstração');
app = one(
  app,
  '<div class="user-chip">',
  '<button type="button" id="vx-logout" data-tooltip="Encerrar sessão" aria-label="Encerrar sessão" style="background:transparent;border:0;color:inherit;cursor:pointer;font-size:12px;padding:6px 8px">Sair</button><div class="user-chip">',
  'botão de encerramento de sessão'
);
// O limite visível precisa corresponder ao limite técnico atual da API de produção.
app = app.replace(/Até 20 MB por arquivo/g, 'Até 5 MB por arquivo');
if (app.includes('src="./demo-bridge.js"') || login.includes("location.href='./app.html'")) {
  throw new Error('Referência demonstrativa detectada nas páginas de produção.');
}

writeFileSync(path.join(root, 'index.uso-real.html'), login);
writeFileSync(path.join(root, 'app.uso-real.html'), app);

// Área isolada para build: preserva as páginas de desenvolvimento e copia TODOS
// os recursos públicos (logos, ícones, favicon e demais assets) para a publicação.
const stage = path.join(root, 'production-src');
rmSync(stage, { recursive: true, force: true });
mkdirSync(path.join(stage, 'frontend'), { recursive: true });
mkdirSync(path.join(stage, 'public'), { recursive: true });
writeFileSync(path.join(stage, 'index.html'), login);
writeFileSync(path.join(stage, 'app.html'), app);
for (const src of ['i18n.js', 'i18n-extra.js']) {
  copyFileSync(path.join(root, src), path.join(stage, src));
}
for (const src of ['production-auth.mjs', 'production-api.mjs']) {
  copyFileSync(path.join(root, 'frontend', src), path.join(stage, 'frontend', src));
}
// Cópia recursiva explícita para compatibilidade com WebContainers.
const {readdirSync,statSync}=await import('node:fs');
function copyPublicTree(source,destination){mkdirSync(destination,{recursive:true});for(const name of readdirSync(source)){const a=path.join(source,name),b=path.join(destination,name);if(statSync(a).isDirectory())copyPublicTree(a,b);else copyFileSync(a,b);}}
copyPublicTree(path.join(root,'public'),path.join(stage,'public'));
for (const src of ['management-core.js', 'core.js', 'sites-rules.js', 'documents-rules.js','timeclock-core.js','timeclock-ui.js','timeclock-pdf.js','timeclock.css','enterprise-workspace.js']) {
  copyFileSync(path.join(root, src), path.join(stage, 'public', src));
}
copyFileSync(path.join(root,'node_modules/pdf-lib/dist/pdf-lib.min.js'),path.join(stage,'public/timeclock-vendor-pdf.js'));
writeFileSync(
  path.join(stage, 'public', '_headers'),
  '/\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n/index.html\n  Cache-Control: no-store, max-age=0\n/app.html\n  Cache-Control: no-store, max-age=0\n'
);
console.log('Páginas de produção geradas em production-src/; páginas de desenvolvimento e assets originais preservados.');
