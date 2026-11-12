/** Gerado das regras atuais do projeto Velox. Executar somente no servidor. */
const window=Object.create(null);
const VX_CONFIG=Object.freeze({version:'1.0.0',environment:'PRODUCAO',accountingReferences:[],sitesDefaults:[],timeZone:'America/Sao_Paulo'});
// Fonte: sites-rules.js
/** Catálogo de links: regras compartilhadas, sem busca externa ou credenciais. */
function createSiteRules_(){
 const categories=['Institucional','Governo/Fiscal','Benefícios','Comunicação','Outros'];
 function url(value){
  const raw=String(value||'').trim();
  if(raw.length>1200||/[\u0000-\u0020\u007f<>"\\]/.test(raw))throw new Error('Informe uma URL HTTPS válida, sem espaços ou credenciais.');
  const m=raw.match(/^https:\/\/([^/?#]+)([/?#].*)?$/i);if(!m)throw new Error('Use um endereço HTTPS completo.');
  const authority=m[1].toLowerCase(),host=authority.replace(/:443$/,'');
  if(authority.includes('@')||host.includes(':')||host.length>253||!host.includes('.')||/^\d+(\.\d+){3}$/.test(host)||/\.(local|localhost|internal|test|invalid)$/.test(host)||!host.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))||!/[a-z]/.test(host.split('.').at(-1)))throw new Error('Use um domínio público válido, sem usuário, senha ou porta especial.');
  if(/[?&](?:password|senha|token|access_token|api_key|apikey|secret|authorization)=/i.test(raw))throw new Error('Não salve senhas, tokens ou credenciais no endereço.');
  return {url:'https://'+host+(m[2]||'/'),domain:host.replace(/^www\./,'')};
 }
 function validate(p){if(p.ativo!==undefined&&typeof p.ativo!=='boolean')throw new Error('Informe uma situação válida.');const u=url(p.url),name=String(p.nome||'').trim(),description=String(p.descricao||'').trim();if(name.length>100||description.length>240)throw new Error('Nome: até 100 caracteres. Descrição: até 240.');if(p.categoria&&!categories.includes(p.categoria))throw new Error('Escolha uma categoria válida.');return {...u,nome:name,categoria:p.categoria||'Outros',descricao:description,ativo:p.ativo!==false};}
 return {url,validate,categories};
}
var VeloXSites=createSiteRules_();

window.VXSites=createSiteRules_();

// Fonte: documents-rules.js
/** Regras compartilhadas pelo servidor e pela prévia de envio. Só arquivos novos. */
function createDocumentRules_() {
  'use strict';
  const contracts=['ACORDO DE COMPENSAÇÃO DE HORAS TRABALHADAS','CONTRATO DE EXPERIÊNCIA','FICHA DE REGISTRO','REQUERIMENTO VT','TERMO LGPD'];
  const aso=['Admissional','Periódico','Demissional','Retorno ao Trabalho','Mudança de Riscos Ocupacionais','Outro'];
  // Catálogo profissional: IDs permanentes; nomes e grupos são apenas apresentação.
  const catalog=[
    Object.freeze({id:1,code:'IDENTIFICATION',name:"Documentos de Identificação",groupId:'registration',classification:'personal'}),
    Object.freeze({id:2,code:'RESIDENCE',name:"Comprovantes de Residência",groupId:'registration',classification:'personal'}),
    Object.freeze({id:3,code:'CTPS',name:"Carteira de Trabalho (CTPS)",groupId:'registration',classification:'personal'}),
    Object.freeze({id:4,code:'HIRING',name:"Admissão e Contrato de Trabalho",groupId:'employment',classification:'employment'}),
    Object.freeze({id:5,code:'OCCUPATIONAL_HEALTH',name:"Saúde Ocupacional (ASO e Exames)",groupId:'safety',classification:'sensitive'}),
    Object.freeze({id:6,code:'VACCINATION',name:"Registros de Vacinação",groupId:'safety',classification:'sensitive'}),
    Object.freeze({id:7,code:'DEPENDENTS',name:"Dependentes",groupId:'registration',classification:'personal'}),
    Object.freeze({id:8,code:'PPE',name:"Equipamentos de Proteção Individual (EPI)",groupId:'safety',classification:'employment'}),
    Object.freeze({id:9,code:'ATTENDANCE',name:"Jornada e Frequência",groupId:'attendance',classification:'employment'}),
    Object.freeze({id:10,code:'PAYSLIPS',name:"Demonstrativos de Pagamento (Holerites)",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:11,code:'SALARY_RECEIPTS',name:"Comprovantes de Pagamento Salarial",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:12,code:'VACATION',name:"Férias",groupId:'compensation',classification:'employment'}),
    Object.freeze({id:13,code:'THIRTEENTH_SALARY',name:"13º Salário",groupId:'compensation',classification:'financial'}),
    Object.freeze({id:14,code:'TERMINATION',name:"Desligamento e Rescisão Contratual",groupId:'termination',classification:'employment'})
  ];
  const groups=[
    Object.freeze({id:'registration',name:"Cadastro e Identificação",order:1}),
    Object.freeze({id:'employment',name:"Admissão e Vínculo Trabalhista",order:2}),
    Object.freeze({id:'safety',name:"Saúde e Segurança do Trabalho",order:3}),
    Object.freeze({id:'attendance',name:"Jornada e Frequência",order:4}),
    Object.freeze({id:'compensation',name:"Remuneração e Direitos",order:5}),
    Object.freeze({id:'termination',name:"Desligamento e Rescisão",order:6})
  ];
  const byId=id=>catalog.find(item=>item.id===Number(id))||null;
  const categoryName=id=>byId(id)?.name||'';
  function day(value) {
    const s=String(value||''),d=new Date(s+'T12:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw new Error('Informe uma data válida do documento.');
    return s.split('-').reverse().join('-');
  }
  function name(category,person,original,meta) {
    meta=meta||{};category=Number(category);
    const extension=(String(original).match(/\.[^./\\]+$/)||[''])[0];
    const full=String(person||'').trim().replace(/[\\/]/g,' - ');
    if(!full)throw new Error('Nome completo do colaborador não disponível.');
    let prefix='';
    if(category===2)prefix='Comprovante de Residência - '+full;
    if(category===4&&meta.type&&meta.type!=='original'){
      if(!contracts.includes(meta.type))throw new Error('Escolha o tipo do documento de admissão.');
      prefix=meta.type+' - '+full+(meta.date?' - '+day(meta.date):'');
    }
    if(category===5){if(!aso.includes(meta.type))throw new Error('Escolha o tipo do ASO.');prefix='ASO '+meta.type+' - '+full+' - '+day(meta.date);}
    if(category===8)prefix='Ficha de EPI - '+full+' - '+day(meta.date);
    if([10,11].includes(category)){
      if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(meta.month||''))throw new Error('Informe mês e ano de referência.');
      prefix=(category===10?'Holerite':'Comprovante de Pagamento Salarial')+' - '+full+' - '+meta.month.slice(5)+'-'+meta.month.slice(0,4);
    }
    const generated=prefix?prefix+extension:String(original);
    if(meta.alternative){
      const alternative=String(meta.alternative).trim();
      if(/[\\/]/.test(alternative)||!alternative||alternative.length>240||extension&&!alternative.endsWith(extension))throw new Error('O nome alternativo deve preservar a extensão '+extension+'.');
      return alternative;
    }
    if(generated.length>240)throw new Error('Nome final muito longo. Escolha um nome alternativo preservando a extensão.');
    return generated;
  }
  return {name,day,contracts,aso,catalog,groups,byId,categoryName};
}
var VeloXDocuments = createDocumentRules_();

window.VXDocuments=createDocumentRules_();

// Fonte: management-core.js
/** Gestão empresarial: regras puras, estados e alertas reutilizáveis, sem vencimentos legais presumidos. */
function createManagementRules_(){
 const accounting=['FGTS','DARF','DCTFWeb','Contribuição Assistencial','Extratos Mensais','Recibos de Pró-labore','Recibos de Pagamentos','Empréstimo Consignado','Benefício Amparo Familiar'];
 const receipt=['Pendente','Parcial','Recebido','Não se aplica'],payment=['Pendente','Pago','Não se aplica'],periods=['Única','Mensal','Trimestral','Semestral','Anual','Outra'];
 function date(value){const s=String(value||'');if(!s)return '';const d=new Date(s+'T12:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s||+s.slice(0,4)<1900||+s.slice(0,4)>2100)throw new Error('Informe uma data válida.');return s;}
 function text(value,max=240){const s=String(value??'').trim();if(s.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))throw new Error('Texto inválido ou muito longo.');return s;}
 function money(value){if(value===''||value==null)return null;const raw=String(value).replace(',','.');if(!/^\d{1,10}(\.\d{1,2})?$/.test(raw))throw new Error('Informe o valor em reais, sem separador de milhar.');return Math.round(Number(raw)*100);}
 function days(from,to){return Math.round((Date.parse(to+'T12:00:00Z')-Date.parse(from+'T12:00:00Z'))/86400000);}
 function plus(value,amount){const d=new Date(date(value)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+amount);return d.toISOString().slice(0,10);}
 function obligation(p,old={}){const r={...old,area:text(p.area??old.area??'Contabilidade',60),categoria:text(p.categoria??old.categoria??'',100),descricao:text(p.descricao??old.descricao,300),competencia:text(p.competencia??old.competencia,40),valorCentavos:p.valor===undefined?old.valorCentavos??null:money(p.valor),emissao:date(p.emissao??old.emissao),vencimento:date(p.vencimento??old.vencimento),periodicidade:text(p.periodicidade??old.periodicidade??'Única',40),recebimento:text(p.recebimento??old.recebimento??'Pendente',40),pagamento:text(p.pagamento??old.pagamento??'Pendente',40),contratoId:text(p.contratoId??old.contratoId,100),observacoes:text(p.observacoes??old.observacoes,2000)};if(!r.categoria||r.descricao.length<3)throw new Error('Informe categoria e descrição.');if(!receipt.includes(r.recebimento)||!payment.includes(r.pagamento)||!periods.includes(r.periodicidade))throw new Error('Confira recebimento, pagamento e periodicidade.');if(r.emissao&&r.vencimento&&r.vencimento<r.emissao)throw new Error('O vencimento não pode anteceder a emissão.');return r;}
 function contract(p,old={}){const r={...old,contratante:text(p.contratante??old.contratante,180),numero:text(p.numero??old.numero,80),objeto:text(p.objeto??old.objeto,2000),valorCentavos:p.valor===undefined?old.valorCentavos??null:money(p.valor),inicio:date(p.inicio??old.inicio),fim:date(p.fim??old.fim),situacao:text(p.situacao??old.situacao??'Em conferência',40),avisoDias:Number(p.avisoDias??old.avisoDias??30),renovacao:date(p.renovacao??old.renovacao),observacoes:text(p.observacoes??old.observacoes,2000)};if(!r.contratante||!r.numero)throw new Error('Informe contratante e número do contrato.');if(r.inicio&&r.fim&&r.fim<r.inicio)throw new Error('A data final deve ser posterior à inicial.');if(!['Em conferência','Vigente','Encerrado','Suspenso','Em renovação'].includes(r.situacao)||!Number.isInteger(r.avisoDias)||r.avisoDias<0||r.avisoDias>365)throw new Error('Confira situação e antecedência.');return r;}
 function status(r,today,lead=7){if(r.resolvidoEm)return 'Concluído';if(!r.vencimento)return 'Não se aplica';const d=days(today,r.vencimento);return d<0?'Vencido':d<=lead?'Próximo do vencimento':'Pendente';}
 function experience(p){const w=p.trabalho||{};if(!Number(w.experienciaDias)&&!w.experienciaFim)return '';if(w.experienciaFim)return date(w.experienciaFim);if(!w.admissao)return '';return plus(w.admissao,Number(w.experienciaDias)+Number(w.prorrogacaoDias||0)-1);}
 function alerts(data,today,preferences={}){const lead=Number(preferences.antecedenciaDias??7),rows=[];for(const o of data.obrigacoes||[]){if(o.resolvidoEm||!o.vencimento)continue;rows.push({id:'obrigacao:'+o.id,tipo:'obrigacao',registroId:o.id,categoria:o.categoria,titulo:o.descricao,data:o.vencimento,dias:days(today,o.vencimento),situacao:status(o,today,lead),area:o.area});}for(const c of data.contratos||[]){if(['Encerrado','Suspenso'].includes(c.situacao))continue;for(const [key,label] of [['fim','Fim de vigência'],['renovacao','Conferir renovação']])if(c[key])rows.push({id:'contrato:'+c.id+':'+key,tipo:'contrato',registroId:c.id,categoria:'Contratos',evento:key,titulo:label+' — '+c.numero+' · '+c.contratante,data:c[key],dias:days(today,c[key]),situacao:days(today,c[key])<0?'Vencido':'Pendente',antecedencia:c.avisoDias,area:'Contratos'});}for(const p of data.pessoas||[]){if(['desligado','demitido'].includes(String(p.situacao||'').trim().toLowerCase()))continue;let end;try{end=experience(p);}catch(ignored){continue;}if(end&&!p.trabalho?.experienciaConferidaEm)rows.push({id:'pessoa:'+p.id,tipo:'pessoa',registroId:p.id,categoria:'Experiência',titulo:'Conferir experiência — '+p.nome,data:end,dias:days(today,end),situacao:days(today,end)<0?'Vencido':'Pendente',area:'Colaboradores'});}
 return rows.sort((a,b)=>a.data.localeCompare(b.data)||a.titulo.localeCompare(b.titulo,'pt-BR'));}
 function dashboard(data,today,prefs={}){const rows=alerts(data,today,prefs),obligations=rows.filter(r=>r.tipo==='obrigacao');return {rows,counts:{vencidas:obligations.filter(r=>r.dias<0).length,proximos7:obligations.filter(r=>r.dias>=0&&r.dias<=7).length,proximos30:obligations.filter(r=>r.dias>=0&&r.dias<=30).length,resolvidas:(data.obrigacoes||[]).filter(r=>r.resolvidoEm).length,contratos:rows.filter(r=>r.tipo==='contrato'&&r.evento==='fim'&&r.dias>=0&&r.dias<=(r.antecedencia??30)).length,eventos:rows.filter(r=>r.tipo==='pessoa'&&r.dias<=(prefs.experienciaDias??7)).length}};}
 return {accounting,receipt,payment,periods,date,text,money,days,plus,obligation,contract,status,experience,alerts,dashboard};
}
var VeloXManagement=createManagementRules_();
function executeManagement_(ctx,action,p){
 const R=VeloXManagement,db=ctx.store,now=ctx.now(),types={obligation:'Obrigacoes',contract:'Contratos'},get=(table,id)=>{const r=db.all(table).find(x=>x.id===id);if(!r)throw new Error('Registro não encontrado.');return r;},put=(table,r)=>db.put(table,{...r,versao:(Number(r.versao)||0)+1,atualizadoEm:now}),history=(type,id,action,detail,before=null,after=null)=>put('GestaoHistorico',{id:'hist_'+ctx.uuid(),tipo:type,registroId:id,acao:action,detalhe:R.text(detail,500),antes:before,depois:after,data:now,usuario:ctx.email});
 if(action==='management.bootstrap')return {references:VX_CONFIG.accountingReferences,obrigacoes:db.all('Obrigacoes'),contratos:db.all('Contratos'),preferences:db.all('Preferencias').find(r=>r.id==='alertas')||{antecedenciaDias:7,experienciaDias:7}};
 if(action==='management.get'){const table=types[p.tipo];if(!table)throw new Error('Tipo de registro inválido.');const record=get(table,p.id);return {record,documentos:db.all('GestaoDocumentos').filter(r=>r.registroId===record.id&&r.tipo===p.tipo),historico:db.all('GestaoHistorico').filter(r=>r.registroId===record.id).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,100)};}
 if(action==='obligation.save'||action==='contract.save'){const type=action.split('.')[0],table=types[type],old=p.id?get(table,p.id):null;if(old&&old.versao!==Number(p.versao))throw Object.assign(new Error('O registro foi atualizado. Reabra antes de salvar.'),{code:'CONFLITO'});const value=type==='obligation'?R.obligation(p,old||{}):R.contract(p,old||{});if(value.contratoId)get('Contratos',value.contratoId);if(type==='contract'&&db.all(table).some(r=>r.id!==old?.id&&r.numero.toLocaleLowerCase('pt-BR')===value.numero.toLocaleLowerCase('pt-BR')&&r.contratante.toLocaleLowerCase('pt-BR')===value.contratante.toLocaleLowerCase('pt-BR')))throw new Error('Esse contrato já está cadastrado.');if(old?.resolvidoEm&&(value.pagamento==='Pendente'||['Pendente','Parcial'].includes(value.recebimento)))throw new Error('A obrigação já foi concluída. Preserve as confirmações de recebimento e pagamento.');const record=put(table,{...value,id:old?.id||type+'_'+ctx.uuid(),criadoEm:old?.criadoEm||now,pastaCompetencia:old?.pastaCompetencia??value.competencia??'Sem competência',pastaAno:old?.pastaAno||String(value.competencia||value.inicio||value.vencimento||now).match(/20\d{2}/)?.[0]||now.slice(0,4)});const changed=old?Object.keys(value).filter(k=>JSON.stringify(value[k])!==JSON.stringify(old[k])).map(k=>k+': '+String(old[k]??'não informado')+' → '+String(value[k]??'não informado')).join('; '):'Dados conferidos e salvos pelo operador.';history(type,record.id,old?'Atualização':'Cadastro',(changed||'Dados conferidos sem alteração de campos.').slice(0,500),old,record);return record;}
 if(action==='obligation.resolve'){const old=get('Obrigacoes',p.id);if(p.confirmado!==true)throw new Error('Confirme a resolução da pendência.');if(old.versao!==Number(p.versao))throw Object.assign(new Error('O registro foi atualizado.'),{code:'CONFLITO'});if(old.pagamento==='Pendente'||['Pendente','Parcial'].includes(old.recebimento))throw new Error('Confira separadamente o recebimento e o pagamento antes de concluir.');const note=R.text(p.motivo,500);if(note.length<3)throw new Error('Registre o que foi efetivamente resolvido.');const record=put('Obrigacoes',{...old,resolvidoEm:now,resolucao:note});history('obligation',old.id,'Conclusão',note,old,record);return record;}
 if(action==='preferences.save'){const lead=Number(p.antecedenciaDias),experience=Number(p.experienciaDias);if(![lead,experience].every(v=>Number.isInteger(v)&&v>=0&&v<=365))throw new Error('Informe antecedências de 0 a 365 dias.');const old=db.all('Preferencias').find(r=>r.id==='alertas');return put('Preferencias',{...old,id:'alertas',antecedenciaDias:lead,experienciaDias:experience});}
 if(action==='management.upload'||action==='management.link'){const table=types[p.tipo];if(!table)throw new Error('Tipo inválido.');const record=get(table,p.registroId),kind=R.text(p.documentoTipo||'Complementar',80),id='mgdoc_'+ctx.uuid();let file;if(action==='management.link'){file=ctx.storage.managementReference(R.text(p.fileId,100));}else{if(typeof p.base64!=='string'||!p.base64.length||p.base64.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(p.base64))throw new Error('Arquivo acima de 20 MB.');const name=R.text(p.nome,240);if(!name||/[\\/]/.test(name))throw new Error('Nome de arquivo inválido.');file=ctx.storage.managementUpload(p.tipo,record,id,name,R.text(p.mime,150),p.base64);}
 const existing=db.all('GestaoDocumentos').find(d=>d.tipo===p.tipo&&d.registroId===record.id&&d.storageObjectId===file.id);if(existing)return existing;const doc=put('GestaoDocumentos',{id,tipo:p.tipo,registroId:record.id,documentoTipo:kind,storageObjectId:file.id,nome:file.nome,url:file.url,mime:file.mime||p.mime,tamanho:file.size,enviadoEm:now,referencia:action==='management.link'});history(p.tipo,record.id,action==='management.link'?'Referência de documento':'Envio de documento',kind+' · '+file.nome);return doc;}
 throw new Error('Operação de gestão não reconhecida.');
}

// Fonte: core.js
/** Colaboradores, cadastros auxiliares e documentos em pastas lógicas do VeloX. */
/** Cadastro único: dados e jornadas do ponto pertencem ao vínculo da pessoa. */
window.VXEnrollment=(function(){'use strict';
const days=['dom','seg','ter','qua','qui','sex','sab'];
const invalid=message=>{throw Object.assign(new Error(message),{code:'VALIDACAO'});};
function phone(value){const raw=String(value||'').trim();if(!raw)return '';if(!/^[+\d\s().-]+$/.test(raw))invalid('Confira o WhatsApp: use DDD e número.');let n=raw.replace(/\D/g,'');if(n.length===10||n.length===11)n='55'+n;if(!/^55[1-9]\d{9,10}$/.test(n))invalid('Confira o WhatsApp: use DDI 55, DDD e número.');return n;}
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||'')&&!isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;}
function config(input,previous={},admission,status,people=[],id){
if(input===undefined)input={};
if(!input||typeof input!=='object'||Array.isArray(input))invalid('Configuração de ponto inválida.');
const v={...previous,...input},out={habilitado:v.habilitado===undefined?false:v.habilitado,whatsapp:phone(v.whatsapp),vigencia:String(v.vigencia||'')};
if(typeof out.habilitado!=='boolean')invalid('Confira a habilitação do ponto.');
for(const day of days){const value=v[day];if(value===undefined||value===null||value===''){out[day]=null;continue;}const n=Number(value);if(typeof value==='boolean'||!Number.isInteger(n)||n<0||n>1440)invalid('Informe a jornada em minutos inteiros de 0 a 1440.');out[day]=n;}
if(out.vigencia&&!validDate(out.vigencia))invalid('Confira a data de vigência da jornada.');
if(out.habilitado){if(status==='Desligado')invalid('O vínculo desligado não pode habilitar o ponto.');if(!out.whatsapp||!validDate(admission))invalid('Para habilitar o ponto, informe WhatsApp e admissão válidos.');if(!out.vigencia||out.vigencia<admission)invalid('A vigência da jornada deve começar na admissão ou depois dela.');if(days.some(d=>out[d]===null))invalid('Preencha os sete dias da jornada. Use 0 nas folgas.');if(people.some(p=>p.id!==id&&p.situacao!=='Desligado'&&p.ponto?.habilitado&&phone(p.ponto.whatsapp)===out.whatsapp))invalid('Este WhatsApp já está habilitado para outro colaborador.');}
return out;}
const headers=['nome','matricula','whatsapp','admissao','unidade','ponto','vigencia','seg','ter','qua','qui','sex','sab','dom'];
function parseCSV(value,costs){
let source=String(value||'').replace(/^\ufeff/,'');if(!source.trim()||source.length>200000)invalid('Selecione um CSV de até 200 KB.');
const first=source.split(/\r?\n/,1)[0],delimiter=first.includes(';')?';':',';let rows=[],row=[],cell='',quoted=false,closed=false;
for(let i=0;i<source.length;i++){const c=source[i];if(quoted){if(c==='"'){if(source[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}if(c==='"'){if(cell||closed)invalid('Aspas inválidas no CSV.');quoted=true;continue;}if(c===delimiter){row.push(cell);cell='';closed=false;}else if(c==='\n'||c==='\r'){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';closed=false;}else{if(closed&&!/\s/.test(c))invalid('Texto fora das aspas no CSV.');if(!closed)cell+=c;}}
if(quoted)invalid('Feche as aspas do CSV.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
const head=rows.shift()?.map(x=>x.trim().toLowerCase());if(!head||head.length!==headers.length||head.some((h,i)=>h!==headers[i]))invalid('Use o cabeçalho do modelo CSV, sem alterar as colunas.');if(!rows.length||rows.length>100)invalid('Importe de 1 a 100 colaboradores por arquivo.');
return rows.map((cells,index)=>{try{if(cells.length!==headers.length)invalid('Quantidade de colunas diferente do modelo.');const v=Object.fromEntries(headers.map((h,i)=>[h,cells[i].trim()]));if(v.nome.length<3||v.nome.length>160)invalid('Informe o nome completo.');if(!v.matricula||v.matricula.length>40)invalid('A matrícula é obrigatória na importação (até 40 caracteres).');if(!validDate(v.admissao))invalid('Use admissão no formato AAAA-MM-DD.');const cost=costs.filter(c=>c.ativo!==false&&(c.id===v.unidade||c.codigo&&c.codigo.toLowerCase()===v.unidade.toLowerCase()||c.nome.toLowerCase()===v.unidade.toLowerCase()));if(cost.length!==1)invalid('Unidade não encontrada ou ambígua. Use um código de unidade existente.');if(!['sim','nao','não'].includes(v.ponto.toLowerCase()))invalid('Na coluna ponto, informe sim ou nao.');const point={habilitado:v.ponto.toLowerCase()==='sim',whatsapp:v.whatsapp,vigencia:v.vigencia};for(const d of days)point[d]=v[d];return {nome:v.nome,matricula:v.matricula,centroCustoId:cost[0].id,trabalho:{admissao:v.admissao},ponto:config(point,{},v.admissao,'Ativo')};}catch(e){invalid('Linha '+(index+2)+': '+e.message);}});}
return Object.freeze({days,phone,config,parseCSV,headers});
})();

var VeloXCore = (function () {
  'use strict';
  const catalogs = {centroCusto:'CentrosCusto', equipe:'Equipes', cargo:'Cargos'};
  const allowed = ['bootstrap','search.global','audit.list','people.list','person.get','person.open','people.import','person.save','person.transfer','person.terminate','catalog.save','folder.list','folder.create','document.upload','document.download','photo.get','site.save','site.delete','site.logo','management.bootstrap','management.get','obligation.save','obligation.resolve','contract.save','management.upload','management.link','preferences.save','workspace.list','workspace.schema','workspace.get','workspace.regularity','workspace.summary','workspace.cash','workspace.documents','workspace.save','workspace.archive','workspace.restore','workspace.followup','workspace.advance','workspace.pipeline','company.list','company.save','company.select'];
  const enterpriseModules = Object.freeze(["recruitment", "admissions", "hours", "vacations", "benefits", "training", "service", "suppliers", "projects", "payments", "purchases", "clients", "crm", "products", "proposals", "orders", "marketing", "support", "strategy", "scenarios", "payroll", "sst", "posts", "measurements", "quality", "billing", "budgets", "accounting", "quotes", "inventory", "assets", "maintenance", "fleet", "tax", "compliance", "certificates", "notices", "licenses", "radar", "legal", "regularization", "risk", "audits", "policies", "privacy", "approvals", "tasks", "automations", "onboarding", "procurement", "requests", "delivery", "collections", "estimates", "expenses", "tickets", "warehouse", "quality-control"]);
const enterpriseStatuses = Object.freeze(["Rascunho","Pendente","Em andamento","Em análise","Aguardando aprovação","Aguardando terceiros","Bloqueado","Concluído","Cancelado","Ativo","Inativo","A verificar","Regularização pendente","Validado","Pago","Recebido"]);
const enterprisePriorities = Object.freeze(["Baixa","Normal","Alta","Crítica"]);
  // Metadados de formulários por domínio: nunca confundir lançamento interno com serviço oficial.
  const workspaceFieldSpecs = Object.freeze({
    clients:[['documento','CPF/CNPJ ou identificação fiscal','text',32],['email','E-mail principal','email',160],['telefone','Telefone','text',32],['localidade','Cidade / região','text',120]],
    suppliers:[['documento','Documento de identificação','text',32],['email','E-mail comercial','email',160],['telefone','Telefone','text',32],['qualificacao','Situação de qualificação','enum',['Não verificada','Em análise','Qualificado','Restrito']]],
    crm:[['etapa','Etapa da oportunidade','enum',['Prospecção','Qualificação','Proposta','Negociação','Ganha','Perdida']],['probabilidade','Probabilidade estimada (%)','integer',100],['proximoContato','Próximo contato','date',10],['cliente','Cliente ou empresa','text',160]],
    proposals:[['cliente','Cliente','text',160],['validade','Validade da proposta','date',10],['numeroProposta','Número da proposta','text',80],['condicoes','Condições comerciais','text',400]],
    orders:[['cliente','Cliente','text',160],['numeroPedido','Número do pedido','text',80],['previsaoEntrega','Previsão de entrega','date',10],['situacaoEntrega','Situação da entrega','enum',['A programar','Em separação','Em transporte','Entregue','Devolvido']]],
    products:[['codigo','SKU ou código interno','text',100],['unidade','Unidade de medida','text',30],['precoReferencia','Preço de referência (R$)','money',9999999999],['tipoItem','Tipo de item','enum',['Produto','Serviço','Insumo']]],
    payments:[['competencia','Competência (AAAA-MM)','month',7],['dataLiquidacao','Data de liquidação informada','date',10],['comprovanteRef','Referência do comprovante','text',240],['parte','Pagador ou beneficiário','text',160],['centroCusto','Centro de custo ou contrato','text',160]],
    billing:[['cliente','Cliente faturado','text',160],['numeroFatura','Número da fatura interna','text',100],['competencia','Competência (AAAA-MM)','month',7],['referenciaFiscal','Referência fiscal (se emitida oficialmente)','text',120]],
    budgets:[['competencia','Período de referência (AAAA-MM)','month',7],['centroCusto','Centro de custo','text',140],['orcamentoPrevisto','Orçamento planejado (R$)','money',9999999999]],
    accounting:[['competencia','Competência (AAAA-MM)','month',7],['contaContabil','Conta contábil','text',120],['natureza','Natureza','enum',['Débito','Crédito','Conciliação','Ajuste']],['documentoRef','Documento de referência','text',140]],
    projects:[['cliente','Cliente','text',140],['percentual','Progresso informado (%)','integer',100],['marco','Próximo marco','text',160]],
    service:[['solicitante','Solicitante','text',140],['localExecucao','Local de execução','text',160],['evidencia','Referência da evidência','text',180]],
    inventory:[['sku','Código do item','text',100],['localEstoque','Depósito','text',120],['quantidade','Quantidade','integer',1000000000],['tipoMovimento','Tipo de movimentação','enum',['Entrada','Saída','Transferência','Ajuste','Inventário']]],
    assets:[['patrimonio','Número patrimonial','text',100],['localizacao','Localização','text',160],['serie','Número de série','text',120]],
    fleet:[['placa','Identificação do veículo','text',30],['quilometragem','Quilometragem informada','integer',100000000],['proximaRevisao','Data da próxima revisão','date',10]],
    recruitment:[['vaga','Vaga','text',160],['etapa','Etapa de seleção','enum',['Inscrição','Triagem','Entrevista','Avaliação','Proposta','Contratado','Não selecionado']],['candidato','Candidato','text',160]],
    admissions:[['previsao','Data prevista de admissão','date',10],['documentacao','Documentação','enum',['Não solicitada','Solicitada','Parcial','Conferida']],['aso','ASO admissional','enum',['Não verificado','Pendente','Apresentado','Conferido']]],
    vacations:[['inicioAusencia','Início da ausência','date',10],['fimAusencia','Fim da ausência','date',10],['tipoAusencia','Tipo de afastamento','enum',['Férias','Licença','Atestado','Outra ausência']]],
    payroll:[['competencia','Competência (AAAA-MM)','month',7],['rubrica','Rubrica ou evento','text',120],['evidencia','Referência da conferência','text',240]],
    sst:[['tipoExame','Exame ou atividade','text',120],['validade','Validade do documento','date',10],['evidencia','Referência da evidência','text',200]],
    tax:[['tributo','Tributo ou declaração','text',120],['competencia','Competência (AAAA-MM)','month',7],['jurisdicao','Jurisdição','text',120],['protocolo','Protocolo ou recibo','text',140]],
    compliance:[['orgao','Órgão responsável','text',160],['competencia','Competência (AAAA-MM)','month',7],['protocolo','Protocolo de entrega','text',140],['evidenciaUrl','Link da evidência oficial','url',400]],
    certificates:[['orgao','Órgão emissor','text',160],['dataConsulta','Data da consulta oficial feita pelo operador','date',10],['validade','Validade registrada','date',10],['situacaoComprovada','Situação documental informada','enum',['Não consultada','Em análise','Regular (conferência manual)','Irregular (conferência manual)']],['evidenciaUrl','Endereço HTTPS da certidão/evidência oficial','url',400]],
    notices:[['canal','Canal oficial','enum',['DET','DTE','e-CAC','Portal municipal','Portal estadual','Outro']],['dataCiencia','Data da ciência','date',10],['protocolo','Número do protocolo','text',120],['evidenciaUrl','Link da comunicação oficial','url',400]],
    licenses:[['orgao','Órgão emissor','text',160],['numeroLicenca','Número da licença','text',120],['validade','Validade registrada','date',10],['evidenciaUrl','Link da licença','url',400]],
    radar:[['jurisdicao','País / estado / município','text',160],['publicadoEm','Data de publicação','date',10],['vigenciaEm','Início da vigência','date',10],['evidenciaUrl','Fonte oficial HTTPS','url',400],['impacto','Impacto identificado','text',400]],
    regularization:[['pendencia','Pendência identificada','text',240],['orgao','Órgão / entidade','text',140],['evidenciaUrl','Link da comprovação','url',400]],
    legal:[['numeroProcesso','Número do processo / expediente','text',120],['orgao','Órgão / tribunal','text',160],['proximoAto','Próximo ato','text',240]],
    risk:[['probabilidade','Probabilidade qualitativa','enum',['Baixa','Média','Alta']],['impacto','Impacto qualitativo','enum',['Baixo','Médio','Alto','Crítico']],['plano','Ação de tratamento','text',400]],
    approvals:[['solicitante','Solicitante','text',160],['aprovador','Aprovador designado','text',160],['decisao','Decisão registrada','enum',['Não decidida','Aprovada','Rejeitada','Devolvida']]],
    tasks:[['area','Área / equipe','text',120],['entrega','Resultado esperado','text',240]],
    strategy:[['indicador','Indicador da meta','text',160],['valorMeta','Valor de meta informada','text',100],['responsavelMeta','Gestor responsável','text',140]],
  });
  const writes = ['people.import','person.save','person.transfer','person.terminate','catalog.save','folder.create','document.upload','site.save','site.delete','obligation.save','obligation.resolve','contract.save','management.upload','management.link','preferences.save','workspace.save','workspace.archive','workspace.restore','workspace.followup','workspace.advance','company.save','company.select'];
  function situation(value) {
    const key=String(value||'Ativo').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return ({ativo:'Ativo',afastado:'Afastado',desligado:'Desligado',demitido:'Desligado'})[key]||String(value).trim();
  }
  function fail(code,message) { const e=new Error(message); e.code=code; throw e; }
  function text(value,max) {
    const s=String(value==null?'':value).trim();
    if(s.length>(max||200)||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s)) fail('VALIDACAO','Texto inválido ou muito longo.');
    return s;
  }
  function normalized(s) { return String(s||'').trim().toLocaleLowerCase('pt-BR'); }
  function cpf(value) {
    const s=String(value||'').replace(/\D/g,'');
    if(!/^\d{11}$/.test(s)||/^(\d)\1{10}$/.test(s)) return false;
    for(let size=9;size<11;size++) { let sum=0; for(let i=0;i<size;i++) sum+=Number(s[i])*(size+1-i); let digit=(sum*10)%11; if(digit===10) digit=0; if(digit!==Number(s[size])) return false; }
    return true;
  }
  function identifier(value,label) {
    const raw=text(value,20), digits=raw.replace(/\D/g,'');
    if(raw&&!cpf(digits)) fail('VALIDACAO',(label||'CPF')+' inválido. Corrija ou deixe o campo vazio.');
    return digits;
  }
  function date(value,label) {
    const s=text(value,10); if(!s) return '';
    const d=new Date(s+'T12:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number(s.slice(0,4))<1900||Number(s.slice(0,4))>2100||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s) fail('VALIDACAO','Confira a data de '+label+'.');
    return s;
  }
  function boolean(value) { if(typeof value!=='boolean') fail('VALIDACAO','Opção inválida.'); return value; }
  function folderName(value) { const s=text(value,160); if(!s||s==='.'||s==='..'||/[\\/]/.test(s)) fail('VALIDACAO','Informe um nome de pasta sem barras.'); return s; }
  function object(value) { if(!value||typeof value!=='object'||Array.isArray(value)) fail('VALIDACAO','Dados do cadastro inválidos.'); return value; }
  function block(payload,old,key,spec) {
    const result=Object.assign({},old&&old[key]||{}); if(payload[key]===undefined) return result;
    const input=object(payload[key]);
    Object.keys(spec).forEach(name=>{if(Object.prototype.hasOwnProperty.call(input,name)) { const kind=spec[name]; result[name]=kind===true?boolean(input[name]):typeof kind==='string'?date(input[name],kind):text(input[name],kind); }});
    return result;
  }
  function execute(ctx,action,p) {
    if(!allowed.includes(action)) fail('ACAO_INVALIDA','Operação não reconhecida.');
    p=p||{}; const db=ctx.store, now=ctx.now();
    // Perfil atribuído SOMENTE pela camada autenticada (ou pelo adaptador de demonstração).
    // Não aceitar 'role', 'companyId' nem 'email' enviados no payload como autoridade.
    const role=String(ctx.role||'');
    if(!['owner','manager','operator','viewer'].includes(role))fail('PERMISSAO','Sessão sem perfil autorizado.');
    const primaryCompanyId='company-primary';
    // As empresas permitidas vêm do vínculo de autenticação servidor, nunca do payload.
    const membershipScoped=role!=='owner'&&Array.isArray(ctx.allowedCompanyIds);
    const permittedCompanies=membershipScoped?[...new Set(ctx.allowedCompanyIds.filter(id=>typeof id==='string'&&/^(?:company-primary|company_[\w-]{1,100})$/.test(id)))]:null;
    if(membershipScoped&&!permittedCompanies.length)fail('PERMISSAO','Conta sem empresa autorizada.');
    const selected=db.all('CompanySelections').find(r=>r.id===ctx.email);
    const companyId=selected?.companyId||(membershipScoped?permittedCompanies[0]:primaryCompanyId);
    if(membershipScoped&&!permittedCompanies.includes(companyId))fail('PERMISSAO','Acesso à empresa selecionada não autorizado.');
    const isSecondary=companyId!==primaryCompanyId;
    const companies=db.all('Companies');
    if(isSecondary&&!companies.some(r=>r.id===companyId&&r.ativo!==false))fail('PERMISSAO','Empresa selecionada indisponível.');
    const restrictedModules=new Set(['payments','billing','budgets','accounting','payroll','sst','tax','compliance','certificates','notices','licenses','legal','privacy']);
    const canReadEnterprise=r=>role==='owner'||role==='manager'||!restrictedModules.has(r.module);
    const canWriteEnterprise=()=>role==='owner'||role==='manager'||role==='operator';
    if(role==='operator'&&action.startsWith('workspace.')&&writes.includes(action)&&['payments','billing','accounting','payroll','sst','tax','certificates','legal','privacy'].includes(String(p.module||'')))fail('PERMISSAO','Registro sensível exige gestor ou proprietário.');
    if(role==='viewer'&&writes.includes(action)&&!(membershipScoped&&action==='company.select'))fail('PERMISSAO','Perfil de consulta não pode modificar registros.');
    if(role!=='owner'&&action.startsWith('company.')&&(!membershipScoped||action==='company.save'))fail('PERMISSAO','Somente a conta proprietária administra empresas.');
    if(role!=='owner'&&action!=='bootstrap'&&action!=='search.global'&&action!=='audit.list'&&!action.startsWith('workspace.')&&!(membershipScoped&&['company.list','company.select'].includes(action)))
      fail('PERMISSAO','Acesso a cadastros legados exige perfil proprietário nesta fase.');
    if(isSecondary&&!['bootstrap','search.global','audit.list'].includes(action)&&!action.startsWith('workspace.')&&!action.startsWith('company.'))
      fail('ESCOPO_EMPRESA','Este cadastro legado pertence à empresa principal; utilize os módulos empresariais desta empresa.');
    if(action.startsWith('workspace.')&&['workspace.cash','workspace.documents'].includes(action)&&role!=='owner'&&role!=='manager')
      fail('PERMISSAO','Informações sensíveis indisponíveis para este perfil.');
    if(action.startsWith('workspace.')&&['workspace.save','workspace.archive','workspace.restore','workspace.advance','workspace.followup'].includes(action)&&!canWriteEnterprise())
      fail('PERMISSAO','Perfil sem permissão para alterar registros empresariais.');

    const put=(table,record)=>db.put(table,Object.assign({},record,{versao:(Number(record.versao)||0)+1,atualizadoEm:now}));
    const getPerson=id=>{const r=db.all('Pessoas').find(x=>x.id===id); if(!r) fail('NAO_ENCONTRADO','Colaborador não encontrado.'); return r;};
    const listCatalog=type=>db.all(catalogs[type]).slice().sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
    function reference(type,id,old) {
      const table=catalogs[type], field=type+'Id', previous=old&&old[field];
      let target=text(id,100);
      // Compatibilidade com cadastros antigos: apenas nomes que já existem no catálogo.
      if(!target&&p[type]) target=(db.all(table).find(x=>normalized(x.nome)===normalized(p[type]))||{}).id||'';
      if(!target&&old&&p[field]===undefined&&p[type]===undefined) target=previous||'';
      if(!target) { if(type==='centroCusto') fail('VALIDACAO','Escolha um centro de custo cadastrado.'); return null; }
      const r=db.all(table).find(x=>x.id===target);
      if(!r||(r.ativo===false&&target!==previous)) fail('VALIDACAO','Escolha um '+(type==='centroCusto'?'centro de custo':type)+' ativo e cadastrado.');
      return r;
    }
    let indexedPeople=null,indexedFolders=null,indexedCatalogs=null;
    function personView(r) {
      if(!indexedPeople){indexedPeople=new Map();for(const p of db.all('Pessoas')){const key=String(p.cpf||'').replace(/\D/g,'');if(key){const group=indexedPeople.get(key)||[];group.push(p);indexedPeople.set(key,group);}}indexedFolders=new Map();for(const f of db.all('Pastas')){const list=indexedFolders.get(f.pessoaId)||[];list.push(f);indexedFolders.set(f.pessoaId,list);}indexedCatalogs=Object.fromEntries(Object.entries(catalogs).map(([key,table])=>[key,new Map(db.all(table).map(r=>[r.id,r]))]));}
      const view=Object.assign({},r);
      Object.keys(catalogs).forEach(type=>{const item=indexedCatalogs[type].get(r[type+'Id']); if(item) view[type]=item.nome;});
      view.situacao=situation(r.situacao);
      const manager=r.gestorId?db.all('Pessoas').find(item=>item.id===r.gestorId):null;
      view.gestorNome=manager?.nome||'';
      view.pastasCategorias=(indexedFolders.get(r.id)||[]).filter(x=>x.categoria).map(x=>({categoria:x.categoria,id:x.storageObjectId,nome:VeloXDocuments.categoryName(x.categoria)||x.nome}));
      view.historicoVinculos=r.cpf?(indexedPeople.get(String(r.cpf).replace(/\D/g,''))||[]).filter(x=>x.id!==r.id).map(x=>({id:x.id,nome:x.nome,situacao:situation(x.situacao),admissao:x.trabalho?.admissao||'',desligamento:x.trabalho?.desligamento||''})):[];
      return view;
    }
    function validHistoryDate(value){const d=new Date(String(value)+'T12:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(String(value))&&Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
    const listSites=()=>db.all('SitesExternos').slice().sort((a,b)=>(Number(a.ordem)||0)-(Number(b.ordem)||0));
    const sorted=()=>db.all('Pessoas').map(personView).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));

    const auditTechnicalFields=new Set(['id','versao','chaveOperacao','confirmado','base64','mime','nomeOriginal','fileId','pastaId','pastaUrl','fotoId','fotoUrl','criadoEm','atualizadoEm','vinculoAnteriorId','tipo','pessoaId','registroId']);
    function auditTable(action,p){
      if(action==='person.save'||action==='person.transfer'||action==='person.terminate')return 'Pessoas';
      if(action==='catalog.save')return catalogs[p.tipo]||'';
      if(action==='site.save'||action==='site.delete')return 'SitesExternos';
      if(action==='obligation.save'||action==='obligation.resolve')return 'Obrigacoes';
      if(action==='contract.save')return 'Contratos';
      if(action==='preferences.save')return 'Preferencias';
      if(action.startsWith('workspace.'))return 'EnterpriseRecords';
      if(action==='company.save')return 'Companies';
      return '';
    }
    function auditDescriptor(action,p,before){
      const catalogName={centroCusto:'Centro de custo',equipe:'Equipe',cargo:'Cargo'}[p.tipo]||'Cadastro auxiliar';
      const updated=!!before;
      const map={
        'person.save':{area:'Gestão de Pessoas',tipoRegistro:'Colaborador',evento:updated?'Atualização':'Cadastro'},
        'person.transfer':{area:'Pessoas & Talentos',tipoRegistro:'Pessoa',evento:'Movimentação organizacional'},
        'person.terminate':{area:'Pessoas & Talentos',tipoRegistro:'Pessoa',evento:'Encerramento de vínculo'},
        'catalog.save':{area:'Cadastros auxiliares',tipoRegistro:catalogName,evento:updated?'Atualização':'Cadastro'},
        'folder.create':{area:'Documentos',tipoRegistro:'Pasta',evento:'Criação de pasta'},
        'document.upload':{area:'Documentos',tipoRegistro:'Documento',evento:'Envio de documento'},
        'site.save':{area:'Acessos externos',tipoRegistro:'Site externo',evento:updated?'Atualização':'Cadastro'},
        'site.delete':{area:'Acessos externos',tipoRegistro:'Site externo',evento:'Exclusão'},
        'obligation.save':{area:'Gestão de Obrigações',tipoRegistro:'Obrigação',evento:updated?'Atualização':'Cadastro'},
        'obligation.resolve':{area:'Gestão de Obrigações',tipoRegistro:'Obrigação',evento:'Conclusão'},
        'contract.save':{area:'Gestão de Contratos',tipoRegistro:'Contrato',evento:updated?'Atualização':'Cadastro'},
        'management.upload':{area:'Documentos de gestão',tipoRegistro:'Documento',evento:'Envio de documento'},
        'management.link':{area:'Documentos de gestão',tipoRegistro:'Documento',evento:'Vínculo de documento'},
        'preferences.save':{area:'Configurações',tipoRegistro:'Preferências',evento:'Atualização de preferências'},
        'workspace.save':{area:'Módulos empresariais',tipoRegistro:'Registro operacional',evento:updated?'Atualização':'Cadastro'},
        'workspace.archive':{area:'Módulos empresariais',tipoRegistro:'Registro operacional',evento:'Arquivamento'},
        'workspace.restore':{area:'Módulos empresariais',tipoRegistro:'Registro operacional',evento:'Restauração'},
        'workspace.followup':{area:'Plataforma e Automação',tipoRegistro:'Tarefa vinculada',evento:'Criação de acompanhamento'},
        'workspace.advance':{area:'Fluxos entre módulos',tipoRegistro:'Rascunho relacionado',evento:'Criação da próxima etapa'},
        'company.save':{area:'Administração de Empresas',tipoRegistro:'Empresa',evento:updated?'Atualização de empresa':'Cadastro de empresa'},
        'company.select':{area:'Administração de Empresas',tipoRegistro:'Ambiente',evento:'Alteração de empresa selecionada'}
      };
      return map[action]||{area:'Sistema',tipoRegistro:'Registro',evento:'Registro anterior'};
    }
    function auditPayloadFields(value,prefix=''){
      if(!value||typeof value!=='object')return prefix?[prefix]:[];
      if(Array.isArray(value))return prefix?[prefix]:[];
      const keys=Object.keys(value).filter(key=>!auditTechnicalFields.has(key));
      if(!keys.length)return prefix?[prefix]:[];
      return keys.flatMap(key=>auditPayloadFields(value[key],prefix?prefix+'.'+key:key));
    }
    function auditDiffFields(before,after,prefix=''){
      if(!before||!after)return [];
      const keys=new Set([...Object.keys(before),...Object.keys(after)]),changed=[];
      for(const key of keys){
        if(auditTechnicalFields.has(key))continue;
        const a=before[key],b=after[key],path=prefix?prefix+'.'+key:key;
        const plainA=a&&typeof a==='object'&&!Array.isArray(a),plainB=b&&typeof b==='object'&&!Array.isArray(b);
        if(plainA&&plainB)changed.push(...auditDiffFields(a,b,path));
        else if(JSON.stringify(a)!==JSON.stringify(b))changed.push(path);
      }
      return changed;
    }
    function auditList(payload){
      const query=text(payload.query,100).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
      const from=payload.from?date(payload.from,'data inicial'):'';
      const to=payload.to?date(payload.to,'data final'):'';
      if(from&&to&&from>to)fail('VALIDACAO','A data inicial não pode ser posterior à data final.');
      const area=text(payload.area,80),recordId=text(payload.recordId,100);
      const pageRaw=Number(payload.page??1),sizeRaw=Number(payload.pageSize??25);
      const page=Number.isSafeInteger(pageRaw)&&pageRaw>0?pageRaw:1;
      const pageSize=Number.isSafeInteger(sizeRaw)&&sizeRaw>0?Math.min(100,sizeRaw):25;
      const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
      const rows=db.all('Logs').filter(log=>(log.companyId||primaryCompanyId)===companyId&&(!log.resultado||log.resultado==='SUCESSO')).map(log=>{
        const descriptor=auditDescriptor(log.acao||'',{},null);
        const fields=Array.isArray(log.campos)?log.campos.filter(x=>typeof x==='string'&&/^[\p{L}\p{N}_.-]{1,100}$/u.test(x)).slice(0,40):[];
        return {
          id:String(log.id||''),data:String(log.data||''),usuario:String(log.usuario||''),acao:String(log.acao||''),
          evento:String(log.evento||'Registro anterior'),area:String(log.area||descriptor.area||'Sistema'),
          tipoRegistro:String(log.tipoRegistro||descriptor.tipoRegistro||'Registro'),
          registro:String(log.registro||log.referencia||''),referencia:String(log.referencia||''),
          campos:fields,descricao:String(log.descricao||'Registro anterior à auditoria detalhada.')
        };
      }).filter(row=>{
        const day=row.data.slice(0,10);
        if(from&&(!day||day<from))return false;
        if(to&&(!day||day>to))return false;
        if(area&&row.area!==area)return false;
        if(recordId&&row.registro!==recordId&&row.referencia!==recordId)return false;
        if(query){const haystack=normalize([row.usuario,row.acao,row.evento,row.area,row.tipoRegistro,row.registro,row.referencia,row.descricao,...row.campos].join(' '));if(!haystack.includes(query))return false;}
        return true;
      }).sort((a,b)=>String(b.data).localeCompare(String(a.data))||String(b.id).localeCompare(String(a.id)));
      const total=rows.length,totalPages=Math.max(1,Math.ceil(total/pageSize)),currentPage=Math.min(page,totalPages),start=(currentPage-1)*pageSize;
      return {rows:rows.slice(start,start+pageSize),total,page:currentPage,pageSize,totalPages};
    }

    function globalSearch(payload) {
      const query=text(payload.query,80), normalizedQuery=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/\s+/g,' ').trim();
      const digitsQuery=query.replace(/\D/g,''), numericQuery=/^[\d\s./-]+$/.test(query)&&digitsQuery.length>=3;
      const order=['COLABORADORES','CONTRATOS','DOCUMENTOS','OBRIGAÇÕES','EQUIPES','EMPRESARIAL'];
      const buckets=Object.fromEntries(order.map(key=>[key,[]]));
      const perGroup=Math.max(1,Math.min(12,Math.floor(Number(payload.limit)||8)));
      if(normalizedQuery.length<2)return {query,total:0,groups:[],perGroup,truncated:false};
      const normalizeSearch=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/\s+/g,' ').trim();
      const compactSearch=value=>normalizeSearch(value).replace(/[^a-z0-9]/g,'');
      const queryCompact=compactSearch(query);
      function score(fields,numericFields=[]) {
        let best=0;
        for(let i=0;i<fields.length;i++){
          const value=String(fields[i]??'');if(!value)continue;
          const candidate=normalizeSearch(value);
          if(candidate===normalizedQuery)best=Math.max(best,120-i);
          else if(candidate.startsWith(normalizedQuery))best=Math.max(best,95-i);
          else if(candidate.includes(normalizedQuery))best=Math.max(best,75-i);
          else if(queryCompact.length>=2&&compactSearch(value).includes(queryCompact))best=Math.max(best,60-i);
        }
        if(numericQuery)for(const value of numericFields){
          const digits=String(value??'').replace(/\D/g,'');
          if(digits&&digits.includes(digitsQuery))best=Math.max(best,85);
        }
        return best;
      }
      const add=(category,item,rank)=>{if(rank>0)buckets[category].push({...item,_rank:rank});};
      const rawPeople=!isSecondary&&role==='owner'?db.all('Pessoas'):[],peopleById=new Map(rawPeople.map(item=>[item.id,item]));
      const viewsById=new Map(),viewOf=raw=>{if(!raw)return null;if(!viewsById.has(raw.id))viewsById.set(raw.id,personView(raw));return viewsById.get(raw.id);};
      const contracts=!isSecondary&&role==='owner'?db.all('Contratos'):[],contractsById=new Map(contracts.map(item=>[item.id,item]));
      const obligations=!isSecondary&&role==='owner'?db.all('Obrigacoes'):[],obligationsById=new Map(obligations.map(item=>[item.id,item]));
      const preferences=db.all('Preferencias').find(item=>item.id==='alertas')||{antecedenciaDias:7,experienciaDias:7};
      const today=typeof ctx.today==='function'?ctx.today():now.slice(0,10);
      const foldersById=new Map(db.all('Pastas').map(item=>[item.storageObjectId,item]));
      const categoryById=new Map((VeloXDocuments.catalog||[]).map(item=>[Number(item.id),item]));

      for(const raw of rawPeople){
        const person=viewOf(raw),cpfDigits=String(raw.cpf||'').replace(/\D/g,''),phone=person.dadosPessoais?.celular||'';
        const email=person.dadosPessoais?.email||'',work=person.trabalho||{};
        const rank=score([person.nome,person.cargo,person.equipe,person.centroCusto,person.situacao,person.gestorNome,work.admissao,work.desligamento,raw.matricula,raw.unidade,email,phone],[raw.cpf,phone]);
        add('COLABORADORES',{
          kind:'person',id:person.id,title:person.nome||'Colaborador',
          subtitle:[person.cargo,person.equipe,person.centroCusto].filter(Boolean).join(' · '),
          status:person.situacao||'—',cpfMasked:cpfDigits.length===11?'***.***.***-'+cpfDigits.slice(-2):'',
          details:{situacao:person.situacao||'—',matricula:person.matricula||'',cargo:person.cargo||'',equipe:person.equipe||'',centroCusto:person.centroCusto||'',gestor:person.gestorNome||'',admissao:work.admissao||'',cpfMasked:cpfDigits.length===11?'***.***.***-'+cpfDigits.slice(-2):''}
        },rank);
      }

      for(const contract of contracts){
        const rank=score([contract.numero,contract.contratante,contract.objeto,contract.situacao,contract.inicio,contract.fim,contract.renovacao,contract.observacoes]);
        add('CONTRATOS',{
          kind:'contract',id:contract.id,title:'Contrato '+[contract.numero,contract.contratante].filter(Boolean).join(' · '),
          subtitle:contract.objeto||'',status:contract.situacao||'—',
          details:{numero:contract.numero||'',contratante:contract.contratante||'',situacao:contract.situacao||'—',inicio:contract.inicio||'',fim:contract.fim||'',renovacao:contract.renovacao||'',valorCentavos:contract.valorCentavos??null}
        },rank);
      }

      for(const obligation of obligations){
        const linked=contractsById.get(obligation.contratoId),status=VeloXManagement.status(obligation,today,preferences.antecedenciaDias);
        const linkedLabel=linked?['Contrato '+linked.numero,linked.contratante].filter(Boolean).join(' · '):'';
        const rank=score([obligation.descricao,obligation.categoria,obligation.area,obligation.competencia,obligation.vencimento,obligation.recebimento,obligation.pagamento,obligation.observacoes,linked?.numero,linked?.contratante]);
        add('OBRIGAÇÕES',{
          kind:'obligation',id:obligation.id,title:obligation.descricao||'Obrigação',
          subtitle:[obligation.categoria,obligation.competencia,linkedLabel].filter(Boolean).join(' · '),
          status,
          details:{categoria:obligation.categoria||'',area:obligation.area||'',competencia:obligation.competencia||'',vencimento:obligation.vencimento||'',situacao:status,recebimento:obligation.recebimento||'',pagamento:obligation.pagamento||'',contrato:linkedLabel,valorCentavos:obligation.valorCentavos??null}
        },rank);
      }

      for(const document of (!isSecondary&&role==='owner'?db.all('Documentos'):[])){
        if(document.tipo==='fotoPerfil')continue;
        const raw=peopleById.get(document.pessoaId),person=viewOf(raw),folderRecord=foldersById.get(document.pastaId);
        const categoryId=Number(folderRecord?.categoria||0),category=categoryById.get(categoryId);
        const categoryName=category?.name||ctx.categories[categoryId-1]||folderRecord?.nome||'Documento';
        const rank=score([document.nome,person?.nome,categoryName,folderRecord?.nome,document.mime]);
        add('DOCUMENTOS',{
          kind:'document',id:document.id,title:document.nome||'Documento',
          subtitle:[person?.nome,categoryName].filter(Boolean).join(' · '),
          status:category?.classification==='sensitive'?'Sensível':'Documento',
          documentScope:'employee',pessoaId:document.pessoaId,pastaId:document.pastaId,
          details:{arquivo:document.nome||'',colaborador:person?.nome||'',categoria:categoryName,enviadoEm:document.enviadoEm||'',mime:document.mime||'',tamanho:Number(document.tamanho)||0,sensivel:category?.classification==='sensitive'}
        },rank);
      }

      for(const document of (!isSecondary&&role==='owner'?db.all('GestaoDocumentos'):[])){
        const record=document.tipo==='contract'?contractsById.get(document.registroId):obligationsById.get(document.registroId);
        const recordTitle=document.tipo==='contract'
          ?'Contrato '+[record?.numero,record?.contratante].filter(Boolean).join(' · ')
          :record?.descricao||'Obrigação';
        const rank=score([document.nome,document.documentoTipo,recordTitle,record?.numero,record?.contratante,record?.categoria]);
        add('DOCUMENTOS',{
          kind:'document',id:document.id,title:document.nome||'Documento',
          subtitle:[recordTitle,document.documentoTipo].filter(Boolean).join(' · '),
          status:'Documento',documentScope:'management',managementType:document.tipo,registroId:document.registroId,
          details:{arquivo:document.nome||'',registro:recordTitle,tipo:document.documentoTipo||'Complementar',enviadoEm:document.enviadoEm||'',mime:document.mime||'',tamanho:Number(document.tamanho)||0}
        },rank);
      }

      for(const team of (!isSecondary&&role==='owner'?db.all('Equipes'):[])){
        const rank=score([team.nome,team.codigo,team.descricao,team.ativo===false?'Inativo':'Ativo']);
        add('EQUIPES',{
          kind:'team',id:team.id,title:team.nome||'Equipe',
          subtitle:[team.codigo,team.descricao].filter(Boolean).join(' · '),
          status:team.ativo===false?'Inativo':'Ativo',
          details:{codigo:team.codigo||'',descricao:team.descricao||'',situacao:team.ativo===false?'Inativo':'Ativo'}
        },rank);
      }

      // Busca universal de registros internos: nenhuma credencial ou anexo é indexado.
      for(const record of db.all('EnterpriseRecords')){
        if(record.arquivadoEm||(record.companyId||primaryCompanyId)!==companyId||!canReadEnterprise(record))continue;
        const rank=score([record.titulo,record.referencia,record.categoria,record.responsavel,record.descricao,record.status,...Object.values(record.detalhes||{})]);
        add('EMPRESARIAL',{
          kind:'enterprise',id:record.id,module:record.module,title:record.titulo||'Registro empresarial',
          subtitle:[record.module,record.categoria,record.referencia].filter(Boolean).join(' · '),
          status:record.status||'—',
          details:{situacao:record.status||'—',categoria:record.categoria||'',vencimento:record.vencimento||'',valorCentavos:record.valorCentavos??null}
        },rank);
      }

      let total=0,truncated=false;
      const groups=order.map(category=>{
        const rows=buckets[category].sort((a,b)=>b._rank-a._rank||String(a.title).localeCompare(String(b.title),'pt-BR'));
        total+=rows.length;if(rows.length>perGroup)truncated=true;
        return {category,total:rows.length,truncated:rows.length>perGroup,items:rows.slice(0,perGroup).map(({_rank,...item})=>item)};
      }).filter(group=>group.total);
      return {query,total,groups,perGroup,truncated};
    }

    // Empresas são ambientes separados para os novos registros empresariais.
    // Cadastros legados anteriores permanecem EXCLUSIVAMENTE na empresa principal.
    function companyList(){
      const base=companies.find(r=>r.id===primaryCompanyId)||{id:primaryCompanyId,nome:'Empresa principal',ativo:true,versao:0};
      const rows=[base,...companies.filter(r=>r.id!==primaryCompanyId&&r.ativo!==false)]
        .filter(r=>!membershipScoped||permittedCompanies.includes(r.id))
        .sort((a,b)=>a.id===primaryCompanyId?-1:b.id===primaryCompanyId?1:a.nome.localeCompare(b.nome,'pt-BR'));
      return {selectedId:companyId,companies:rows.map(r=>({id:r.id,nome:r.nome,documento:r.documento||'',versao:r.versao||0,ativo:r.ativo!==false,principal:r.id===primaryCompanyId})),role,limitedScope:true,legacyCompanyId:primaryCompanyId};
    }
    function companySave(payload){
      const id=text(payload.id,100),old=id?companies.find(r=>r.id===id):null;
      if(id&&id!==primaryCompanyId&&!old)fail('NAO_ENCONTRADO','Empresa não encontrada.');
      if(old&&old.versao!==Number(payload.versao))fail('CONFLITO','Empresa atualizada em outra sessão. Reabra o cadastro.');
      if(id===primaryCompanyId&&!old&&Number(payload.versao)!==0)fail('CONFLITO','Versão inicial inválida.');
      const nome=text(payload.nome,160),documento=text(payload.documento,32).replace(/[^0-9A-Za-z]/g,'').toUpperCase();
      if(nome.length<3)fail('VALIDACAO','Informe a razão social ou o nome da empresa.');
      if(companies.some(c=>c.id!==id&&(normalized(c.nome)===normalized(nome)||(documento&&c.documento===documento))))
        fail('DUPLICADO','Empresa já cadastrada com esse nome ou documento.');
      if(companies.length>=30&&!old&&id!==primaryCompanyId)fail('LIMITE','Limite inicial de empresas atingido.');
      const record={...old,id:id||'company_'+ctx.uuid(),nome,documento,ativo:true,criadoEm:old?.criadoEm||now,criadoPor:old?.criadoPor||ctx.email};
      return put('Companies',record);
    }
    function companySelect(payload){
      const target=text(payload.id,100);
      if(target!==primaryCompanyId&&!companies.some(r=>r.id===target&&r.ativo!==false))fail('VALIDACAO','Empresa selecionada não existe ou está inativa.');
      if(membershipScoped&&!permittedCompanies.includes(target))fail('PERMISSAO','Acesso à empresa selecionada não autorizado.');
      if(target===companyId)return {selectedId:companyId,changed:false};
      put('CompanySelections',{id:ctx.email,companyId:target,updatedBy:ctx.email});
      return {selectedId:target,changed:true,requiresReload:true};
    }
    // Plataforma empresarial integrada: registros com módulo próprio, auditoria e controle de versão.
    const assertModule=value=>{const module=text(value,60);if(!enterpriseModules.includes(module))fail('VALIDACAO','Módulo empresarial não reconhecido.');if(!canReadEnterprise({module}))fail('PERMISSAO','Módulo indisponível para este perfil.');return module;};
    // Encadeamento controlado: cria SOMENTE rascunhos internos, nunca vendas aceitas,
    // faturamentos fiscais, movimentos de estoque, admissões ou pagamentos reais.
    const workspaceFlowTargets=Object.freeze({
      clients:['crm'],crm:['proposals'],proposals:['orders'],orders:['service','billing'],
      service:['measurements'],measurements:['billing'],billing:['payments'],
      suppliers:['quotes'],quotes:['purchases'],purchases:['inventory'],
      recruitment:['admissions'],admissions:['hours'],
      compliance:['regularization'],regularization:['tasks'],risk:['tasks']
    });
    const workspaceRecords=()=>db.all('EnterpriseRecords').filter(r=>(r.companyId||primaryCompanyId)===companyId&&canReadEnterprise(r));
    const workspaceGet=id=>{const r=workspaceRecords().find(item=>item.id===id);if(!r)fail('NAO_ENCONTRADO','Registro empresarial não encontrado.');return r;};
    function workspaceSchema(payload){
      const module=assertModule(payload.module);
      return {module,fields:(workspaceFieldSpecs[module]||[]).map(([key,label,type,rule])=>({key,label,type,rule}))};
    }
    function workspaceDetails(module,payload,old){
      const input=payload.detalhes;
      if(input===undefined)return old?.detalhes||{};
      if(!input||typeof input!=='object'||Array.isArray(input))fail('VALIDACAO','Confira os campos específicos deste módulo.');
      const schema=workspaceFieldSpecs[module]||[];
      const keys=new Set(schema.map(a=>a[0]));
      if(Object.keys(input).some(k=>!keys.has(k)))fail('VALIDACAO','Este campo não pertence ao módulo selecionado.');
      const details={...(old?.detalhes||{})};
      for(const [key,label,type,rule] of schema){
        if(!Object.prototype.hasOwnProperty.call(input,key))continue;
        const raw=String(input[key]??'').trim();
        if(type==='date'){details[key]=date(raw,label);continue;}
        if(type==='month'){
          if(raw&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(raw))fail('VALIDACAO','Informe uma competência válida (AAAA-MM).');
          details[key]=raw;continue;
        }
        if(type==='enum'){
          if(raw&&!rule.includes(raw))fail('VALIDACAO','Escolha uma opção válida para '+label+'.');
          details[key]=raw;continue;
        }
        if(type==='integer'){
          if(raw&&!/^(?:0|[1-9]\d*)$/.test(raw))fail('VALIDACAO','Informe um número inteiro válido para '+label+'.');
          const n=raw?Number(raw):null;
          if(n!==null&&(!Number.isSafeInteger(n)||n>rule))fail('VALIDACAO','Valor fora do limite para '+label+'.');
          details[key]=n;continue;
        }
        if(type==='money'){
          if(raw&&!/^(?:0|[1-9]\d*)(?:[.,]\d{1,2})?$/.test(raw))fail('VALIDACAO','Informe um valor monetário válido para '+label+'.');
          const n=raw?Number(raw.replace(',','.')):null;
          if(n!==null&&(!Number.isFinite(n)||n>rule))fail('VALIDACAO','Valor fora do limite para '+label+'.');
          details[key]=n===null?null:Math.round(n*100);continue;
        }
        const value=text(raw,Number(rule)||400);
        if(type==='email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))fail('VALIDACAO','Informe um e-mail válido.');
        if(type==='url'&&value&&!/^https:\/\/[a-z0-9][^\s<>"']{2,398}$/i.test(value))fail('VALIDACAO','Use um link HTTPS válido como evidência.');
        details[key]=value;
      }
      return details;
    }
    function workspaceGetDetails(payload){
      const row=workspaceGet(text(payload.id,100));
      const others=workspaceRecords().filter(r=>!r.arquivadoEm&&r.relacionadoId===row.id).map(r=>({id:r.id,module:r.module,titulo:r.titulo,status:r.status}));
      const parent=row.relacionadoId?workspaceRecords().find(r=>r.id===row.relacionadoId):null;
      const events=db.all('Logs').filter(l=>l.registro===row.id).slice(-30).reverse().map(l=>({data:l.data,evento:l.evento,usuario:l.usuario,area:l.area}));
      const next=(workspaceFlowTargets[row.module]||[]).map(module=>({module,alreadyCreated:others.some(r=>r.module===module)}));
      return {record:row,related:others,parent:parent?{id:parent.id,module:parent.module,titulo:parent.titulo,status:parent.status}:null,history:events,next};
    }
    function workspaceAdvance(payload){
      const source=workspaceGet(text(payload.id,100));
      const destination=assertModule(payload.destination);
      if(source.arquivadoEm||['Cancelado','Inativo'].includes(source.status))fail('VALIDACAO','O registro de origem precisa estar ativo para iniciar a próxima etapa.');
      if(Number(payload.versao)!==source.versao)fail('CONFLITO','O registro de origem mudou. Atualize antes de continuar.');
      if(payload.confirmado!==true)fail('CONFIRMACAO','Confirme a criação do rascunho relacionado.');
      if(!(workspaceFlowTargets[source.module]||[]).includes(destination))fail('VALIDACAO','Essa sequência de módulos não está habilitada.');
      if(workspaceRecords().some(r=>r.relacionadoId===source.id&&r.module===destination&&!r.arquivadoEm))fail('DUPLICADO','Já existe uma próxima etapa ativa deste tipo vinculada à origem.');
      const targetLabels={crm:'Oportunidade',proposals:'Proposta',orders:'Pedido',service:'Ordem de serviço',measurements:'Medição',billing:'Faturamento interno',payments:'Cobrança pendente',quotes:'Cotação',purchases:'Compra',inventory:'Movimentação a conferir',admissions:'Admissão a conferir',hours:'Jornada a conferir',regularization:'Regularização',tasks:'Tarefa'};
      const title=(targetLabels[destination]||'Etapa')+' — '+source.titulo;
      const details=destination==='payments'?{parte:text(source.detalhes?.cliente||'',160)}:{};
      const record=put('EnterpriseRecords',{
        id:'ent_'+ctx.uuid(),companyId,module:destination,titulo:title.slice(0,160),status:'Rascunho',
        prioridade:source.prioridade||'Normal',responsavel:source.responsavel||'',
        vencimento:'',inicio:'',fim:'',valorCentavos:['proposals','orders','billing','payments','quotes','purchases'].includes(destination)?source.valorCentavos??null:null,
        categoria:destination==='payments'?'Receita':'Etapa vinculada',fonte:'',referencia:source.referencia||'',
        descricao:'Rascunho interno criado a partir de '+source.titulo+'. Confirme os dados e autorizações antes de executar esta etapa.',
        relacionadoId:source.id,detalhes:details,pessoaId:source.pessoaId||'',contratoId:source.contratoId||'',
        criadoEm:now,criadoPor:ctx.email,atualizadoPor:ctx.email,versao:0
      });
      db.put('Logs',{id:'log_flow_'+ctx.uuid(),versao:1,data:now,usuario:ctx.email,acao:'workspace.advance',evento:'Criação da próxima etapa',area:'Fluxos entre módulos',tipoRegistro:'Rascunho relacionado',registro:record.id,campos:['relacionadoId'],descricao:'Rascunho vinculado à origem: '+source.titulo,resultado:'SUCESSO',referencia:source.id,companyId});
      return {record,origin:{id:source.id,module:source.module,titulo:source.titulo},automaticActionPerformed:false};
    }
    function workspacePipeline(){
      const rows=workspaceRecords().filter(r=>!r.arquivadoEm);
      const paths=[
        {name:'Comercial ao recebimento',modules:['clients','crm','proposals','orders','service','measurements','billing','payments']},
        {name:'Compras e estoque',modules:['suppliers','quotes','purchases','inventory']},
        {name:'Admissão e jornada',modules:['recruitment','admissions','hours']},
        {name:'Conformidade e regularização',modules:['compliance','regularization','tasks']}
      ];
      const stages=paths.map(path=>({name:path.name,stages:path.modules.map(module=>({module,total:rows.filter(r=>r.module===module).length,linked:rows.filter(r=>r.module===module&&r.relacionadoId).length})),total:rows.filter(r=>path.modules.includes(r.module)).length}));
      return {paths:stages,linked:rows.filter(r=>r.relacionadoId).length,total:rows.length,source:'Somente registros internos existentes, sem confirmações de órgãos, bancos ou outros sistemas.'};
    }
    function workspaceFollowup(payload){
      const parent=workspaceGet(text(payload.id,100));
      if(parent.arquivadoEm)fail('VALIDACAO','Não é possível criar acompanhamentos a partir de registro arquivado.');
      const title=text(payload.titulo,160)||'Conferir: '+parent.titulo.slice(0,145);
      if(title.length<3)fail('VALIDACAO','Informe uma tarefa válida.');
      const due=date(payload.vencimento,'prazo da tarefa');
      return put('EnterpriseRecords',{id:'ent_'+ctx.uuid(),companyId,module:'tasks',titulo:title,status:'Pendente',prioridade:parent.prioridade||'Normal',responsavel:text(payload.responsavel||parent.responsavel,140),vencimento:due,inicio:'',fim:'',valorCentavos:null,categoria:'Acompanhamento',fonte:'',referencia:parent.referencia||'',descricao:'Tarefa relacionada a '+parent.titulo,relacionadoId:parent.id,detalhes:{area:parent.module},pessoaId:parent.pessoaId||'',contratoId:parent.contratoId||'',criadoEm:now,criadoPor:ctx.email,atualizadoPor:ctx.email,versao:0});
    }
    function workspaceList(payload){
      const module=assertModule(payload.module),query=text(payload.query,120).toLocaleLowerCase('pt-BR'),status=text(payload.status,50),includeArchived=payload.includeArchived===true;
      const pageNumber=Number(payload.page||1),pageSize=Number(payload.pageSize||25);
      const page=Number.isSafeInteger(pageNumber)&&pageNumber>=1?pageNumber:1;
      const size=Number.isSafeInteger(pageSize)&&pageSize>=1?Math.min(pageSize,100):25;
      const rows=workspaceRecords().filter(r=>r.module===module&&(includeArchived||!r.arquivadoEm)&&(!status||r.status===status)&&(!query||[r.titulo,r.responsavel,r.descricao,r.referencia,r.categoria,r.status,...Object.values(r.detalhes||{})].join(' ').toLocaleLowerCase('pt-BR').includes(query))).sort((a,b)=>String(b.atualizadoEm||b.criadoEm||'').localeCompare(String(a.atualizadoEm||a.criadoEm||'')));
      const total=rows.length;return {module,total,page,size,pages:Math.max(1,Math.ceil(total/size)),items:rows.slice((page-1)*size,page*size)};
    }
    function workspaceSummary(){
      const records=workspaceRecords().filter(r=>!r.arquivadoEm),today=typeof ctx.today==='function'?ctx.today():now.slice(0,10);
      const deadline=r=>{const v=['certificates','licenses','sst'].includes(r.module)?r.detalhes?.validade:'';return [r.vencimento,v].filter(Boolean).sort()[0]||'';};
      const expiredDocument=r=>['certificates','licenses','sst'].includes(r.module)&&r.detalhes?.validade&&r.detalhes.validade<today&&r.status!=='Cancelado';
      const open=records.filter(r=>expiredDocument(r)||!['Concluído','Cancelado','Pago','Recebido','Validado'].includes(r.status));
      const pending=open.filter(r=>deadline(r)&&deadline(r)<today);
      const due=open.filter(r=>deadline(r)&&deadline(r)>=today&&deadline(r)<=(new Date(Date.parse(today+'T12:00:00Z')+7*864e5)).toISOString().slice(0,10));
      const modules=Object.fromEntries(enterpriseModules.map(m=>[m,records.filter(r=>r.module===m).length]));
      const urgent=[...pending,...due].sort((a,b)=>deadline(a).localeCompare(deadline(b))).slice(0,8).map(r=>({id:r.id,module:r.module,titulo:r.titulo,vencimento:deadline(r),responsavel:r.responsavel,status:r.status}));
      return {total:records.length,open:open.length,overdue:pending.length,dueSoon:due.length,modules,urgent,hasData:records.length>0,updatedAt:now};
    }
    function workspaceCash(){
      const items=workspaceRecords().filter(r=>r.module==='payments'&&!r.arquivadoEm);
      const sum=rows=>rows.reduce((n,r)=>n+(Number(r.valorCentavos)||0),0);
      const confirmedIn=items.filter(r=>r.categoria==='Receita'&&r.status==='Recebido');
      const confirmedOut=items.filter(r=>r.categoria==='Despesa'&&r.status==='Pago');
      const pendingIn=items.filter(r=>r.categoria==='Receita'&&!['Recebido','Cancelado'].includes(r.status));
      const pendingOut=items.filter(r=>r.categoria==='Despesa'&&!['Pago','Cancelado'].includes(r.status));
      const base=typeof ctx.today==='function'?ctx.today().slice(0,7):now.slice(0,7),months=[];
      const year=Number(base.slice(0,4)),month=Number(base.slice(5,7));
      for(let offset=5;offset>=0;offset--){const first=new Date(Date.UTC(year,month-1-offset,1));const key=first.toISOString().slice(0,7);months.push({month:key,recebido:sum(confirmedIn.filter(r=>r.detalhes?.dataLiquidacao?.slice(0,7)===key)),pago:sum(confirmedOut.filter(r=>r.detalhes?.dataLiquidacao?.slice(0,7)===key))});}
      return {entries:items.length,confirmedIn:sum(confirmedIn),confirmedOut:sum(confirmedOut),net:sum(confirmedIn)-sum(confirmedOut),pendingIn:sum(pendingIn),pendingOut:sum(pendingOut),months,hasData:items.length>0,source:'Registros internos informados manualmente; nenhum saldo bancário ou liquidação externa foi consultado.'};
    }
    function workspaceDocuments(payload){
      const query=text(payload.query,120).toLocaleLowerCase('pt-BR');
      const pageRaw=Number(payload.page||1),page=Number.isSafeInteger(pageRaw)&&pageRaw>0?pageRaw:1,size=25;
      const people=new Map((isSecondary?[]:db.all('Pessoas')).map(p=>[p.id,p.nome]));
      const contracts=new Map((isSecondary?[]:db.all('Contratos')).map(p=>[p.id,p.numero+' · '+p.contratante]));
      const obligations=new Map((isSecondary?[]:db.all('Obrigacoes')).map(p=>[p.id,p.descricao]));
      const peopleDocuments=(isSecondary?[]:db.all('Documentos')).filter(d=>d.tipo!=='fotoPerfil').map(d=>({id:d.id,nome:d.nome,escopo:'Pessoa',pessoaId:d.pessoaId,registro:people.get(d.pessoaId)||'Registro de pessoa',enviadoEm:d.enviadoEm}));
      const managementDocuments=(isSecondary?[]:db.all('GestaoDocumentos')).map(d=>({id:d.id,nome:d.nome,escopo:d.tipo==='contract'?'Contrato':'Obrigação',tipo:d.tipo,registroId:d.registroId,registro:(d.tipo==='contract'?contracts:obligations).get(d.registroId)||'Registro vinculado',enviadoEm:d.enviadoEm}));
      const rows=[...peopleDocuments,...managementDocuments].filter(d=>!query||[d.nome,d.registro,d.escopo].join(' ').toLocaleLowerCase('pt-BR').includes(query)).sort((a,b)=>String(b.enviadoEm||'').localeCompare(String(a.enviadoEm||'')));
      return {total:rows.length,page,pages:Math.max(1,Math.ceil(rows.length/size)),items:rows.slice((page-1)*size,page*size)};
    }

    function workspaceRegularity(){
      const rows=workspaceRecords().filter(r=>r.module==='certificates'&&!r.arquivadoEm);
      const today=typeof ctx.today==='function'?ctx.today():now.slice(0,10);
      const active=rows.filter(r=>r.status==='Validado'&&r.detalhes?.situacaoComprovada==='Regular (conferência manual)'&&r.detalhes?.dataConsulta&&r.detalhes?.evidenciaUrl&&(!r.detalhes?.validade||r.detalhes.validade>=today));
      const expired=rows.filter(r=>r.detalhes?.validade&&r.detalhes.validade<today);
      const irregular=rows.filter(r=>r.detalhes?.situacaoComprovada==='Irregular (conferência manual)');
      return {total:rows.length,conferidasManualmente:active.length,vencidas:expired.length,irregularesInformadas:irregular.length,semConfirmacao:rows.filter(r=>!active.includes(r)&&!expired.includes(r)&&!irregular.includes(r)).length,desconhecido:rows.length===0,source:'Apenas conferências e evidências registradas manualmente. Nenhuma consulta automática aos órgãos públicos foi realizada.'};
    }
    function workspaceSave(payload){
      const module=assertModule(payload.module),old=payload.id?workspaceGet(text(payload.id,100)):null;
      if(old&&old.module!==module)fail('VALIDACAO','Módulo do registro não pode ser alterado.');
      if(old&&Number(payload.versao)!==old.versao)fail('CONFLITO','Este registro mudou. Reabra para editar.');
      if(old?.arquivadoEm)fail('VALIDACAO','Restaure o registro antes de editar.');
      const titulo=text(payload.titulo,160);if(titulo.length<3)fail('VALIDACAO','Informe um título com pelo menos 3 caracteres.');
      const status=text(payload.status||'Pendente',50);if(!enterpriseStatuses.includes(status))fail('VALIDACAO','Escolha uma situação válida.');
      const prioridade=text(payload.prioridade||'Normal',30);if(!enterprisePriorities.includes(prioridade))fail('VALIDACAO','Prioridade inválida.');
      const vencimento=date(payload.vencimento,'vencimento'),inicio=date(payload.inicio,'início'),fim=date(payload.fim,'fim');
      if(inicio&&fim&&fim<inicio)fail('VALIDACAO','A data final não pode anteceder a data inicial.');
      const amount=payload.valor===''||payload.valor==null?null:Number(String(payload.valor).replace(',','.'));
      if(amount!==null&&(!Number.isFinite(amount)||amount<0||amount>9999999999||Math.round(amount*100)/100!==amount))fail('VALIDACAO','Informe um valor válido, com até duas casas decimais.');
      const peopleId=text(payload.pessoaId,100),contractId=text(payload.contratoId,100);
      if(peopleId&&(isSecondary||!db.all('Pessoas').some(r=>r.id===peopleId)))fail('VALIDACAO','Pessoa vinculada não encontrada.');
      if(contractId&&(isSecondary||!db.all('Contratos').some(r=>r.id===contractId)))fail('VALIDACAO','Contrato vinculado não encontrado.');
      const categoria=text(payload.categoria,100),fonte=text(payload.fonte,300);
      const detalhes=workspaceDetails(module,payload,old);
      const relacionadoId=text(payload.relacionadoId===undefined?(old?.relacionadoId||''):payload.relacionadoId,100);
      if(relacionadoId){const parent=workspaceGet(relacionadoId);if(parent.id===old?.id||parent.arquivadoEm)fail('VALIDACAO','Escolha um registro de origem válido e ativo.');}
      if(module==='payments'&&!['Receita','Despesa'].includes(categoria))fail('VALIDACAO','Classifique o lançamento como Receita ou Despesa.');
      if(module==='payments'&&((categoria==='Receita'&&status==='Pago')||(categoria==='Despesa'&&status==='Recebido')))fail('VALIDACAO','Situação incompatível com o tipo do lançamento financeiro.');
      if(module==='certificates'&&detalhes.situacaoComprovada==='Regular (conferência manual)'&&(!detalhes.dataConsulta||!detalhes.evidenciaUrl))fail('VALIDACAO','Para registrar regularidade conferida manualmente, informe a data e o link HTTPS da evidência.');
      if(module==='certificates'&&status==='Validado'&&(!detalhes.dataConsulta||!detalhes.evidenciaUrl))fail('VALIDACAO','Para validar internamente uma certidão, informe data de consulta e evidência oficial.');
      if(module==='payments'&&['Pago','Recebido'].includes(status)&&(!detalhes.dataLiquidacao||!detalhes.comprovanteRef))fail('VALIDACAO','Confirme a data de liquidação e a referência do comprovante antes de registrar a baixa.');
      if(['tax','compliance','certificates','notices','licenses','radar','legal','regularization','payroll','sst'].includes(module)&&status==='Validado'&&!fonte)fail('VALIDACAO','Informe a fonte ou evidência para marcar como conferido internamente.');
      const record={...old,id:old?.id||'ent_'+ctx.uuid(),companyId,module,titulo,status,prioridade,vencimento,inicio,fim,valorCentavos:amount===null?null:Math.round(amount*100),responsavel:text(payload.responsavel,140),descricao:text(payload.descricao,2000),referencia:text(payload.referencia,120),categoria,fonte,detalhes,relacionadoId,pessoaId:peopleId,contratoId:contractId,criadoEm:old?.criadoEm||now,criadoPor:old?.criadoPor||ctx.email,atualizadoPor:ctx.email};
      return put('EnterpriseRecords',record);
    }
    function workspaceArchive(payload,restore=false){
      const old=workspaceGet(text(payload.id,100));if(payload.confirmado!==true)fail('CONFIRMACAO','Confirme a operação.');
      if(Number(payload.versao)!==old.versao)fail('CONFLITO','Este registro foi atualizado. Reabra antes de continuar.');
      if(restore&&!old.arquivadoEm)fail('VALIDACAO','Este registro já está ativo.');
      if(!restore&&old.arquivadoEm)fail('VALIDACAO','Este registro já está arquivado.');
      const motivo=restore?'':text(payload.motivo,500);if(!restore&&motivo.length<3)fail('VALIDACAO','Informe um motivo para arquivamento.');
      return put('EnterpriseRecords',{...old,arquivadoEm:restore?'':now,arquivadoPor:restore?'':ctx.email,motivoArquivamento:motivo,atualizadoPor:ctx.email});
    }

    function categoryFolder(person,category) {
      const n=Number(category); if(!Number.isInteger(n)||n<1||n>ctx.categories.length) fail('VALIDACAO','Escolha o tipo de documento.');
      const record=db.all('Pastas').find(x=>x.pessoaId===person.id&&x.categoria===n);
      const f=ctx.storage.ensureFolder(person.pastaId,ctx.categories[n-1],record&&record.storageObjectId);
      if(!record) put('Pastas',{id:person.id+'_cat_'+n,pessoaId:person.id,nome:f.nome,storageObjectId:f.id,parentId:person.pastaId,categoria:n});
      else if(record.nome!==f.nome) put('Pastas',Object.assign({},record,{nome:f.nome}));
      return f.id;
    }
    let operationId,signature;
    if(writes.includes(action)) {
      const key=text(p.chaveOperacao,80); if(!/^[A-Za-z0-9_-]{12,80}$/.test(key)) fail('VALIDACAO','Atualize a página e tente novamente.');
      operationId='op_'+ctx.hash(ctx.email+'|'+action+'|'+key).slice(0,24);
      const request=Object.assign({},p); delete request.chaveOperacao;
      if(action==='site.save'&&request.logo){request.logo=Object.assign({},request.logo,{base64:ctx.hash(request.logo.base64||'')});}
      if(action==='document.upload'||action==='management.upload') { if(typeof p.base64!=='string'||!p.base64.length||p.base64.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(p.base64)) fail('VALIDACAO','Arquivo acima de 20 MB.'); request.base64=ctx.hash(p.base64); }
      signature=ctx.hash(JSON.stringify(request));
      const previous=db.all('Operacoes').find(r=>r.id===operationId);
      if(previous) { if(previous.assinatura!==signature) fail('OPERACAO_DIFERENTE','Os dados foram alterados após uma tentativa de salvar. Confira e tente novamente.'); return previous.resultado; }
    }
    const auditTableName=auditTable(action,p),auditRecordId=action==='preferences.save'?'alertas':text(p.id||'',100);
    const auditBeforeRecord=auditTableName?db.all(auditTableName).find(item=>item.id===auditRecordId)||null:null;
    let result;
    if(['management.bootstrap','management.get','obligation.save','obligation.resolve','contract.save','management.upload','management.link','preferences.save'].includes(action))result=executeManagement_(ctx,action,p);else switch(action) {
      case 'search.global': result=globalSearch(p); break;
      case 'audit.list': result=auditList(p); break;
      case 'bootstrap':
        result={version:VX_CONFIG.version,atualizadoEm:now,usuario:{nome:ctx.email||'Conta proprietária',email:ctx.email||'',perfil:role==='owner'?'Proprietário':role},pastaUrl:'#',maxUploadBytes:ctx.maxUploadBytes,categorias:ctx.categories,pessoas:!isSecondary&&role==='owner'?sorted().map(view=>{const {bancarios,endereco,dependentes,documentos,historicoVinculos,...summary}=view;return summary;}):[],centrosCusto:!isSecondary&&role==='owner'?listCatalog('centroCusto'):[],equipes:!isSecondary&&role==='owner'?listCatalog('equipe'):[],cargos:!isSecondary&&role==='owner'?listCatalog('cargo'):[],sites:!isSecondary&&role==='owner'?listSites():[],empresaSelecionada:companyId}; break;
      case 'site.logo': {const site=listSites().find(s=>s.id===text(p.id,100));if(!site)fail('NAO_ENCONTRADO','Site não encontrado.');result=site.logoId?ctx.storage.siteLogoRead(site.logoId):null;break;}
      case 'site.save': {
        const sites=listSites(),old=p.id?sites.find(s=>s.id===text(p.id,100)):null;if(p.id&&!old)fail('NAO_ENCONTRADO','Site não encontrado.');if(old&&old.versao!==Number(p.versao))fail('CONFLITO','Este site foi atualizado. Reabra antes de editar.');
        let value;try{value=VeloXSites.validate(p);}catch(error){fail('VALIDACAO',error.message);}
        if(sites.some(s=>s.id!==old?.id&&s.url.replace(/\/$/,'')===value.url.replace(/\/$/,'')))fail('DUPLICADO','Esse endereço já está cadastrado. Edite o site existente.');
        const order=old?old.ordem:Math.max(0,...sites.map(s=>Number(s.ordem)||0))+1;if(!old&&!Number.isSafeInteger(order))fail('VALIDACAO','Não foi possível atribuir a posição do site.');
        const id=old?.id||'site_'+ctx.uuid();let logoId=old?.logoId||'',logoNome=old?.logoNome||'';if(p.logo){logoId=ctx.storage.siteLogoUpload(id,operationId,p.logo).id;logoNome=text(p.logo.nome,180);}
        result=put('SitesExternos',Object.assign({},old||{id,versao:0,criadoEm:now},value,{ordem:order,logoId,logoNome,ativo:true}));break;
      }
      case 'site.delete': {
        if(p.confirmado!==true)fail('CONFIRMACAO','Confirme a exclusão do site.');
        const old=listSites().find(s=>s.id===text(p.id,100));if(!old)fail('NAO_ENCONTRADO','Site não encontrado.');
        if(old.versao!==Number(p.versao))fail('CONFLITO','Este site foi atualizado. Reabra antes de excluir.');
        db.remove('SitesExternos',old.id);result={id:old.id,excluido:true};break;
      }
      case 'company.list': result=companyList();break;
      case 'company.save': result=companySave(p);break;
      case 'company.select': result=companySelect(p);break;
      case 'workspace.list': result=workspaceList(p);break;
      case 'workspace.schema': result=workspaceSchema(p);break;
      case 'workspace.get': result=workspaceGetDetails(p);break;
      case 'workspace.regularity': result=workspaceRegularity();break;
      case 'workspace.followup': result=workspaceFollowup(p);break;
      case 'workspace.advance': result=workspaceAdvance(p);break;
      case 'workspace.pipeline': result=workspacePipeline();break;
      case 'workspace.summary': result=workspaceSummary();break;
      case 'workspace.cash': result=workspaceCash();break;
      case 'workspace.documents': result=workspaceDocuments(p);break;
      case 'workspace.save': result=workspaceSave(p);break;
      case 'workspace.archive': result=workspaceArchive(p,false);break;
      case 'workspace.restore': result=workspaceArchive(p,true);break;
      case 'people.list': result=sorted(); break;
      case 'person.get': result=personView(getPerson(text(p.id,100))); break;
      case 'person.open': {const person=getPerson(text(p.id,100));result={pessoa:personView(person),pasta:ctx.storage.list(text(p.pastaId,100)||person.pastaId,person.pastaId)};break;}
      case 'catalog.save': {
        const type=text(p.tipo,30), table=catalogs[type]; if(!table) fail('VALIDACAO','Cadastro auxiliar não reconhecido.');
        const old=p.id?db.all(table).find(r=>r.id===text(p.id,100)):null;
        if(p.id&&!old) fail('NAO_ENCONTRADO','Cadastro não encontrado.');
        if(old&&Number(p.versao)!==old.versao) fail('CONFLITO','Esse cadastro foi atualizado. Reabra antes de editar.');
        const name=text(p.nome,100), code=text(p.codigo,40); if(name.length<2) fail('VALIDACAO','Informe o nome.');
        if(db.all(table).some(r=>r.id!==(old&&old.id)&&(normalized(r.nome)===normalized(name)||(code&&normalized(r.codigo)===normalized(code))))) fail('DUPLICADO','Esse nome ou código já está cadastrado. Edite o cadastro existente.');
        const active=p.ativo===undefined?old?old.ativo!==false:true:boolean(p.ativo);
        result=put(table,Object.assign({},old||{id:type+'_'+ctx.uuid(),criadoEm:now},{nome:name,codigo:code,descricao:text(p.descricao,600),ativo:active}));
        if(old&&old.nome!==name) db.all('Pessoas').slice().filter(r=>r[type+'Id']===old.id).forEach(r=>put('Pessoas',Object.assign({},r,{[type]:name})));
        break;
      }
      case 'person.transfer': {
        const old=getPerson(text(p.id,100));
        if(Number(p.versao)!==old.versao)fail('CONFLITO','O cadastro foi atualizado. Reabra antes de movimentar.');
        if(situation(old.situacao)==='Desligado')fail('VALIDACAO','Não é possível movimentar um vínculo encerrado.');
        const effective=date(p.data,'movimentação'),admission=old.trabalho?.admissao;
        if(!effective)fail('VALIDACAO','Informe a data efetiva da movimentação.');
        if(admission&&effective<admission)fail('CRONOLOGIA','A movimentação não pode anteceder a admissão.');
        const cost=reference('centroCusto',p.centroCustoId,old),team=reference('equipe',p.equipeId,old),job=reference('cargo',p.cargoId,old);
        const managerId=text(p.gestorId,100);
        if(managerId){let manager=db.all('Pessoas').find(r=>r.id===managerId);if(!manager||manager.id===old.id||situation(manager.situacao)==='Desligado')fail('VALIDACAO','Escolha um gestor ativo diferente da própria pessoa.');const seen=new Set([old.id]);while(manager){if(seen.has(manager.id))fail('HIERARQUIA_CIRCULAR','A relação de gestão criaria um ciclo no organograma.');seen.add(manager.id);manager=manager.gestorId?db.all('Pessoas').find(r=>r.id===manager.gestorId):null;}}
        const reason=text(p.motivo,500);if(reason.length<3)fail('VALIDACAO','Informe o motivo da movimentação.');
        const work=Object.assign({},old.trabalho||{},{ultimaMovimentacaoEm:effective,ultimaMovimentacaoMotivo:reason});
        result=personView(put('Pessoas',Object.assign({},old,{centroCustoId:cost.id,centroCusto:cost.nome,equipeId:team?.id||'',equipe:team?.nome||'',cargoId:job?.id||'',cargo:job?.nome||'',gestorId:managerId,trabalho:work})));
        break;
      }
      case 'person.terminate': {
        const old=getPerson(text(p.id,100));
        if(p.confirmado!==true) fail('CONFIRMACAO','Confirme o desligamento do colaborador.');
        if(Number(p.versao)!==old.versao) fail('CONFLITO','Esse cadastro foi atualizado. Reabra antes de desligar.');
        if(situation(old.situacao)==='Desligado') fail('VALIDACAO','Esse colaborador já está desligado.');
        if(!['Ativo','Afastado'].includes(situation(old.situacao))) fail('VALIDACAO','Confira a situação atual antes de desligar.');
        const departure=date(p.data,'desligamento'),admission=old.trabalho&&old.trabalho.admissao;
        if(!departure) fail('VALIDACAO','Informe a data de desligamento.');
        const today=typeof ctx.today==='function'?ctx.today():(ctx.today||now.slice(0,10));
        if(departure>today) fail('VALIDACAO','O desligamento não pode estar no futuro.');
        if(admission&&/^\d{4}-\d{2}-\d{2}$/.test(admission)&&departure<admission) fail('VALIDACAO','O desligamento deve ocorrer a partir da admissão.');
        result=personView(put('Pessoas',Object.assign({},old,{situacao:'Desligado',trabalho:Object.assign({},old.trabalho||{},{desligamento:departure})})));
        break;
      }
      case 'people.import': {
        if(!Array.isArray(p.rows)||!p.rows.length||p.rows.length>100)fail('VALIDACAO','Importe de 1 a 100 colaboradores.');
        const items=[];
        for(let i=0;i<p.rows.length;i++){
          const row=object(p.rows[i]);if(row.id||!text(row.matricula,40))fail('VALIDACAO','A importação cria novos vínculos com matrícula obrigatória.');
          try{items.push(execute(ctx,'person.save',{nome:row.nome,matricula:row.matricula,centroCustoId:row.centroCustoId,trabalho:{admissao:row.trabalho?.admissao},ponto:row.ponto,chaveOperacao:'import_'+ctx.hash(p.chaveOperacao+'|'+i).slice(0,40)}));}
          catch(e){e.message='Linha '+(i+2)+': '+e.message;throw e;}
        }
        result={total:items.length,items};break;
      }
      case 'person.save': {
        const old=p.id?getPerson(text(p.id,100)):null;
        if(old&&Number(p.versao)!==old.versao) fail('CONFLITO','Esse cadastro foi atualizado. Reabra a ficha antes de editar.');
        const name=text(p.nome===undefined&&old?old.nome:p.nome,160); if(name.length<3) fail('VALIDACAO','Informe o nome completo da pessoa.');
        const employeeNumber=text(p.matricula===undefined&&old?old.matricula:p.matricula,40);
        if(employeeNumber&&db.all('Pessoas').some(r=>r.id!==old?.id&&normalized(r.matricula)===normalized(employeeNumber)))fail('DUPLICADO','Este identificador interno já está em uso.');
        const managerId=text(p.gestorId===undefined&&old?old.gestorId:p.gestorId,100);
        if(managerId){
          let manager=db.all('Pessoas').find(r=>r.id===managerId);
          if(!manager||manager.id===old?.id||situation(manager.situacao)==='Desligado')fail('VALIDACAO','Escolha um gestor ativo diferente da própria pessoa.');
          const seen=new Set([old?.id].filter(Boolean));
          while(manager){if(seen.has(manager.id))fail('HIERARQUIA_CIRCULAR','A relação de gestão criaria um ciclo no organograma.');seen.add(manager.id);manager=manager.gestorId?db.all('Pessoas').find(r=>r.id===manager.gestorId):null;}
        }
        const cost=reference('centroCusto',p.centroCustoId,old), team=reference('equipe',p.equipeId,old), job=reference('cargo',p.cargoId,old);
        const idCPF=identifier(p.cpf===undefined&&old?old.cpf:p.cpf);
        const nextSituation=situation(p.situacao===undefined?old&&old.situacao||'Ativo':p.situacao); if(!['Ativo','Afastado','Desligado'].includes(nextSituation)) fail('VALIDACAO','Escolha a situação do colaborador.');
        if(nextSituation==='Desligado'&&(!old||situation(old.situacao)!=='Desligado')) fail('CONFIRMACAO','Use a ação Desligar para encerrar o vínculo com confirmação.');
        if(old&&situation(old.situacao)==='Desligado'&&nextSituation!=='Desligado') fail('VALIDACAO','Reativação exige um fluxo específico; preserve a situação do cadastro.');
        const personal=block(p,old,'dadosPessoais',{nomeSocial:160,nomeMae:160,nomePai:160,nascimento:'nascimento',genero:50,estadoCivil:50,etnia:50,escolaridade:80,nacionalidade:80,pais:80,naturalizacao:'naturalização',casadoBrasileiro:true,filhoBrasileiro:true,pcd:true,celular:30,email:180});
        if(personal.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) fail('VALIDACAO','Confira o e-mail do colaborador.');
        const documents=block(p,old,'documentos',{rgExpedicao:'expedição do RG',rgOrgao:40,cnh:30,cnhValidade:'validade da CNH',ctpsNumero:30,ctpsSerie:20,ctpsEmissao:'emissão da CTPS',ctpsUF:2,nis:30,estrangeiro:true});
        const address=block(p,old,'endereco',{cep:10,rua:180,numero:30,complemento:100,bairro:100,cidade:100,uf:2,exterior:250});
        if(address.cep&&!/^\d{5}-?\d{3}$/.test(address.cep)) fail('VALIDACAO','Confira o CEP.');
        const banking=block(p,old,'bancarios',{banco:100,agencia:30,conta:40,tipoConta:40,pix:180});
        const work=block(p,old,'trabalho',{admissao:'admissão',desligamento:'desligamento',tipoVinculo:50,modeloTrabalho:40,salarioBruto:20,comissionado:true,cargaHoraria:60,experienciaDias:4,prorrogacaoDias:4,experienciaFim:'fim da experiência',experienciaConferidaEm:'conferência da experiência',ultimaMovimentacaoEm:'última movimentação',ultimaMovimentacaoMotivo:500});
        if(work.tipoVinculo&&!['CLT','Pessoa jurídica','Estágio','Aprendiz','Temporário','Autônomo','Outro'].includes(work.tipoVinculo))fail('VALIDACAO','Escolha um tipo de vínculo válido.');
        if(work.modeloTrabalho&&!['Presencial','Híbrido','Remoto','Externo'].includes(work.modeloTrabalho))fail('VALIDACAO','Escolha um modelo de trabalho válido.');
        const point=window.VXEnrollment.config(p.ponto,old?.ponto,work.admissao,nextSituation,db.all('Pessoas'),old?.id);
        const pointHistory=old?.pontoHistorico||[];
        const changedPoint=p.ponto!==undefined&&JSON.stringify(point)!==JSON.stringify(old?.ponto||{});
        for(const key of ['experienciaDias','prorrogacaoDias'])if(work[key]&&!/^\d{1,3}$/.test(work[key])||Number(work[key]||0)>365)fail('VALIDACAO','Confira os dias de experiência e prorrogação.');
        if(work.experienciaFim&&work.admissao&&work.experienciaFim<work.admissao)fail('VALIDACAO','O fim da experiência não pode anteceder a admissão.');
        if(work.salarioBruto&&!/^\d{1,9}([.,]\d{1,2})?$/.test(work.salarioBruto)) fail('VALIDACAO','Confira o salário bruto. Use apenas o valor numérico.');
        if(work.admissao&&work.desligamento&&work.desligamento<work.admissao) fail('VALIDACAO','O desligamento deve ocorrer a partir da admissão.');
        let dependents=old&&old.dependentes||[];
        if(p.dependentes!==undefined) {
          if(!Array.isArray(p.dependentes)||p.dependentes.length>50) fail('VALIDACAO','Confira a lista de dependentes.');
          dependents=p.dependentes.map((value,i)=>{const d=object(value), name=text(d.nome,160); if(name.length<3) fail('VALIDACAO','Informe o nome completo do dependente '+(i+1)+'.'); return {id:text(d.id,100)||'dep_'+ctx.uuid(),nome:name,tipo:text(d.tipo,50),cpf:identifier(d.cpf,'CPF do dependente'),nascimento:date(d.nascimento,'nascimento do dependente'),sexo:text(d.sexo,30),ir:d.ir===undefined?false:boolean(d.ir),salarioFamilia:d.salarioFamilia===undefined?false:boolean(d.salarioFamilia),pcd:d.pcd===undefined?false:boolean(d.pcd)};});
          if(new Set(dependents.map(d=>d.id)).size!==dependents.length) fail('VALIDACAO','Há dependentes repetidos na lista.');
        }
        const sameCPF=idCPF?db.all('Pessoas').filter(r=>r.id!==old?.id&&String(r.cpf||'').replace(/\D/g,'')===idCPF):[];
        const active=sameCPF.find(r=>situation(r.situacao)!=='Desligado');
        if(nextSituation!=='Desligado'&&active){const e=new Error('Já existe vínculo ativo ou afastado para este CPF. Abra o cadastro existente.');e.code='CPF_ATIVO';e.pessoaId=active.id;throw e;}
        const history=sameCPF.filter(r=>situation(r.situacao)==='Desligado');
        if(!old&&nextSituation!=='Desligado'&&history.length){
          if(history.some(r=>!r.trabalho?.desligamento||!validHistoryDate(r.trabalho.desligamento)))fail('HISTORICO_INCOMPLETO','O vínculo anterior está sem data de desligamento válida. Confira o histórico antes de recontratar.');
          const latest=history.reduce((a,b)=>a.trabalho.desligamento>b.trabalho.desligamento?a:b);
          if(!work.admissao||work.admissao<=latest.trabalho.desligamento)fail('CRONOLOGIA','Informe admissão posterior ao último desligamento.');
          if(p.recontratacaoConfirmada!==true)fail('RECONTRATACAO','Confirme a abertura de um novo vínculo, preservando o histórico anterior.');
        }
        if(old&&idCPF&&sameCPF.length&&(idCPF!==String(old.cpf||'').replace(/\D/g,'')||work.admissao!==old.trabalho?.admissao||work.desligamento!==old.trabalho?.desligamento)){
          if(!work.admissao)fail('CRONOLOGIA','Informe a admissão para conferir os períodos desse CPF.');
          const end=nextSituation==='Desligado'?work.desligamento:'9999-12-31';if(!end)fail('CRONOLOGIA','Informe o desligamento para conferir o histórico.');
          if(sameCPF.some(r=>!r.trabalho?.admissao||situation(r.situacao)==='Desligado'&&!r.trabalho?.desligamento||work.admissao<=(situation(r.situacao)==='Desligado'?r.trabalho.desligamento:'9999-12-31')&&r.trabalho.admissao<=end))fail('CRONOLOGIA','Os períodos desse CPF se sobrepõem ou têm datas incompletas. Confira o histórico.');
        }
        if(!idCPF&&db.all('Pessoas').some(r=>r.id!==old?.id&&!r.cpf&&situation(r.situacao)!=='Desligado'&&normalized(r.nome)===normalized(name)&&normalized(r.centroCusto)===normalized(cost.nome)&&normalized(r.equipe)===normalized(team?.nome)))fail('DUPLICADO','Esse colaborador já está cadastrado. Localize o cadastro para editar.');
        const personId=old?old.id:'p_'+ctx.uuid(), stableName=name.replace(/[\\/]/g,' - ')+' — '+personId.slice(-6);
        const parent=ctx.storage.ensureFolder(ctx.rootId,old?old.pastaNome:stableName,old&&old.pastaId);
        if(!old) ctx.categories.forEach((category,i)=>{const f=ctx.storage.ensureFolder(parent.id,category);put('Pastas',{id:personId+'_cat_'+(i+1),pessoaId:personId,nome:category,storageObjectId:f.id,parentId:parent.id,categoria:i+1});});
        const record=Object.assign({},old||{id:personId,versao:0,criadoEm:now},{nome:name,matricula:employeeNumber,gestorId:managerId,centroCustoId:cost.id,centroCusto:cost.nome,equipeId:team?team.id:'',equipe:team?team.nome:'',cargoId:job?job.id:'',cargo:job?job.nome:'',situacao:nextSituation,cpf:idCPF,rg:text(p.rg===undefined&&old?old.rg:p.rg,40),observacoes:text(p.observacoes===undefined&&old?old.observacoes:p.observacoes,600),dadosPessoais:personal,documentos:documents,endereco:address,bancarios:banking,trabalho:work,ponto:point,pontoHistorico:changedPoint?pointHistory.concat([{em:now,por:ctx.email,config:point}]):pointHistory,dependentes:dependents,pastaId:parent.id,pastaNome:parent.nome,pastaUrl:parent.url});
        if(!old&&history.length)record.vinculoAnteriorId=history.slice().sort((a,b)=>(b.trabalho?.desligamento||'').localeCompare(a.trabalho?.desligamento||''))[0].id;
        result=personView(put('Pessoas',record)); break;
      }
      case 'folder.list': {const person=getPerson(text(p.pessoaId,100));result=ctx.storage.list(text(p.pastaId,100)||person.pastaId,person.pastaId);break;}
      case 'folder.create': {
        const person=getPerson(text(p.pessoaId,100)), parentId=text(p.pastaId,100)||person.pastaId;
        ctx.storage.assertFolder(parentId,person.pastaId); result=ctx.storage.ensureFolder(parentId,folderName(p.nome));
        put('Pastas',{id:'folder_'+ctx.hash(result.id).slice(0,24),pessoaId:person.id,nome:result.nome,storageObjectId:result.id,parentId});break;
      }
      case 'document.upload': {
        const person=getPerson(text(p.pessoaId,100)), photo=p.tipo==='fotoPerfil';
        const parentId=photo?categoryFolder(person,1):p.categoria?categoryFolder(person,p.categoria):text(p.pastaId,100)||person.pastaId;
        if(!photo&&parentId===person.pastaId)fail('PASTA_INVALIDA','Abra uma categoria para enviar documentos. A raiz não recebe arquivos soltos.');
        let category=Number(p.categoria)||0;
        if(!photo&&!category&&p.renomeacao){const listing=ctx.storage.list(parentId,person.pastaId),pathIds=(listing.caminho||[]).map(f=>f.id);const record=db.all('Pastas').find(f=>f.pessoaId===person.id&&f.categoria&&(f.storageObjectId===parentId||pathIds.includes(f.storageObjectId)));category=record?record.categoria:0;}
        if(p.renomeacao&&p.confirmado!==true)fail('CONFIRMACAO','Confira e confirme a prévia dos nomes antes do envio.');
        const computed=p.renomeacao?VeloXDocuments.name(category,person.nome,text(p.nomeOriginal,240),p.renomeacao):p.nome;
        const name=text(computed,240), mime=text(p.mime,150)||'application/octet-stream', documentId='d_'+operationId.slice(3);
        if(!name||/[\\/]/.test(name))fail('VALIDACAO','Nome de arquivo inválido.');
        const file=ctx.storage.upload(parentId,person.pastaId,documentId,name,mime,p.base64,photo);
        result=put('Documentos',{id:documentId,pessoaId:person.id,pastaId:parentId,nome:file.nome,mime:file.mime||mime,tamanho:file.size,storageObjectId:file.id,url:file.url,hash:file.hash,enviadoEm:now,tipo:photo?'fotoPerfil':'documento'});
        if(photo) result=Object.assign({},result,{pessoa:personView(put('Pessoas',Object.assign({},person,{fotoId:file.id,fotoUrl:file.url})))});
        break;
      }
      case 'photo.get': {const person=getPerson(text(p.pessoaId,100));result=person.fotoId?ctx.storage.photo(person.fotoId,person.pastaId):null;break;}
      case 'document.download': {
        const person=getPerson(text(p.pessoaId,100)),parentId=text(p.pastaId,100)||person.pastaId;
        if(!Array.isArray(p.ids)||!p.ids.length||p.ids.length>100||new Set(p.ids).size!==p.ids.length)fail('VALIDACAO','Selecione de 1 a 100 arquivos distintos da pasta atual.');
        result=ctx.storage.download(parentId,person.pastaId,p.ids.map(id=>text(id,150)));break;
      }
    }
    if(writes.includes(action)) {
      const descriptor=auditDescriptor(action,p,auditBeforeRecord);
      const afterTable=auditTable(action,p),afterId=String(result?.id||p.id||'');
      const afterRecord=afterTable?db.all(afterTable).find(item=>item.id===afterId)||null:null;
      const recordId=action==='folder.create'||action==='document.upload'?String(p.pessoaId||''):
        action==='management.upload'||action==='management.link'?String(p.registroId||''):
        String(result?.id||p.id||'');
      let fields=[];
      if(action==='folder.create')fields=['nome'];
      else if(action==='document.upload')fields=['arquivo','categoria'];
      else if(action==='management.upload')fields=['documento'];
      else if(action==='management.link')fields=['referenciaDocumento'];
      else if(action==='obligation.resolve')fields=['situacao','resolucao'];
      else if(action==='person.terminate')fields=['situacao','trabalho.desligamento'];
      else if(action==='site.delete')fields=['registro'];
      else if(auditBeforeRecord&&afterRecord)fields=auditDiffFields(auditBeforeRecord,afterRecord);
      else fields=auditPayloadFields(p);
      fields=[...new Set(fields)].filter(Boolean).slice(0,40);
      const description=descriptor.evento+' · '+descriptor.tipoRegistro;
      db.put('Logs',{id:'log_'+operationId.slice(3),versao:1,data:now,usuario:ctx.email,acao:action,evento:descriptor.evento,area:descriptor.area,tipoRegistro:descriptor.tipoRegistro,registro:recordId,campos:fields,descricao:description,resultado:'SUCESSO',referencia:String(result?.id||p.id||''),companyId:action==='company.select'?String(result.selectedId):companyId});
      db.put('Operacoes',{id:operationId,versao:1,data:now,acao:action,assinatura:signature,resultado:result});
    }
    return result;
  }
  return {execute,validateCPF:cpf};
})();

export { VX_CONFIG, VeloXCore, VeloXDocuments };
