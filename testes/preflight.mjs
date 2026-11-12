import {readFileSync,existsSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {createRequire} from 'node:module';
import {test} from 'node:test';
import assert from 'node:assert/strict';
const here=new URL('../',import.meta.url);
const file=(f)=>readFileSync(new URL(f,here),'utf8');
const req=createRequire(import.meta.url);
let ts=null;
try{ts=req('typescript');}catch{
  try{const {execFileSync}=req('node:child_process');const {resolve}=req('node:path');
    const globalRoot=execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim();
    ts=req(resolve(globalRoot,'typescript/lib/typescript.js'));
  }catch{ /* O teste sintático pode ser executado após instalar typescript. */ }
}

for(const path of ['supabase/functions/velox-api/index.ts','supabase/functions/velox-api/rules.ts']){
 test(`sintaxe TypeScript válida: ${path}`,{skip:!ts},()=>{
  const sf=ts.createSourceFile(path,file(path),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  assert.equal(sf.parseDiagnostics.length,0,sf.parseDiagnostics.map(x=>x.messageText).join('\n'));
 });
}
test('banco bloqueia acesso direto ao cliente e reserva operação para service_role',()=>{
 const sql=file('supabase/migrations/20261105_001_seguro.sql');
 for(const needle of ['ENABLE ROW LEVEL SECURITY','REVOKE ALL ON public.velox_owners','FROM PUBLIC, anon, authenticated','GRANT EXECUTE ON FUNCTION public.velox_cas_write','TO service_role','WHERE owner_id = p_owner AND revision = p_expected',"public = false"]){assert.ok(sql.includes(needle),needle);}
 assert.ok(!/CREATE\s+POLICY/i.test(sql));
});
test('API exige JWT validado, usuário ativo e origem permitida antes de servir dados',()=>{
 const api=file('supabase/functions/velox-api/index.ts');
 for(const needle of ["admin.auth.getUser(token)","owner?.active","ORIGINS.includes(origin)","req.method!=='POST'", "'cache-control':'no-store'", "velox_cas_write", "upsert:false", "private"]){assert.ok(api.includes(needle),needle);}
 assert.ok(!api.includes('Access-Control-Allow-Origin\':\'*\''));
 assert.ok(!api.includes('localStorage'));
});
test('as regras originais executam no servidor e aceitam dados vazios',()=>{
 const code=file('supabase/functions/velox-api/rules.ts').replace(/export \{ VX_CONFIG, VeloXCore, VeloXDocuments \};/,'globalThis.__RULES={VX_CONFIG,VeloXCore,VeloXDocuments};');
 const sandbox={Date,console,window:{},crypto:{randomUUID:()=>"12345678-1234-1234-1234-123456789012"}};
 runInContext(code,createContext(sandbox));
 assert.equal(typeof sandbox.__RULES.VeloXCore.execute,'function');
 assert.equal(sandbox.__RULES.VeloXDocuments.catalog.length,14);
 assert.equal(sandbox.__RULES.VeloXDocuments.groups.length,6);
 const rows={Pessoas:[],CentrosCusto:[],Equipes:[],Cargos:[],Pastas:[],Documentos:[],SitesExternos:[],Operacoes:[],Logs:[],Obrigacoes:[],Contratos:[],GestaoDocumentos:[],GestaoHistorico:[],Preferencias:[]};
 const ctx={store:{all:t=>rows[t]||[],put:(t,r)=>{rows[t].push(r);return r;},remove:()=>{}},storage:{},role:'owner',email:'owner@example.invalid',rootId:'velox-root',categories:[],now:()=>new Date().toISOString(),today:()=>new Date().toISOString().slice(0,10),hash:()=> '123412341234123412341234',uuid:()=> 'a'.repeat(24),maxUploadBytes:5000000};
 const boot=sandbox.__RULES.VeloXCore.execute(ctx,'bootstrap',{});
 assert.equal(boot.pessoas.length,0);assert.equal(boot.centrosCusto.length,0);
 assert.throws(()=>sandbox.__RULES.VeloXCore.execute({...ctx,role:undefined},'bootstrap',{role:'owner'}),error=>error.code==='PERMISSAO');
 assert.throws(()=>sandbox.__RULES.VeloXCore.execute({...ctx,role:'viewer'},'person.save',{role:'owner'}),error=>error.code==='PERMISSAO');
});
test('cliente só usa chave pública e sessões de navegador, sem service_role',()=>{
 for(const path of ['frontend/production-api.mjs','frontend/production-auth.mjs']){
   const src=file(path);assert.ok(src.includes('VITE_SUPABASE_PUBLISHABLE_KEY'));
   assert.ok(!src.includes('SERVICE_ROLE_KEY'));assert.ok(!src.includes('localStorage'));
 }
});
test('scripts não tocam nos arquivos existentes da prévia ao gerar produção',()=>{
 const script=file('frontend/prepare-pages.mjs');
 assert.ok(script.includes('index.uso-real.html'));assert.ok(script.includes('app.uso-real.html'));
 assert.ok(!/writeFileSync\(path.join\(root,'(?:index|app)\.html'\)/.test(script));
 assert.ok(script.includes('production-src')); 
});
test('uso real bloqueia autenticação simulada e não carrega demo-bridge',{skip:!existsSync((process.env.VELOX_PROJECT_ROOT||process.cwd())+'/index.uso-real.html')},()=>{
 const root=process.env.VELOX_PROJECT_ROOT||process.cwd();
 assert.ok(existsSync(root+'/index.uso-real.html'));
 const login=readFileSync(root+'/index.uso-real.html','utf8');
 const app=readFileSync(root+'/app.uso-real.html','utf8');
 assert.ok(!login.includes('readonly aria-readonly'));
 assert.ok(!login.includes("location.href='./app.html'"));
 assert.ok(!login.includes('O acesso desta versão é demonstrativo'));
 assert.ok(!app.includes('src="./demo-bridge.js"'));
 assert.ok(app.includes('production-api.mjs'));
 assert.ok(app.includes('vx-logout')); 
});

test('catálogo documental da interface e do backend permanece sincronizado',()=>{
 const frontSandbox={window:{}};
 runInContext(file('documents-rules.js'),createContext(frontSandbox));
 const backendCode=file('supabase/functions/velox-api/rules.ts').replace(/export \{ VX_CONFIG, VeloXCore, VeloXDocuments \};/,'globalThis.__RULES={VX_CONFIG,VeloXCore,VeloXDocuments};');
 const backendSandbox={Date,console,window:{},crypto:{randomUUID:()=>"12345678-1234-1234-1234-123456789012"}};
 runInContext(backendCode,createContext(backendSandbox));
 const simplify=items=>Array.from(items,item=>[item.id,item.code,item.name,item.groupId,item.classification]);
 assert.deepEqual(simplify(frontSandbox.window.VXDocuments.catalog),simplify(backendSandbox.__RULES.VeloXDocuments.catalog));
 assert.deepEqual(simplify(frontSandbox.window.VXDocuments.groups),simplify(backendSandbox.__RULES.VeloXDocuments.groups));
 const api=file('supabase/functions/velox-api/index.ts');
 assert.ok(api.includes('VeloXDocuments.catalog.map(item=>item.name)'));
});

test('migration de taxonomia altera somente nomes de pastas por ID e preserva histórico documental',()=>{
 const sql=file('supabase/migrations/20261107_002_taxonomia_documental.sql');
 for(const needle of ['jsonb_set(','snapshot.state',"'{Pastas}'","folder->>'categoria'",'revision = snapshot.revision + 1','changed_at = now()','Documentos de Identificação','Desligamento e Rescisão Contratual'])assert.ok(sql.includes(needle),needle);
 assert.ok(!sql.includes("'{Documentos}'"));
 assert.ok(!sql.includes('DELETE FROM'));
});
