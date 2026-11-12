import {readFileSync,statSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../dist-uso-real/',import.meta.url);
for(const path of ['index.html','app.html','_headers']){
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
