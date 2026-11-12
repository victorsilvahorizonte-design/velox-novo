/** Regressão funcional da prévia local. Usa só recursos nativos do Node, sem credenciais. */
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LOCALES,normalizeLocale,translateText,formatDate,formatCurrency,formatCountryName,LANGUAGE_OPTIONS,languageNames,TRANSLATIONS} from './i18n.js';

const scripts=['management-core.js','sites-rules.js','documents-rules.js','core.js','demo-bridge.js'];
function harness({failWrite=false}={}){
 const memory=new Map();let rejectWrite=failWrite;
 const state={console,Date,crypto:webcrypto,atob,btoa,URL,TextEncoder,
  location:{reload(){}},
  localStorage:{getItem:key=>memory.get(key)||null,removeItem:key=>memory.delete(key),setItem:(key,val)=>{
   if(rejectWrite)throw new Error('quota exceeded');memory.set(key,val);
  }}
 };
 state.window=state;
 const sandbox=createContext(state);
 for(const file of scripts)runInContext(readFileSync(new URL('./'+file,import.meta.url),'utf8'),sandbox,{filename:file});
 let keyCounter=0;
 const key=()=>`test_${String(++keyCounter).padStart(20,'0')}`;
 return {sandbox,memory,key,setRejectWrite:v=>rejectWrite=v,call:(action,data={})=>sandbox.VXDemo.api(action,{
  ...data,...(/^(person\.save|person\.terminate|catalog\.save|folder\.create|document\.upload|site\.save|site\.delete|obligation\.save|obligation\.resolve|contract\.save|management\.upload|management\.link|preferences\.save)$/.test(action)?{chaveOperacao:key()}: {})
 })};
}
function catalogs(h){
 const cc=h.call('catalog.save',{tipo:'centroCusto',nome:'Centro fictício de testes',codigo:'TESTE'});
 const eq=h.call('catalog.save',{tipo:'equipe',nome:'Equipe fictícia de testes'});
 const job=h.call('catalog.save',{tipo:'cargo',nome:'Cargo fictício de testes'});
 return {cc,eq,job};
}
function savePerson(h,refs,other={}){
 return h.call('person.save',{nome:'Colaborador Exemplo Simulado',centroCustoId:refs.cc.id,equipeId:refs.eq.id,cargoId:refs.job.id,cpf:'11144477735',trabalho:{admissao:'2025-01-15'},...other});
}

test('inicia prévia sem registro real ou credenciais',()=>{
 const h=harness();const boot=h.call('bootstrap');
 assert.equal(boot.pessoas.length,0);
 assert.equal(boot.centrosCusto.length,0);
 assert.equal(boot.pastaUrl,'#');
 assert.equal(h.sandbox.google,undefined);
 assert.equal(typeof h.sandbox.VeloXApi.call,'function');
});

test('cadastra centro de custo, equipe e cargo; recusa duplicidades',()=>{
 const h=harness();const refs=catalogs(h);
 assert.ok(refs.cc.id&&refs.eq.id&&refs.job.id);
 assert.equal(h.call('bootstrap').centrosCusto.length,1);
 assert.throws(()=>h.call('catalog.save',{tipo:'centroCusto',nome:'Centro fictício de testes'}),/já está cadastrado/);
});

test('cadastro de pessoa cria 14 categorias e mantém o vínculo no resumo',()=>{
 const h=harness();const p=savePerson(h,catalogs(h));
 assert.equal(p.nome,'Colaborador Exemplo Simulado');
 assert.equal(p.pastasCategorias.length,14);
 assert.equal(h.call('bootstrap').pessoas.length,1);
 assert.equal(h.call('people.list')[0].centroCusto,'Centro fictício de testes');
});

test('impede dois vínculos ativos com o mesmo CPF',()=>{
 const h=harness(),refs=catalogs(h);savePerson(h,refs);
 assert.throws(()=>savePerson(h,refs,{nome:'Outro Nome Simulado'}),/Já existe vínculo ativo/);
 assert.equal(h.call('people.list').length,1);
});

test('impede desligamento futuro',()=>{
 const h=harness(),p=savePerson(h,catalogs(h));
 assert.throws(()=>h.call('person.terminate',{id:p.id,versao:p.versao,data:'2099-01-01',confirmado:true}),/futuro/);
 assert.equal(h.call('person.get',{id:p.id}).situacao,'Ativo');
});

test('desligamento e readmissão preservam os dois vínculos e pastas separadas',()=>{
 const h=harness(),refs=catalogs(h),p=savePerson(h,refs);
 const ended=h.call('person.terminate',{id:p.id,versao:p.versao,data:'2025-12-31',confirmado:true});
 assert.equal(ended.situacao,'Desligado');
 const next=savePerson(h,refs,{trabalho:{admissao:'2026-01-02'},recontratacaoConfirmada:true});
 assert.notEqual(next.id,p.id);
 assert.notEqual(next.pastaId,p.pastaId);
 assert.equal(next.historicoVinculos.length,1);
 assert.equal(h.call('people.list').length,2);
});

test('erro ao salvar não deixa cadastro e pastas incompletos em memória',()=>{
 const h=harness(),refs=catalogs(h);h.setRejectWrite(true);
 assert.throws(()=>savePerson(h,refs),/Não foi possível salvar os dados/);
 assert.equal(h.call('people.list').length,0);
 h.setRejectWrite(false);
 const p=savePerson(h,refs);
 assert.equal(p.pastasCategorias.length,14);
 assert.equal(h.call('people.list').length,1);
});

test('mantém os cadastros de teste no armazenamento local após gravação',()=>{
 const h=harness();catalogs(h);
 const data=[...h.memory.values()].map(v=>JSON.parse(v));
 assert.equal(data.at(-1).CentrosCusto.length,1);
 assert.equal(data.at(-1).Equipes.length,1);
});


test('idiomas suportados e preferência padrão em português',()=>{
 assert.deepEqual(LOCALES,['pt-BR','en','es','fr']);
 assert.equal(normalizeLocale('en-US'),'en');
 assert.equal(normalizeLocale('es-MX'),'es');
 assert.equal(normalizeLocale('fr-FR'),'fr');
 for(const legacy of ['de-DE','it-IT','zh-Hans','ja-JP'])assert.equal(normalizeLocale(legacy),'pt-BR');
 assert.equal(normalizeLocale('unknown'),'pt-BR');
});

