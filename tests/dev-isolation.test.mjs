import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const text=p=>readFileSync(new URL(p, import.meta.url),'utf8');
test('VeloX V10 e app original presentes',()=>{
  assert.match(text('../index.html'),/id="v10form"/);
  assert.match(text('../app.html'),/id="sidebar"/);
});
test('Entrar usa módulo de desenvolvimento; não há botão extra',()=>{
  assert.match(text('../index.html'),/\/src\/login.js/);
  assert.doesNotMatch(text('../index.html'),/VISUALIZAR VELOX|main-CyQko-h7/);
  assert.doesNotMatch(text('../app.html'),/preview-safe|app-b5VVDDMp/);
});
test('Somente módulos locais podem autenticar ou carregar dados',()=>{
  const dev=text('../src/login.js')+text('../src/app.js')+text('../src/mock-api.js');
  assert.doesNotMatch(dev,/supabase\.co|fetch\(|signInWithPassword|Bearer /i);
  assert.match(text('../vite.config.mjs'),/connect-src 'self'/);
});
