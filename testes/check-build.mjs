import {readFileSync,statSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../dist-uso-real/',import.meta.url);
for(const path of ['index.html','app.html','_headers','privacidade.html','exclusao-de-dados.html']){
 const file=new URL(path,root);assert.ok(existsSync(file),`Faltando ${path}`);
 assert.ok(statSync(file).size>50,`Arquivo muito pequeno: ${path}`);
}
const login=readFileSync(new URL('index.html',root),'utf8');
const app=readFileSync(new URL('app.html',root),'utf8');
assert.ok(login.includes('v10form')&&login.includes('v10email'));
assert.ok(app.includes('vx-logout'));
for(const html of [login,app]){
 for(const str of ['demo-bridge.js','google.script.run','PRÉVIA LOCAL • NÃO USE DADOS REAIS','ACESSO SIMULADO'])assert.ok(!html.includes(str),`Resíduo de teste: ${str}`);
 assert.ok(html.includes('assets/'),'Bundle JS não encontrado');
}
for(const src of ['core.js','management-core.js','documents-rules.js','sites-rules.js','enterprise-workspace.js','timeclock-core.js','timeclock-ui.js','timeclock-pdf.js','timeclock.css','timeclock-vendor-pdf.js'])assert.ok(existsSync(new URL(src,root)),`Faltando ${src}`);
console.log('Build de produção possui login, app, recursos locais e não contém adaptador fictício.');

for(const name of ['privacidade.html','exclusao-de-dados.html']){
 const html=readFileSync(new URL(name,root),'utf8');
 assert.ok(html.includes('comercial@veloxservice.com.br'));
 assert.ok(html.includes('50.207.186/0001-22'));
 assert.ok(!/<script\b|<form\b/i.test(html),'Página pública deve funcionar sem login, script ou coleta');
 for(const match of html.matchAll(/href="\.\/([^"#?]+)"/g))assert.ok(existsSync(new URL(match[1],root)),`Link público ausente: ${match[1]}`);
}
assert.ok(login.includes('./privacidade.html'),'Login deve oferecer acesso à privacidade');