test('navegação e login são traduzidos para inglês e espanhol sem alterar a marca',()=>{
 assert.equal(translateText('Início','en'),'Home');
 assert.equal(translateText('Início','es'),'Inicio');
 assert.equal(translateText('Entrar no sistema','en'),'Sign in');
 assert.equal(translateText('Senha','es'),'Contraseña');
 assert.equal(translateText('VeloX Service','en'),'VeloX Service');
});

test('texto não mapeado e nomes próprios nunca são traduzidos',()=>{
 assert.equal(translateText('Colaborador Exemplo Simulado','en'),'Colaborador Exemplo Simulado');
 assert.equal(translateText('  Nome de empresa  ','es'),'  Nome de empresa  ');
 assert.equal(translateText(' Início ','en'),' Home ');
});

test('datas inválidas não são convertidas e datas válidas respeitam a região',()=>{
 assert.equal(formatDate('2026-11-05','pt-BR'),'05/11/2026');
 assert.equal(formatDate('2026-11-05','en'),'11/05/2026');
 assert.equal(formatDate('2026-02-30','es'),'');
});

test('formata moeda por região e evita valores inválidos',()=>{
 assert.ok(formatCurrency(1234.56,'pt-BR','BRL').includes('1.234,56'));
 assert.ok(formatCurrency(1234.56,'en','USD').includes('$1,234.56'));
 assert.equal(formatCurrency('valor não numérico','en','USD'),'');
});

test('seletor nativo instalado no login e no aplicativo sem bloquear Google Tradutor',()=>{
 for(const html of ['index.html','app.html']){
  const content=readFileSync(new URL('./'+html,import.meta.url),'utf8');
  assert.match(content,/data-vx-language/);
  assert.match(content,/src="\.\/i18n\.js"/);
  assert.doesNotMatch(content,/name=["']google["']\s+content=["']notranslate/);
  assert.doesNotMatch(content,/<html[^>]+translate=["']no["']/);
 }
});

// VeloX v0.4 consolidated internationalization regression (no browser/Drive account required).
import {COVERED_LABELS} from './i18n.js';
test('cobre a navegação, painéis e seis etapas de cadastro em três idiomas',()=>{
 assert.ok(COVERED_LABELS>=380,`Expected 380+ localized UI phrases, found ${COVERED_LABELS}`);
 const examples={
  'Dados pessoais':['Personal information','Datos personales'],
  'Dados bancários':['Banking information','Datos bancarios'],
  'Situação do trabalho':['Employment details','Situación laboral'],
  'Configurar colunas':['Configure columns','Configurar columnas'],
  'Obrigações vencidas':['Overdue obligations','Obligaciones vencidas'],
  'Cadastre sua primeira equipe':['Add your first team','Registra tu primer equipo'],
  'Conta poupança':['Savings account','Cuenta de ahorro'],
  'Pessoa com deficiência (PCD)':['Person with disability (PwD)','Persona con discapacidad (PcD)'],
 };
 for(const [pt,[en,es]] of Object.entries(examples)){
  assert.equal(translateText(pt,'en'),en,pt);
  assert.equal(translateText(pt,'es'),es,pt);
  assert.equal(translateText(pt,'pt-BR'),pt,pt);
 }
});
test('traduz contadores, páginas e etapas variáveis sem mudar os números',()=>{
 assert.equal(translateText('23 resultados · Página 2 de 4','en'),'23 results · Page 2 of 4');
 assert.equal(translateText('23 resultados · Página 2 de 4','es'),'23 resultados · Página 2 de 4');
 assert.equal(translateText('8 de 14 cadastros','en'),'8 of 14 records');
 assert.equal(translateText('Etapa 5 de 6','es'),'Paso 5 de 6');
 assert.equal(translateText('Nenhum aniversariante em novembro','en'),'No birthdays in November');
 assert.equal(translateText('Atualizado em 05/11/2026, 12:38','en'),'Updated on 11/05/2026, 12:38');
});
test('preserva valores de cadastro e formatação de campos brasileira',()=>{
 for(const text of ['Centro de Custo PMGO','Maria da Silva','123.456.789-00','EMPRESA LOCAL','QCG-SE-01']){
  assert.equal(translateText(text,'en'),text);
  assert.equal(translateText(text,'es'),text);
 }
 assert.equal(formatDate('2026-11-05','es'),'05/11/2026');
});
test('formulários e opções de seleção estão cobertos por traduções nativas',()=>{
 for(const phrase of ['Selecione','Inativo','Conta corrente','Nome completo *','Endereço no exterior','Número da CTPS']){
  assert.notEqual(translateText(phrase,'en'),phrase);
 }
});


test('seletor unificado preserva bandeiras animadas, proporções e siglas',()=>{
 const module=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 assert.match(module,/width:auto;min-width:86px;max-width:calc\(100vw - 32px\);height:32px/);
 assert.match(module,/\.vx-lang-trigger\.vx-lang-trigger-login/);
 assert.match(module,/border:1px solid transparent;border-radius:7px;background:transparent;color:var\(--fg,#eef8ea\)/);
 assert.match(module,/\.vx-lang-menu\.vx-lang-menu-login\{background:transparent;border:0/);
 assert.match(module,/width:25px;height:17px/);
 assert.match(module,/function installFlagEngine/);
 assert.match(module,/const gust=\.94\+\.06\*Math\.sin\(time\*\.42\+phaseOffset\*2\)/);
 assert.match(module,/w\.short\.textContent=current\.code/);
 assert.match(module,/row\.label\.textContent=row\.option\.code/);
 assert.match(module,/win\.localStorage\.setItem\('vx\.ui\.locale',language\)/);
 assert.match(module,/createFlag\(doc/);
 assert.match(module,/aria-expanded/);
 for(const html of ['index.html','app.html']){
  const content=readFileSync(new URL('./'+html,import.meta.url),'utf8');
  assert.match(content,/<select data-vx-language/);
 }
});
test('quatro idiomas aparecem no seletor e mantêm nomes acessíveis',()=>{
 assert.equal(LANGUAGE_OPTIONS.length,4);
 assert.deepEqual(LANGUAGE_OPTIONS.map(x=>x.id),['pt-BR','en','es','fr']);
 assert.deepEqual(languageNames('pt-BR'),['Português','Inglês','Espanhol','Francês']);
 assert.deepEqual(languageNames('en'),['Portuguese','English','Spanish','French']);
 assert.deepEqual(languageNames('fr'),['Portugais','Anglais','Espagnol','Français']);
 assert.equal(LANGUAGE_OPTIONS[0].code,'PT');
 assert.equal(LANGUAGE_OPTIONS[0].flag,'br');
 const module=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 assert.match(module,/w\.short\.textContent=current\.code/);
 assert.match(module,/row\.label\.textContent=row\.option\.code/);
});
test('todos os rótulos mapeados possuem tradução nativa nos três idiomas de destino',()=>{
 assert.ok(Object.keys(TRANSLATIONS).length>=423);
 for(const [source,translations] of Object.entries(TRANSLATIONS)){
  for(const locale of LOCALES.slice(1)){
   assert.ok(typeof translations[locale]==='string'&&translations[locale].trim(),`Tradução ausente: ${locale}: ${source}`);
  }
 }
});
test('português, inglês, espanhol e francês preservam as traduções de navegação e formulários',()=>{
 const cases=[
  ['en','Home','Personal information','Password','Step 2 of 6'],
  ['es','Inicio','Datos personales','Contraseña','Paso 2 de 6'],
  ['fr','Accueil','Informations personnelles','Mot de passe','Étape 2 sur 6']
 ];
 for(const [lang,home,personal,password,step] of cases){
  assert.equal(translateText('Início',lang),home,lang);
  assert.equal(translateText('Dados pessoais',lang),personal,lang);
  assert.equal(translateText('Senha',lang),password,lang);
  assert.equal(translateText('Etapa 2 de 6',lang),step,lang);
  assert.equal(translateText('VeloX Service',lang),'VeloX Service',lang);
  assert.ok(formatDate('2026-11-05',lang).length>0);
 }
});
test('nome de empresa, CPF, RG e dados digitados permanecem originais nos quatro idiomas',()=>{
 const examples=['Empresa do Cliente','Centro de Custo PMGO','000.000.000-00','QCG-SE-01'];
 for(const lang of LOCALES){
  for(const phrase of examples)assert.equal(translateText(phrase,lang),phrase);
 }
});
test('mensagens variáveis nos três idiomas preservam números e datas',()=>{
 assert.equal(translateText('2 resultados · Página 1 de 3','fr'),'2 résultats · Page 1 sur 3');
 assert.equal(translateText('15 de 31 cadastros','en'),'15 of 31 records');
 assert.equal(translateText('Nenhum aniversariante em novembro','fr'),'Aucun anniversaire en novembre');
 assert.equal(translateText('Informações a completar 4','fr'),'Informations à compléter : 4');
});


test('login V10 contém os complementos aprovados e traduz os novos rótulos',()=>{
 const login=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 for(const term of ['class="vx-login-separator"','id="vx-google-login"','Entrar com Google','Ainda não tem uma conta?','id="vx-register"','Cadastre-se']) assert.ok(login.includes(term),'Login sem complemento: '+term);
 assert.ok(!login.includes('PRÉVIA DE DESENVOLVIMENTO • ACESSO SIMULADO'));
 assert.match(login,/background:#f7f8f7;color:#26332a/);
 assert.match(login,/height:49px/);
 assert.equal(translateText('ou','en'),'or');
 assert.equal(translateText('OU','en'),'OR');
 assert.equal(translateText('Ainda não tem uma conta?','fr'),"Vous n'avez pas encore de compte ?");
 assert.equal(translateText('Cadastre-se','fr'),"S'inscrire");
});

test('não exibe referências do Drive e não depende do Apps Script na interface',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 const login=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const core=readFileSync(new URL('./core.js',import.meta.url),'utf8');
 for(const term of ['PRÉVIA LOCAL • NÃO USE DADOS REAIS','header-drive','drive.google.com','Google Drive','google.script.run']) assert.ok(!app.includes(term),'app contém resíduo: '+term);
 for(const term of ['accounts.google.com','script.google.com','senha é gerenciada pelo Google','v10google']) assert.ok(!login.includes(term),'login contém resíduo: '+term);
 assert.ok(!core.includes('drive.google.com'));
 assert.ok(app.includes("action==='documents')await showPeople"));
 assert.ok(app.includes('Documentos vinculados'));
});

test('o adaptador local responde sem credenciais Google',async()=>{
 const h=harness(); const response=await h.sandbox.VeloXApi.call('bootstrap',{});
 assert.equal(response.ok,true);
 assert.equal(response.data.pessoas.length,0);
});


test('catálogo documental profissional preserva os 14 identificadores e os seis grupos',()=>{
 const h=harness();const catalog=h.sandbox.VXDocuments.catalog;
 assert.equal(catalog.length,14);
 assert.deepEqual(Array.from(catalog,x=>x.id),Array.from({length:14},(_,i)=>i+1));
 assert.equal(new Set(catalog.map(x=>x.code)).size,14);
 assert.equal(h.sandbox.VXDocuments.groups.length,6);
 assert.equal(catalog.find(x=>x.id===5).classification,'sensitive');
 assert.equal(catalog.find(x=>x.id===6).classification,'sensitive');
 assert.equal(catalog.find(x=>x.id===14).name,'Desligamento e Rescisão Contratual');
 assert.equal(h.sandbox.VXDocuments.categoryName(10),'Demonstrativos de Pagamento (Holerites)');
});

test('nomeação de arquivos continua usando IDs estáveis com nomenclatura profissional',()=>{
 const h=harness();const docs=h.sandbox.VXDocuments;
 assert.match(docs.name(2,'Pessoa Teste','comprovante.pdf',{}),/^Comprovante de Residência - Pessoa Teste\.pdf$/);
 assert.match(docs.name(11,'Pessoa Teste','pagamento.pdf',{month:'2026-10'}),/^Comprovante de Pagamento Salarial - Pessoa Teste - 10-2026\.pdf$/);
});

test('menu lateral usa grupos acessíveis, recolhíveis e tooltips sem título nativo duplicado',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 assert.equal((app.match(/class="nav-group-toggle"/g)||[]).length,6);
 assert.match(app,/data-folder-group-toggle/);
 assert.ok(app.indexOf('<script src="./documents-rules.js"></script>')<app.indexOf('<script src="./demo-bridge.js"></script>'));
 assert.match(app,/folder-category-toggle/);
 assert.match(app,/aria-expanded="true" aria-controls="nav-group-workspace"/);
 assert.match(app,/data-tooltip=/);
 assert.doesNotMatch(app,/content:attr\(title\)/);
 assert.match(app,/data-tooltip="Aplicativos e Conexões"/);
 assert.doesNotMatch(app,/id="nav-home"[^>]+title=/);
});

test('interface remove administração obsoleta e cursor personalizado, preservando acesso externo',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 assert.doesNotMatch(app,/vx-owner-panel|vx-distribution|VXDistribution/);
 const i18n=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 assert.doesNotMatch(i18n,/Meu VeloX|Administração do Sistema/);
 assert.doesNotMatch(app,/native-cursor|external-native-cursor|cursor:url\(/);
 assert.match(app,/id="external-panel"/);
});

test('login não simula moldura, barra de status ou ilha de celular',()=>{
 const login=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.doesNotMatch(login,/<div class="status">/);
 assert.doesNotMatch(login,/class="status"|\.status\{|\.island\{/);
 assert.match(login,/border:0!important;border-radius:0!important;box-shadow:none!important/);
});

test('camada visual padroniza rolagem, espaçamentos, alta resolução e breakpoints',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 const login=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.match(app,/scrollbar-width:thin/);
 assert.match(app,/--vx-space-1:4px/);
 assert.match(app,/max-width:min\(100%,3000px\)/);
 assert.match(app,/min-width:2560px/);
 assert.match(app,/shape-rendering:geometricPrecision/);
 assert.match(login,/devicePixelRatio/);
 assert.match(login,/min-width:2560px/);
});


test('catálogo de tradução está completo nos três idiomas de destino',()=>{
 for(const [source,targets] of Object.entries(TRANSLATIONS)){
  for(const locale of LOCALES.slice(1))assert.ok(targets[locale]&&String(targets[locale]).trim(),`Tradução ausente: ${source} / ${locale}`);
 }
 assert.ok(Object.keys(TRANSLATIONS).length>=900);
});

test('tradução cobre opções profissionais de RH, DP, contratos e estados',()=>{
 const samples={
  'Solteiro(a)':'Single','Feminino':'Female','Não binário':'Non-binary',
  'Pós-graduação':'Postgraduate education','Conta salário':'Payroll account',
  'Afastado':'On leave','Desligado':'Terminated','Em renovação':'Renewal in progress',
  'Próximo do vencimento':'Due soon','Comprovante de pagamento':'Proof of payment',
  'Institucional':'Institutional','Governo/Fiscal':'Government / Tax'
 };
 for(const [source,target] of Object.entries(samples))assert.equal(translateText(source,'en'),target);
});

test('países, datas, moedas e abreviações do calendário respeitam o idioma',()=>{
 assert.equal(formatCountryName('ÁFRICA DO SUL','en'),'South Africa');
 assert.equal(formatCountryName('SUÍÇA','fr'),'Suisse');
 assert.equal(translateText('05/11/2026, hoje','en'),'11/05/2026, today');
 assert.equal(translateText('05/11/2026, hoje','fr'),'05/11/2026, aujourd’hui');
 assert.equal(translateText('Fev','en'),'Feb');
 assert.match(translateText('R$ 1.234,56','en'),/1,234\.56/);
});

test('mensagens dinâmicas e prefixos de confirmações são traduzidos sem alterar nomes',()=>{
 assert.equal(translateText('2 registros · página 1 de 3','en'),'2 records · page 1 of 3');
 assert.equal(translateText('5 compromissos · exibindo os primeiros 100; refine os filtros','en'),'5 commitments · showing the first 100; refine the filters');
 assert.equal(translateText('Você está encerrando o vínculo de','en'),'You are ending the employment relationship of');
 assert.equal(translateText('Confirmo o desligamento de','fr'),'Je confirme le départ de');
 assert.equal(translateText('Abrir cadastro existente','en'),'Open existing record');
 assert.equal(translateText('Destino:','en'),'Destination:');
 assert.equal(translateText('Dados do colaborador em dia.','en'),'Employee information is up to date.');
});

test('interface traduz status controlados em tabelas e preserva células de dados pessoais',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 const i18n=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 assert.match(app,/data-vx-ui-text/);
 assert.match(i18n,/element\.closest\('\[data-vx-ui-text\]'\)/);
 assert.match(i18n,/\[data-vx-user-data\]/);
 assert.match(app,/data-vx-user-data/);
 assert.match(app,/data-vx-country-label/);
 assert.match(i18n,/countryLabel=!!parent\.closest\('\[data-vx-country-label\]'\)/);
});

test('relatórios PDF e Excel recebem rótulos e datas no idioma selecionado',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 assert.match(app,/model\.labels\?\.sheetName/);
 assert.match(app,/labels\.reportTitle/);
 assert.match(app,/labels\.footer/);
 assert.match(app,/new Intl\.DateTimeFormat\(locale/);
 assert.match(app,/columns=VP\.selected\(reportState\.keys\)\.map/);
 assert.doesNotMatch(app,/A exportação PDF não oferece suporte a caracteres chineses ou japoneses/);
 assert.match(app,/window\.VXI18n\?\.date\(iso\)/);
});

test('tooltips usam o componente visual do VeloX e não exibem title nativo duplicado',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 const login=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const locale=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 const production=readFileSync(new URL('./frontend/prepare-pages.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(app,/\btitle\s*=\s*["']/i);
 assert.doesNotMatch(login,/\btitle\s*=\s*["']/i);
 assert.match(app,/data-tooltip="Ir para Início"/);
 assert.match(app,/data-tooltip="Abrir documento"/);
 assert.match(app,/data-tooltip=/);
 assert.match(locale,/function installVeloXTooltips/);
 assert.match(locale,/role','tooltip'/);
 assert.match(locale,/aria-describedby/);
 assert.match(locale,/pointerover/);
 assert.match(locale,/focusin/);
 assert.match(locale,/removeAttribute\('title'\)/);
 assert.match(production,/data-tooltip="Encerrar sessão"/);
 assert.doesNotMatch(production,/title="Encerrar sessão"/);
});



test('limpeza de idiomas mantém exclusivamente PT, EN, ES e FR nos arquivos ativos',()=>{
 assert.deepEqual(LOCALES,['pt-BR','en','es','fr']);
 assert.deepEqual(LANGUAGE_OPTIONS.map(({id,code,flag})=>({id,code,flag})),[
  {id:'pt-BR',code:'PT',flag:'br'},
  {id:'en',code:'EN',flag:'us'},
  {id:'es',code:'ES',flag:'es'},
  {id:'fr',code:'FR',flag:'fr'}
 ]);
 assert.equal(languageNames('fr').length,4);
 for(const file of ['index.html','app.html']){
  const html=readFileSync(new URL('./'+file,import.meta.url),'utf8');
  for(const lang of ['pt-BR','en','es','fr'])assert.ok(html.includes(`<option value="${lang}">`),`${file}: ${lang} ausente`);
  for(const legacy of ['de','it','zh-CN','ja']){
   assert.ok(!html.includes(`<option value="${legacy}">`),`${file}: idioma antigo ${legacy}`);
  }
 }
 const module=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 for(const legacy of ["id:'de'","id:'it'","id:'zh-CN'","id:'ja'",'cn:"<rect','jp:"<rect']){
  assert.ok(!module.includes(legacy),'Idioma ou bandeira removido ainda presente: '+legacy);
 }
 for(const [source,translations] of Object.entries(TRANSLATIONS)){
  assert.deepEqual(Object.keys(translations).sort(),['en','es','fr'],`Idiomas extras na frase: ${source}`);
 }
 for(const legacy of ['de-DE','it-IT','zh-CN','ja-JP'])assert.equal(normalizeLocale(legacy),'pt-BR');
});


test('arquitetura VeloX Business preserva as rotas atuais e os grupos de navegação',()=>{const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');for(const id of ['nav-home','nav-overview','nav-people','nav-organization','nav-obligations','nav-contracts','nav-reports','nav-alerts'])assert.ok(app.includes('id="'+id+'"'),'Rota ausente: '+id);assert.match(app,/id="vx-module-search"/);assert.match(app,/class="vx-exec-dashboard vx-command-center"/);assert.match(app,/Movimentação de pessoas/);assert.ok(app.includes('VXOverview.calculate(people,filters,today)'));});

test('Gestão de Pessoas usa um diretório unificado e uma central de estrutura organizacional',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 assert.match(app,/id="nav-overview"[^>]*data-action="overview"/);
 assert.match(app,/id="nav-people"[^>]*data-action="people"/);
 assert.match(app,/id="nav-organization"[^>]*data-action="people-structure"/);
 assert.match(app,/id="nav-reports"[^>]*data-action="reports"/);
 assert.match(app,/data-action="people-scope"/);
 assert.match(app,/peopleMetric\('active','Ativos'/);
 assert.match(app,/peopleMetric\('away','Afastados'/);
 assert.match(app,/peopleMetric\('departed','Desligados'/);
 assert.match(app,/function renderPeopleStructure\(\)/);
 assert.match(app,/vx-org-card/);
 assert.match(app,/vx-dossier-card/);
 assert.match(app,/Diretório de pessoas/);
 assert.doesNotMatch(app,/id="nav-departed"|id="nav-costs"|id="nav-teams"|id="nav-jobs"/);
});

test('novos rótulos do ecossistema possuem traduções nos quatro idiomas',()=>{
 for(const phrase of ['GESTÃO DE PESSOAS','FINANCEIRO E CONTÁBIL','Ponto e jornada','Folha de pagamento','Financeiro','Contábil e fiscal','PAINEL EXECUTIVO','Acesso rápido','Central de alertas']){
  for(const locale of ['en','es','fr'])assert.notEqual(translateText(phrase,locale),phrase,phrase+' / '+locale);
 }
});


test('Central Inteligente de Alertas usa registros existentes e preserva as rotas atuais',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 for(const marker of ['id="nav-alerts"','data-action="alerts"','window.VXShowAlertCenter=showAlertCenter','MR?.alerts?MR.alerts','loadManagement(!!force)','data-alert-filter','data-action="alert-open"','data-action="alert-preferences"','vx:localechange']){
  assert.ok(app.includes(marker),'Central de alertas: '+marker);
 }
 assert.match(app,/function showAlertCenter\(force=false\)/);
 assert.match(app,/id="vx-alert-detail-dialog"/);
 assert.match(app,/id="vx-alert-nav-count"/);
 assert.match(app,/const resolvedRows=\(managementData\?\.obrigacoes\|\|\[\]\)\.filter\(row=>row\.resolvidoEm\)/);
 assert.doesNotMatch(app,/Documento obrigatório não localizado|Lançamento financeiro aguardando aprovação/);
 for(const localeTitle of ["title:'Central de alertas'","title:'Alert Center'","title:'Centro de alertas'","title:'Centre d’alertes'"]){
  assert.ok(app.includes(localeTitle),'Tradução ausente: '+localeTitle);
 }
 assert.equal(translateText('Central de alertas','en'),'Alert Center');
 assert.equal(translateText('Central de alertas','es'),'Centro de alertas');
 assert.equal(translateText('Central de alertas','fr'),'Centre d’alertes');
});


test('Busca Universal pesquisa colaboradores, contratos, obrigações, documentos e equipes sem expor CPF completo',()=>{
 const h=harness(),refs=catalogs(h),person=savePerson(h,refs);
 h.call('document.upload',{pessoaId:person.id,categoria:5,nome:'ASO admissional - exemplo.pdf',mime:'application/pdf',base64:'dGVzdGU='});
 const contract=h.call('contract.save',{contratante:'PMGO',numero:'61-2024',objeto:'Serviços de gestão de equipes',valor:'1200.00',inicio:'2026-01-01',fim:'2026-12-31',situacao:'Vigente',avisoDias:30,renovacao:'2026-12-01'});
 h.call('obligation.save',{area:'Contabilidade',categoria:'Documentação mensal',descricao:'Dossiê mensal PMGO',competencia:'2026-10',valor:'100.00',emissao:'2026-10-01',vencimento:'2026-12-10',periodicidade:'Mensal',recebimento:'Pendente',pagamento:'Pendente',contratoId:contract.id});

 const findGroup=(result,name)=>result.groups.find(group=>group.category===name);
 const byName=h.call('search.global',{query:'Colaborador Exemplo'});
 const employee=findGroup(byName,'COLABORADORES').items[0];
 assert.equal(employee.id,person.id);
 assert.equal(employee.kind,'person');
 assert.equal(employee.details.cpfMasked,'***.***.***-35');
 assert.equal(employee.cpf,undefined);
 assert.equal(employee.details.cpf,undefined);
 assert.equal(employee.details.bancarios,undefined);

 const byCpf=h.call('search.global',{query:'111.444.777-35'});
 assert.equal(findGroup(byCpf,'COLABORADORES').items[0].id,person.id);

 const byContract=h.call('search.global',{query:'61-2024'});
 assert.ok(findGroup(byContract,'CONTRATOS').items.some(item=>item.id===contract.id));

 const byObligation=h.call('search.global',{query:'Dossie mensal'});
 assert.ok(findGroup(byObligation,'OBRIGAÇÕES').items.some(item=>item.title==='Dossiê mensal PMGO'));

 const byDocument=h.call('search.global',{query:'ASO admissional'});
 const document=findGroup(byDocument,'DOCUMENTOS').items[0];
 assert.equal(document.documentScope,'employee');
 assert.equal(document.pessoaId,person.id);
 assert.equal(document.details.sensivel,true);

 const byTeam=h.call('search.global',{query:'Equipe ficticia'});
 assert.ok(findGroup(byTeam,'EQUIPES').items.some(item=>item.title==='Equipe fictícia de testes'));
});

test('Busca Universal exige dois caracteres, limita resultados por grupo e indica truncamento',()=>{
 const h=harness(),refs=catalogs(h);
 savePerson(h,refs);
 savePerson(h,refs,{nome:'Outro Colaborador Simulado',cpf:'52998224725'});
 assert.equal(h.call('search.global',{query:'C'}).groups.length,0);
 const result=h.call('search.global',{query:'Colaborador',limit:1});
 const group=result.groups.find(item=>item.category==='COLABORADORES');
 assert.equal(group.items.length,1);
 assert.equal(group.total,2);
 assert.equal(group.truncated,true);
 assert.equal(result.truncated,true);
});

test('Busca Universal está integrada ao cabeçalho, ao atalho Ctrl K e ao painel lateral',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 for(const marker of ['id="vx-global-search-input"','id="vx-global-search-results"','id="vx-global-search-detail"','window.VXSearchOpen','search.global','Ctrl K','data-vx-search-index','role="dialog"']){
  assert.ok(app.includes(marker),'Busca Universal: '+marker);
 }
 for(const phrase of ['COLABORADORES','CONTRATOS','DOCUMENTOS','OBRIGAÇÕES','EQUIPES'])assert.ok(app.includes(phrase),'Grupo de pesquisa ausente: '+phrase);
});

test('novos textos da Busca Universal possuem tradução em PT, EN, ES e FR',()=>{
 for(const phrase of ['Pesquisar em todo o VeloX','BUSCA UNIVERSAL','Digite pelo menos 2 caracteres','Pesquisando...','Nenhum resultado encontrado','Abrir pasta','Abrir equipes','Este arquivo pertence a uma categoria sensível. O conteúdo não é exibido na busca.']){
  for(const locale of ['en','es','fr'])assert.notEqual(translateText(phrase,locale),phrase,phrase+' / '+locale);
 }
 assert.equal(translateText('de','fr'),'sur');
});

test('regras de produção incluem a mesma ação segura de pesquisa global',()=>{
 const source=readFileSync(new URL('./supabase/functions/velox-api/rules.ts',import.meta.url),'utf8');
 assert.match(source,/const allowed = \['bootstrap','search\.global'/);
 assert.match(source,/function globalSearch\(payload\)/);
 assert.match(source,/case 'search\.global': result=globalSearch\(p\); break;/);
 const executable=source.replace(/export\s*\{\s*VX_CONFIG,\s*VeloXCore,\s*VeloXDocuments\s*\};?\s*$/,'');
 const sandbox=createContext({console,Date,crypto:webcrypto,TextEncoder});
 runInContext(executable,sandbox,{filename:'rules.ts'});
 const core=runInContext('VeloXCore',sandbox);
 const tables=['Pessoas','Pastas','Documentos','Logs','Operacoes','CentrosCusto','Equipes','Cargos','SitesExternos','Obrigacoes','Contratos','GestaoDocumentos','GestaoHistorico','Preferencias'];
 const db=Object.fromEntries(tables.map(name=>[name,[]]));
 db.CentrosCusto.push({id:'cc-1',nome:'Centro Teste'});
 db.Equipes.push({id:'eq-1',nome:'Equipe Teste',ativo:true});
 db.Cargos.push({id:'job-1',nome:'Cargo Teste'});
 db.Pessoas.push({id:'p-1',nome:'Joana Silva',cpf:'11144477735',situacao:'Ativo',centroCustoId:'cc-1',equipeId:'eq-1',cargoId:'job-1',trabalho:{admissao:'2026-01-01'},dadosPessoais:{email:'joana@example.test'}});
 const store={all:name=>db[name]||[],put(name,record){db[name].push(record);return record;},remove(){}};
 const ctx={store,role:'owner',email:'owner@example.test',categories:[],now:()=> '2026-11-09T12:00:00.000Z',today:()=> '2026-11-09',hash:()=> 'test',uuid:()=> 'test'};
 db.Contratos.push({id:'c-1',numero:'61-2024',contratante:'PMGO',situacao:'Vigente',inicio:'2026-01-01',fim:'2026-12-31',valorCentavos:120000});
 db.GestaoDocumentos.push({id:'gd-1',tipo:'contract',registroId:'c-1',documentoTipo:'Assinado',nome:'Contrato 61-2024 assinado.pdf',mime:'application/pdf',tamanho:1024,enviadoEm:'2026-11-01T12:00:00.000Z',driveId:'mgdoc-1'});
 const result=core.execute(ctx,'search.global',{query:'Joana'});
 const person=result.groups.find(group=>group.category==='COLABORADORES').items[0];
 assert.equal(person.title,'Joana Silva');
 assert.equal(person.cpfMasked,'***.***.***-35');
 assert.equal(person.cpf,undefined);
 const docs=core.execute(ctx,'search.global',{query:'Contrato 61-2024 assinado'}).groups.find(group=>group.category==='DOCUMENTOS');
 assert.equal(docs.items[0].documentScope,'management');
 assert.equal(docs.items[0].registroId,'c-1');
 assert.equal(docs.items[0].url,undefined);
 assert.equal(docs.items[0].driveId,undefined);
});


test('Busca Universal reutiliza a instância de idiomas sem duplicar os seletores',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 const i18n=readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
 assert.doesNotMatch(app,/import\s*\{[^}]+\}\s*from\s*['"]\.\/i18n\.js['"]/,'A busca não deve carregar i18n.js uma segunda vez.');
 assert.match(app,/document\.addEventListener\('vx:localechange'/,'A busca deve acompanhar a troca de idioma pelo evento oficial.');
 assert.match(i18n,/if\(win\.__vxI18nCleanup\)return win\.__vxI18nCleanup;/,'A inicialização de idiomas precisa ser idempotente.');
 assert.match(i18n,/win\.__vxI18nCleanup=cleanup;/,'A limpeza da instância deve ser registrada na janela.');
});

test('auditoria registra operações concluídas e apenas nomes de campos, sem valores sensíveis',()=>{
 const h=harness(),refs=catalogs(h);
 const person=savePerson(h,refs,{bancarios:{banco:'Banco Fictício',agencia:'1234',conta:'987654',tipoConta:'Corrente',pix:'pix-privado-nao-registrar'},trabalho:{admissao:'2025-01-15',salarioBruto:'9876.54'}});
 const result=h.call('audit.list',{pageSize:100});
 const row=result.rows.find(item=>item.acao==='person.save'&&item.registro===person.id);
 assert.ok(row);
 assert.equal(row.area,'Gestão de Pessoas');
 assert.equal(row.evento,'Cadastro');
 assert.ok(row.campos.includes('cpf'));
 assert.ok(row.campos.includes('bancarios.pix'));
 assert.ok(row.campos.includes('trabalho.salarioBruto'));
 const serialized=JSON.stringify(row);
 for(const secret of ['11144477735','Banco Fictício','987654','pix-privado-nao-registrar','9876.54'])assert.ok(!serialized.includes(secret),`Valor sensível vazou: ${secret}`);
});

test('auditoria identifica somente os campos realmente alterados em uma atualização',()=>{
 const h=harness(),refs=catalogs(h),person=savePerson(h,refs);
 h.call('person.save',{id:person.id,versao:person.versao,nome:'Colaborador Atualizado',centroCustoId:refs.cc.id,equipeId:refs.eq.id,cargoId:refs.job.id});
 const rows=h.call('audit.list',{query:person.id,pageSize:100}).rows;
 const update=rows.find(row=>row.acao==='person.save'&&row.evento==='Atualização');
 assert.ok(update);
 assert.deepEqual(Array.from(update.campos),['nome']);
});

test('auditoria filtra por usuário, ação, registro, área e período com paginação',()=>{
 const h=harness(),refs=catalogs(h),person=savePerson(h,refs);
 const today=new Date().toISOString().slice(0,10);
 const byArea=h.call('audit.list',{area:'Cadastros auxiliares',pageSize:10});
 assert.equal(byArea.total,3);
 const byAction=h.call('audit.list',{query:'catalog.save',pageSize:10});
 assert.equal(byAction.total,3);
 const byUser=h.call('audit.list',{query:'Administrador',pageSize:10});
 assert.equal(byUser.total,4);
 const byRecord=h.call('audit.list',{query:person.id,pageSize:10});
 assert.ok(byRecord.rows.some(row=>row.registro===person.id));
 const byDate=h.call('audit.list',{from:today,to:today,pageSize:2,page:2});
 assert.equal(byDate.total,4);
 assert.equal(byDate.page,2);
 assert.equal(byDate.rows.length,2);
});

test('operações inválidas não geram auditoria e a consulta de auditoria é somente leitura',()=>{
 const h=harness();
 assert.throws(()=>h.call('catalog.save',{tipo:'centroCusto',nome:'X'}),/Informe o nome/);
 assert.equal(h.call('audit.list').total,0);
 h.call('catalog.save',{tipo:'centroCusto',nome:'Centro válido'});
 assert.equal(h.call('audit.list').total,1);
 h.call('audit.list',{query:'catalog.save'});
 assert.equal(h.call('audit.list').total,1);
});

test('envio de documento gera evento sem armazenar nome, conteúdo ou base64 do arquivo',()=>{
 const h=harness(),person=savePerson(h,catalogs(h));
 h.call('document.upload',{pessoaId:person.id,categoria:5,nome:'ASO confidencial teste.pdf',mime:'application/pdf',base64:'dGVzdGU='});
 const row=h.call('audit.list',{query:'document.upload',pageSize:10}).rows[0];
 assert.ok(row);
 assert.equal(row.evento,'Envio de documento');
 assert.deepEqual(Array.from(row.campos),['arquivo','categoria']);
 const serialized=JSON.stringify(row);
 assert.ok(!serialized.includes('ASO confidencial teste.pdf'));
 assert.ok(!serialized.includes('dGVzdGU='));
});

test('Histórico e Auditoria está integrado à navegação e traduzido nos quatro idiomas',()=>{
 const app=readFileSync(new URL('./app.html',import.meta.url),'utf8');
 assert.match(app,/id="nav-audit"/);
 assert.match(app,/window\.VXShowAuditCenter=showAuditCenter/);
 assert.match(app,/call\('audit\.list'/);
 assert.match(app,/id="vx-audit-filters"/);
 assert.match(app,/data-audit-page/);
 assert.equal(translateText('Histórico e Auditoria','en'),'History & Audit');
 assert.equal(translateText('Histórico e Auditoria','es'),'Historial y auditoría');
 assert.equal(translateText('Histórico e Auditoria','fr'),'Historique et audit');
 for(const phrase of ['Campos alterados','Data e hora','Nenhum evento encontrado','Limpar filtros']){
  for(const locale of ['en','es','fr'])assert.notEqual(translateText(phrase,locale),phrase,phrase+' / '+locale);
 }
});

const pointExample=()=>({habilitado:true,whatsapp:'(62) 99999-0000',vigencia:'2025-01-15',dom:0,seg:540,ter:540,qua:540,qui:540,sex:480,sab:0});
test('cadastro único salva WhatsApp, jornada e histórico no colaborador',()=>{const h=harness(),refs=catalogs(h),p=savePerson(h,refs,{matricula:'001',ponto:pointExample()});assert.equal(p.ponto.whatsapp,'5562999990000');assert.equal(p.ponto.seg,540);assert.equal(p.pontoHistorico.length,1);assert.equal(h.call('bootstrap').pessoas[0].ponto.whatsapp,p.ponto.whatsapp);const updated=h.call('person.save',{id:p.id,versao:p.versao,nome:'Pessoa Teste Atualizada'});assert.equal(updated.ponto.whatsapp,p.ponto.whatsapp);assert.equal(updated.pontoHistorico.length,1);});
test('não acrescenta nem remove o nono dígito do WhatsApp',()=>{const h=harness(),E=h.sandbox.VXEnrollment;assert.equal(E.phone('62 9913-6262'),'556299136262');assert.equal(E.phone('+55 (62) 99913-6262'),'5562999136262');assert.throws(()=>E.phone('62 abc99990000'));});
test('telefone habilitado não pode identificar duas pessoas',()=>{const h=harness(),refs=catalogs(h);savePerson(h,refs,{ponto:pointExample()});assert.throws(()=>savePerson(h,refs,{nome:'Outra Pessoa Fictícia',cpf:'',ponto:pointExample()}),/já está habilitado/);assert.equal(h.call('bootstrap').pessoas.length,1);});
test('habilitação exige admissão, vigência e sete dias válidos',()=>{for(const changes of [{whatsapp:''},{vigencia:'2025-01-14'},{seg:''},{seg:1.5},{sab:-1},{dom:1441},{habilitado:'sim'}]){const h=harness(),refs=catalogs(h);assert.throws(()=>savePerson(h,refs,{ponto:{...pointExample(),...changes}}));assert.equal(h.call('bootstrap').pessoas.length,0);}});
test('atualizar telefone e jornada versiona configuração preservando anterior',()=>{const h=harness(),refs=catalogs(h),p=savePerson(h,refs,{ponto:pointExample()}),v=h.call('person.save',{id:p.id,versao:p.versao,ponto:{...p.ponto,whatsapp:'62999990001',vigencia:'2026-11-01',seg:480}});assert.equal(v.pontoHistorico.length,2);assert.equal(v.pontoHistorico[0].config.seg,540);assert.equal(v.pontoHistorico[0].config.whatsapp,'5562999990000');assert.equal(v.ponto.whatsapp,'5562999990001');});
function csvExample(unit){return 'nome;matricula;whatsapp;admissao;unidade;ponto;vigencia;seg;ter;qua;qui;sex;sab;dom\r\n"Pessoa; Fictícia";0001;62999990000;2025-01-15;'+unit+';sim;2025-01-15;540;540;540;540;480;0;0';}
test('CSV lê BOM, aspas e matrícula com zero inicial',()=>{const h=harness(),refs=catalogs(h),rows=h.sandbox.VXEnrollment.parseCSV('\ufeff'+csvExample(refs.cc.codigo),[refs.cc]);assert.equal(rows[0].matricula,'0001');assert.equal(rows[0].nome,'Pessoa; Fictícia');assert.equal(rows[0].ponto.whatsapp,'5562999990000');assert.equal(rows[0].ponto.dom,0);});
test('CSV recusa cabeçalho, aspas abertas, data e unidade inválidos',()=>{const h=harness(),refs=catalogs(h),E=h.sandbox.VXEnrollment;for(const csv of [csvExample('inexistente'),csvExample(refs.cc.codigo).replace('2025-01-15','2025-02-30'),csvExample(refs.cc.codigo).replace('matricula','cpf'),csvExample(refs.cc.codigo)+'"'])assert.throws(()=>E.parseCSV(csv,[refs.cc]));});
test('importação salva lote em uma transação e repetir requisição não duplica',()=>{const h=harness(),refs=catalogs(h),rows=h.sandbox.VXEnrollment.parseCSV(csvExample(refs.cc.codigo),[refs.cc]),payload={rows,chaveOperacao:h.key()};const a=h.call('people.import',payload),b=h.call('people.import',payload);assert.equal(a.total,1);assert.equal(a.items[0].id,b.items[0].id);assert.equal(h.call('bootstrap').pessoas.length,1);});
test('duplicidade na segunda linha reverte pessoas, pastas e auditoria do lote',()=>{const h=harness(),refs=catalogs(h),rows=h.sandbox.VXEnrollment.parseCSV(csvExample(refs.cc.codigo),[refs.cc]),initial=h.memory.get('velox.stackblitz.demo.v1');const second={...rows[0],nome:'Segunda Pessoa Teste',matricula:'0002'};assert.throws(()=>h.call('people.import',{rows:[rows[0],second],chaveOperacao:h.key()}),/Linha 3/);assert.equal(h.memory.get('velox.stackblitz.demo.v1'),initial);assert.equal(h.call('bootstrap').pessoas.length,0);const state=JSON.parse(h.memory.get('velox.stackblitz.demo.v1'));assert.equal(state.Pastas.length,0);});
test('falha ao persistir lote não confirma cadastro parcial',()=>{const h=harness(),refs=catalogs(h),rows=h.sandbox.VXEnrollment.parseCSV(csvExample(refs.cc.codigo),[refs.cc]);h.setRejectWrite(true);assert.throws(()=>h.call('people.import',{rows,chaveOperacao:h.key()}),/salvar os dados/);h.setRejectWrite(false);assert.equal(h.call('bootstrap').pessoas.length,0);});
test('matrícula duplicada no lote é recusada mesmo com WhatsApp diferente',()=>{const h=harness(),refs=catalogs(h),rows=h.sandbox.VXEnrollment.parseCSV(csvExample(refs.cc.codigo),[refs.cc]),b={...rows[0],nome:'Outra Pessoa Teste',ponto:{...rows[0].ponto,whatsapp:'5562999990001'}};assert.throws(()=>h.call('people.import',{rows:[rows[0],b],chaveOperacao:h.key()}),/identificador|matrícula/);assert.equal(h.call('bootstrap').pessoas.length,0);});
test('regras do servidor persistem cadastro único, matrícula e lote',()=>{
 const source=readFileSync(new URL('./supabase/functions/velox-api/rules.ts',import.meta.url),'utf8').replace(/export\s*\{\s*VX_CONFIG,\s*VeloXCore,\s*VeloXDocuments\s*\};?\s*$/,'');const sandbox=createContext({console,Date,crypto:webcrypto,TextEncoder});runInContext(source,sandbox);const api=runInContext('VeloXCore',sandbox);let n=0;const tables=['Pessoas','Pastas','Documentos','Logs','Operacoes','CentrosCusto','Equipes','Cargos','SitesExternos','Obrigacoes','Contratos','GestaoDocumentos','GestaoHistorico','Preferencias'];const db=Object.fromEntries(tables.map(t=>[t,[]]));db.CentrosCusto.push({id:'cc-test',nome:'Unidade Teste',ativo:true});const store={all:t=>db[t]||[],put(t,v){const at=db[t].findIndex(r=>r.id===v.id);if(at<0)db[t].push(v);else db[t][at]=v;return v;},remove(){}};const ctx={store,drive:{ensureFolder:()=>({id:'folder_'+(++n),nome:'Fictícia',url:'#'})},email:'owner@example.test',rootId:'root',categories:[],now:()=> '2026-11-11T10:00:00Z',today:()=> '2026-11-11',hash:v=>Buffer.from(String(v)).toString('hex').slice(-24).padStart(24,'0'),uuid:()=> 'id'+(++n)};
 ctx.role='owner';ctx.storage=ctx.drive;
 const row={nome:'Pessoa Fictícia Servidor',matricula:'001',centroCustoId:'cc-test',trabalho:{admissao:'2025-01-15'},ponto:pointExample()};const result=api.execute(ctx,'people.import',{rows:[row],chaveOperacao:'server_batch_0001'});assert.equal(result.total,1);assert.equal(db.Pessoas[0].ponto.whatsapp,'5562999990000');assert.equal(db.Pessoas[0].matricula,'001');assert.equal(db.Pessoas[0].pontoHistorico.length,1);
});
test('alterar admissão não deixa configuração habilitada com vigência anterior',()=>{const h=harness(),refs=catalogs(h),p=savePerson(h,refs,{ponto:pointExample()});assert.throws(()=>h.call('person.save',{id:p.id,versao:p.versao,trabalho:{admissao:'2026-01-01'}}),/vigência/);});
