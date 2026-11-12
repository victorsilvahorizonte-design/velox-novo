/** VeloX Enterprise Workspace — operações registráveis, auditadas e conectadas às APIs do VeloX.
 * Não emite certidões, não executa pagamentos e não simula integrações oficiais.
 */
(function(global){
'use strict';
const definitions = [
 ['recruitment','Recrutamento e Seleção','Pessoas & Talentos','Vagas, candidatos e etapas de seleção','target'],
 ['admissions','Admissões e Integração','Pessoas & Talentos','Checklist de admissão e integração','userplus'],
 ['hours','Jornadas e Ponto','Pessoas & Talentos','Escalas, marcações e conferências','clock'],
 ['vacations','Férias e Ausências','Pessoas & Talentos','Solicitações, períodos e afastamentos','calendar'],
 ['benefits','Benefícios','Pessoas & Talentos','Concessões, benefícios e conferências','heart'],
 ['training','Treinamento e Desempenho','Pessoas & Talentos','Capacitações, avaliações e certificações','spark'],
 ['payroll','Folha e Encargos','Pessoas & Talentos','Conferências da pré-folha e encargos','money'],
 ['sst','Saúde e Segurança do Trabalho','Pessoas & Talentos','Exames, treinamentos e obrigações de SST','shield'],
 ['clients','Clientes e Contatos','Comercial & Clientes','Relacionamentos, contatos e empresas','users'],
 ['crm','CRM e Oportunidades','Comercial & Clientes','Negociações e histórico de oportunidades','chart'],
 ['products','Produtos, Serviços e Preços','Comercial & Clientes','Catálogo e referências comerciais','box'],
 ['proposals','Propostas e Orçamentos','Comercial & Clientes','Propostas, valores e acompanhamento','report'],
 ['orders','Pedidos e Vendas','Comercial & Clientes','Pedidos, vendas e situação comercial','money'],
 ['marketing','Marketing e Relacionamento','Comercial & Clientes','Campanhas, ações e resultados','target'],
 ['support','Atendimento e Pós-venda','Comercial & Clientes','Solicitações e acompanhamento de clientes','heart'],
 ['strategy','Planejamento Estratégico','Direção e Inteligência','Objetivos, metas e iniciativas','target'],
 ['scenarios','Cenários e Previsões','Direção e Inteligência','Hipóteses e comparações gerenciais','chart'],
 ['service','Ordens de Serviço','Operações & Serviços','Solicitações e execução de serviços','brief'],
 ['projects','Projetos e Atividades','Operações & Serviços','Planejamento, etapas e responsáveis','target'],
 ['posts','Postos, Escalas e Cobertura','Operações & Serviços','Alocações e necessidades de cobertura','users'],
 ['measurements','Execução e Medições','Operações & Serviços','Medições, evidências e aceite','report'],
 ['quality','Qualidade Operacional','Operações & Serviços','Inspeções, ocorrências e melhorias','shield'],
 ['suppliers','Fornecedores','Suprimentos & Patrimônio','Cadastro e acompanhamento de fornecedores','truck'],
 ['purchases','Compras e Estoque','Suprimentos & Patrimônio','Solicitações e compras operacionais','box'],
 ['quotes','Requisições e Cotações','Suprimentos & Patrimônio','Cotações e comparações de aquisição','money'],
 ['inventory','Estoque e Almoxarifado','Suprimentos & Patrimônio','Movimentações e controle de materiais','box'],
 ['assets','Patrimônio e Ativos','Suprimentos & Patrimônio','Bens, responsáveis e inventários','building'],
 ['maintenance','Manutenção','Suprimentos & Patrimônio','Ordens preventivas e corretivas','settings'],
 ['fleet','Frota e Logística','Suprimentos & Patrimônio','Veículos, custos e revisões','truck'],
 ['payments','Contas a Pagar e Receber','Financeiro & Controladoria','Lançamentos, vencimentos e baixas informadas','money'],
 ['billing','Faturamento','Financeiro & Controladoria','Faturas e controles de emissão','report'],
 ['budgets','Orçamento e Centros de Custo','Financeiro & Controladoria','Orçamentos e análises de variação','chart'],
 ['accounting','Contabilidade e Fechamento','Financeiro & Controladoria','Competências, conferências e demonstrações','report'],
 ['tax','Gestão Tributária','Fiscal & Regularidade','Tributos e conferências tributárias','money'],
 ['compliance','Obrigações Legais','Fiscal & Regularidade','Declarações, escriturações e obrigações','calendar'],
 ['certificates','Certidões e Regularidade','Fiscal & Regularidade','Validação documental e acompanhamento de certidões','shield'],
 ['notices','Comunicações Oficiais','Fiscal & Regularidade','DTE, DET, notificações e providências','bell'],
 ['licenses','Licenças e Alvarás','Fiscal & Regularidade','Validade, exigências e renovações','report'],
 ['radar','Radar Empresarial','Fiscal & Regularidade','Mudanças legais, vigências e fontes oficiais','network'],
 ['legal','Jurídico e Processos','Fiscal & Regularidade','Demandas, prazos e documentos jurídicos','contracts'],
 ['regularization','Central de Regularização','Fiscal & Regularidade','Planos de ação e evidências de regularização','shield'],
 ['risk','Riscos e Controles','Governança & Riscos','Riscos, impactos e planos de tratamento','shield'],
 ['audits','Auditorias e Conformidade','Governança & Riscos','Verificações, achados e evidências','report'],
 ['policies','Políticas e Procedimentos','Governança & Riscos','Normas, revisões e ciência','report'],
 ['privacy','Privacidade e LGPD','Governança & Riscos','Solicitações de titulares e proteção dos dados','shield'],
 ['approvals','Aprovações e Fluxos','Plataforma & Automação','Solicitações e decisões registradas','shield'],
 ['tasks','Tarefas e Agenda Empresarial','Plataforma & Automação','Responsáveis, entregas e prioridades','calendar'],
 ['automations','Automações Supervisionadas','Plataforma & Automação','Regras operacionais e acompanhamento','network'],
 ['documents','Central de Documentos','Plataforma & Automação','Consulta unificada dos arquivos já vinculados','folder'],
 ['cash','Fluxo de Caixa','Financeiro & Controladoria','Visão dos lançamentos financeiros informados','chart'],
 ['cost','Centros de Custo','Financeiro & Controladoria','Catálogo único já utilizado em Pessoas','building'],
 ['access','Usuários e Permissões','Plataforma & Automação','Identidade autenticada e proteção de dados','shield'],
 ['config','Configurações','Plataforma & Automação','Preferências administrativas do sistema','settings'],
 ['integrations','Integrações e Automação','Plataforma & Automação','Acessos externos e estado das integrações','network']
];
const catalog=Object.freeze(Object.fromEntries(definitions.map(([id,title,group,description,icon])=>[id,Object.freeze({id,title,group,description,icon})])));
// Estado técnico versionado dos módulos. Não representa estado operacional de documentos ou lançamentos.
const READINESS_VERSION = '2026-11-10.5';
const readiness = Object.freeze(Object.fromEntries(Object.entries({"recruitment":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"admissions":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"hours":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"vacations":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"benefits":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"training":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"payroll":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro interno de conferência; cálculo legal, envio oficial e integração contábil não homologados. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"sst":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro interno de SST; integração com serviços oficiais não implementada. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"clients":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"crm":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro de oportunidades e fluxo para rascunhos de propostas; funil completo em evolução.","external":false,"reviewedAt":"2026-11-10"},"products":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"proposals":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro e rascunhos vinculados; composição, envio e aceite formal pendentes.","external":false,"reviewedAt":"2026-11-10"},"orders":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro e rascunhos vinculados; operação transacional completa pendente.","external":false,"reviewedAt":"2026-11-10"},"marketing":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"support":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"strategy":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"scenarios":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"service":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro e rascunhos vinculados; execução e aceite de OS ainda incompletos.","external":false,"reviewedAt":"2026-11-10"},"projects":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"posts":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"measurements":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"quality":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"suppliers":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"purchases":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"quotes":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"inventory":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro interno; ainda sem controle transacional de saldo/estoque.","external":false,"reviewedAt":"2026-11-10"},"assets":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"maintenance":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"fleet":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"payments":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Lançamentos e baixas apenas informados; sem banco, Pix, transferência ou conciliação automática. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"billing":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Faturamento interno; notas fiscais oficiais não emitidas. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"budgets":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"accounting":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"tax":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"compliance":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos; declarações ou obrigações oficiais não enviadas. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"certificates":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Conferências com evidência informada; não consulta certidão automaticamente. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"notices":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro de acompanhamento; leitura oficial DET/DTE não habilitada. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"licenses":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"radar":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro de fontes/impacto; monitoramento normativo automático não habilitado. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"legal":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Controle interno; integração com portais judiciais não implementada. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"},"regularization":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"risk":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"audits":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"policies":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros internos e formulários básicos disponíveis; especialização completa ainda pendente.","external":false,"reviewedAt":"2026-11-10"},"privacy":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registros básicos; solicitações LGPD e políticas de retenção pendentes.","external":false,"reviewedAt":"2026-11-10"},"approvals":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Registro básico; workflow de alçadas e dupla validação pendente.","external":false,"reviewedAt":"2026-11-10"},"tasks":{"status":"MVP FUNCIONAL","available":"Cadastros, consultas e registros internos básicos","pending":"Tarefas vinculadas, prazos e responsáveis; notificações e gestão de dependências pendentes.","external":false,"reviewedAt":"2026-11-10"},"automations":{"status":"PLANEJADO","available":"Planejamento e catálogo inicial","pending":"Cadastro genérico disponível; motor real de automações e disparos ainda não habilitado.","external":false,"reviewedAt":"2026-11-10"},"documents":{"status":"EM DESENVOLVIMENTO","available":"Consulta e operações parciais","pending":"Consulta consolidada; versões, permissões granulares e operações documentais avançadas pendentes.","external":false,"reviewedAt":"2026-11-10"},"cash":{"status":"EM DESENVOLVIMENTO","available":"Consulta e operações parciais","pending":"Gráficos de lançamentos internos; não consulta bancos nem garante conciliação.","external":false,"reviewedAt":"2026-11-10"},"cost":{"status":"EM DESENVOLVIMENTO","available":"Consulta e operações parciais","pending":"Cadastros de centro de custo disponíveis; orçamento e rateios avançados ainda incompletos.","external":false,"reviewedAt":"2026-11-10"},"access":{"status":"EM DESENVOLVIMENTO","available":"Consulta e operações parciais","pending":"Seleção de empresa e dono disponíveis; membros, convites, RLS e autorização por usuário não implementados.","external":false,"reviewedAt":"2026-11-10"},"config":{"status":"EM DESENVOLVIMENTO","available":"Consulta e operações parciais","pending":"Preferências administrativas básicas; configurações avançadas/por empresa pendentes.","external":false,"reviewedAt":"2026-11-10"},"integrations":{"status":"PLANEJADO","available":"Planejamento e catálogo inicial","pending":"Catálogo de acessos externos disponível; conectores e APIs oficiais no backlog. Dependência externa: conexão/serviço oficial não homologado.","external":true,"reviewedAt":"2026-11-10"}}).map(([key,value])=>[key,Object.freeze(value)])));
const legacyReadiness = Object.freeze({
  'central':{status:'MVP FUNCIONAL',available:'Indicadores e registros internos',pending:'BI avançado, testes integrados e homologação',reviewedAt:'2026-11-10'},
  'people':{status:'MVP FUNCIONAL',available:'Cadastro, documentos e histórico de pessoas',pending:'Isolamento multiempresa dos cadastros legados e homologação',reviewedAt:'2026-11-10'},
  'organization':{status:'MVP FUNCIONAL',available:'Equipe, hierarquias e vínculos internos',pending:'Regras e relatórios organizacionais avançados',reviewedAt:'2026-11-10'},
  'contracts':{status:'MVP FUNCIONAL',available:'Cadastro, vigência e acompanhamento de contratos',pending:'Integrações, regras contratuais especializadas e homologação',reviewedAt:'2026-11-10'},
  'documents':{status:'EM DESENVOLVIMENTO',available:'Arquivos associados a registros existentes',pending:'Permissões granulares, versionamento e homologação multiempresa',reviewedAt:'2026-11-10'},
  'catalogs':{status:'MVP FUNCIONAL',available:'Cadastros de equipes, cargos e centros de custo',pending:'Regras avançadas e isolamento multiempresa legado',reviewedAt:'2026-11-10'},
  'reports':{status:'MVP FUNCIONAL',available:'Relatórios e filtros internos',pending:'Automação, agendamento e homologação geral',reviewedAt:'2026-11-10'}
});
function areaToken(group){
 if(/Financeiro/.test(group))return 'finance';
 if(/Fiscal|Contrat/.test(group))return 'fiscal';
 if(/Opera/.test(group))return 'operations';
 if(/Comercial/.test(group))return 'commercial';
 if(/Suprimentos/.test(group))return 'supply';
 if(/Governan/.test(group))return 'governance';
 if(/Plataforma/.test(group))return 'platform';
 return 'people';
}
function readinessMarkup(data){
 if(!data)return '';
 const status=data.status,tag=status==='MVP FUNCIONAL'?'MVP FUNCIONAL':status;
 const details='Escopo: '+data.available+'. Pendências: '+data.pending;
 return `<details class="vx-readiness" data-vx-status="${e(status)}"><summary title="${e(details)}" aria-label="Estado de desenvolvimento: ${e(tag)}. Clique para detalhes">${e(tag)}</summary><div class="vx-readiness-panel" role="note"><strong>Estado técnico: ${e(tag)}</strong><p><b>Disponível:</b> ${e(data.available)}</p><p><b>Limitações:</b> ${e(data.pending)}</p>${data.external?'<p class="vx-readiness-warning">Depende de integração ou homologação externa.</p>':''}<small>Revisado em ${e(data.reviewedAt)} · Não é homologação do produto</small></div></details>`;
}
function annotateLegacyStatus(){
 const root=document.getElementById('main');if(!root||root.querySelector('.vx-ent-app'))return;
 const title=root.querySelector('.vx-cmd-header h1,.vx-people-premium-hero h1,.vx-people-hero h1,.vx-org-hero h1,.page-heading h1,.profile-heading h1');
 if(!title||title.parentElement?.querySelector('.vx-readiness'))return;
 const value=(title.textContent||'').toLocaleLowerCase('pt-BR');
 const active=document.querySelector('#sidebar .nav-item.active')?.id||'';
 let id=null;
 if(/visão geral|visao geral|central de comando|painel/.test(value)||/nav-overview|nav-command/.test(active))id='central';
 else if(/colaborador|pessoas|talentos|perfil/.test(value)||/nav-people/.test(active))id='people';
 else if(/organiza|equipe|hierarquia/.test(value)||/nav-org/.test(active))id='organization';
 else if(/relatório|relatorio/.test(value)||/nav-reports/.test(active))id='reports';
 else if(/contrato|obrigação|obrigacao/.test(value)||/nav-contract|nav-obligation/.test(active))id='contracts';
 else if(/documento|pasta/.test(value))id='documents';
 else if(/cargo|centro de custo|equipe/.test(value)||/nav-(team|position|cost)/.test(active))id='catalogs';
 if(!id)return;
 title.insertAdjacentHTML('afterend',`<span class="vx-legacy-readiness-row">${readinessMarkup(legacyReadiness[id])}</span>`);
}
function installReadinessObserver(){
 const main=document.getElementById('main');if(!main||main.dataset.vxReadinessWatch)return;
 main.dataset.vxReadinessWatch='true';
 const observer=new MutationObserver(()=>annotateLegacyStatus());
 observer.observe(main,{childList:true,subtree:true});annotateLegacyStatus();
}
const addedGroups=[
 ['strategy','DIREÇÃO & INTELIGÊNCIA',['strategy','scenarios']],
 ['commercial','COMERCIAL & CLIENTES',['clients','crm','products','proposals','orders','marketing','support']],
 ['supply','SUPRIMENTOS & PATRIMÔNIO',['quotes','inventory','assets','maintenance','fleet']],
 ['tax','FISCAL & REGULARIDADE',['tax','compliance','certificates','notices','licenses','radar','legal','regularization']],
 ['risk','GOVERNANÇA & RISCOS',['risk','audits','policies','privacy']],
 ['platform','PLATAFORMA & AUTOMAÇÃO',['approvals','tasks','automations']],
];
const additional={
 'people-talent':['payroll','sst'],
 'operations':['posts','measurements','quality'],
 'finance':['billing','budgets','accounting']
};
const special=new Set(['documents','cash','cost','access','config','integrations']);
const statuses=['Rascunho','Pendente','Em andamento','Em análise','Aguardando aprovação','Aguardando terceiros','Bloqueado','Concluído','Cancelado','Ativo','Inativo','A verificar','Regularização pendente','Validado','Pago','Recebido'];
const priorities=['Baixa','Normal','Alta','Crítica'];
const moneyModules=new Set(['payments','billing','budgets','quotes','purchases','proposals','orders','assets','crm','tax','payroll','maintenance','projects','strategy']);
const regulatedModules=new Set(['tax','compliance','certificates','notices','licenses','radar','legal','regularization','payroll','sst']);
const e=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmtDate=s=>!s?'—':(/^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(0,10).split('-').reverse().join('/'):String(s));
const fmtMoney=n=>n==null?'—':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)/100);
const opKey=()=>{const bytes=new Uint8Array(18);crypto.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');};
let current=null,ctx=null,view={query:'',status:'',archived:false,page:1},currentData=null,serial=0,activeCompanyLabel='Empresa principal';
function navButton(id){const m=catalog[id];return `<button type="button" id="nav-plan-${e(id)}" class="nav-item" data-action="planned-module" data-module="${e(id)}" data-icon="${e(m.icon)}" data-tooltip="${e(m.title)}" aria-label="${e(m.title)}"><span class="nav-text">${e(m.title)}</span></button>`;}
function install(){
 const nav=document.querySelector('#sidebar nav');if(!nav)return;
 for(const [group,ids] of Object.entries(additional)){
  const target=document.getElementById('nav-group-'+group);if(!target)continue;
  target.insertAdjacentHTML('beforeend',ids.filter(id=>!document.getElementById('nav-plan-'+id)).map(navButton).join(''));
 }
 const final=document.getElementById('nav-group-connect')?.closest('section.nav-group');
 for(const [key,title,ids] of addedGroups){
  const body=`<section class="nav-group" data-default-collapsed="true" data-nav-group="${e(key)}"><button type="button" class="nav-group-toggle" data-nav-group-toggle aria-expanded="false" aria-controls="nav-group-${e(key)}"><span>${e(title)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="nav-group-items" id="nav-group-${e(key)}" hidden>${ids.map(navButton).join('')}</div></section>`;
  if(final)final.insertAdjacentHTML('beforebegin',body);else nav.insertAdjacentHTML('beforeend',body);
 }
 document.querySelectorAll('[data-action="planned-module"]').forEach(button=>{
  const title=button.getAttribute('aria-label')||catalog[button.dataset.module]?.title;
  if(title)button.dataset.tooltip=title;
 });
}
function notify(message,error=false){const toast=document.getElementById('toast');if(toast){toast.textContent=message;toast.classList.toggle('error',error);toast.hidden=false;setTimeout(()=>{toast.hidden=true;},4500);}}
function wrap(header,body){return `<section class="vx-ent-app" data-vx-area="${e(areaToken(header.group))}" aria-labelledby="vx-ent-title"><header class="vx-ent-hero"><div class="vx-ent-brand">VELOX · INTELIGÊNCIA EMPRESARIAL</div><div class="vx-ent-title-line"><h1 id="vx-ent-title">${e(header.title)}</h1>${readinessMarkup(readiness[header.id])}</div><p>${e(header.description)}</p><div class="vx-ent-hero-meta"><span>${e(header.group)}</span><span>Base interna</span><span>Empresa: ${e(activeCompanyLabel)}</span></div></header>${body}</section>`;}
function empty(title,description){return `<div class="vx-ent-empty"><div class="vx-ent-empty-symbol" aria-hidden="true">◇</div><strong>${e(title)}</strong><p>${e(description)}</p></div>`;}
function table(items){return `<div class="vx-ent-table-wrap"><table class="vx-ent-table"><thead><tr><th>REGISTRO</th><th>SITUAÇÃO</th><th>PRIORIDADE</th><th>RESPONSÁVEL</th><th>VENCIMENTO</th><th>${moneyModules.has(current)?'VALOR':'INÍCIO'}</th><th>AÇÕES</th></tr></thead><tbody>${items.map(r=>`<tr><td><strong>${e(r.titulo)}</strong><small>${e(r.categoria||'')}${r.referencia?' · '+e(r.referencia):''}</small></td><td><span class="vx-ent-status">${e(r.status)}</span>${r.arquivadoEm?'<small>Arquivado</small>':''}</td><td>${e(r.prioridade||'Normal')}</td><td>${e(r.responsavel||'Não atribuído')}</td><td>${e(fmtDate(r.vencimento))}</td><td>${moneyModules.has(current)?fmtMoney(r.valorCentavos):e(fmtDate(r.inicio))}</td><td><div class="vx-ent-actions"><button type="button" data-vx-action="inspect" data-id="${e(r.id)}">Detalhes</button><button type="button" data-vx-action="followup" data-id="${e(r.id)}" ${r.arquivadoEm?'disabled':''}>Tarefa</button><button type="button" data-vx-action="edit" data-id="${e(r.id)}" ${r.arquivadoEm?'disabled':''}>Editar</button><button type="button" data-vx-action="${r.arquivadoEm?'restore':'archive'}" data-id="${e(r.id)}">${r.arquivadoEm?'Restaurar':'Arquivar'}</button></div></td></tr>`).join('')}</tbody></table></div>`;}
function rowStats(items){const live=items.filter(r=>!r.arquivadoEm);const open=live.filter(r=>!['Concluído','Cancelado','Pago','Recebido','Validado'].includes(r.status));const now=new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});const late=open.filter(r=>r.vencimento&&r.vencimento<now).length;const total=live.reduce((v,r)=>v+(Number(r.valorCentavos)||0),0);return {open:open.length,late,total,live:live.length};}
function countsHtml(rows,meta){const s=rowStats(rows);const items=[['Registros encontrados',meta.total,'Base consultada'],['Acompanhamentos abertos',s.open,'Nesta página'],['Prazos vencidos',s.late,'Nesta página'],[moneyModules.has(current)?'Valores cadastrados':'Registros concluídos',moneyModules.has(current)?(s.live?fmtMoney(s.total):'—'):rows.filter(r=>r.status==='Concluído').length,moneyModules.has(current)?'Soma nesta página':'Nesta página']];return `<section class="vx-ent-metrics">${items.map((x,i)=>`<article class="vx-ent-kpi vx-ent-kpi-${i}"><span>${e(x[0])}</span><strong>${e(x[1])}</strong><small>${e(x[2])}</small></article>`).join('')}</section>`;}
function chart(items){const groups=['Rascunho','Pendente','Em andamento','Em análise','Aguardando aprovação','Bloqueado','Concluído'];const values=groups.map(k=>items.filter(r=>r.status===k).length);const max=Math.max(1,...values);return `<section class="vx-ent-chart-card"><div class="vx-ent-chart-head"><div><h2>Distribuição dos registros</h2><p>Contagem extraída dos registros desta página</p></div><span>● Dados internos</span></div><div class="vx-ent-chart-bars">${groups.map((g,i)=>`<div class="vx-ent-chart-col"><div class="vx-ent-bar-shell"><div class="vx-ent-bar" style="height:${Math.round(values[i]/max*100)}%" data-bar="${i}"></div></div><strong>${values[i]}</strong><small>${e(g)}</small></div>`).join('')}</div></section>`;}
function rootNode(){return document.getElementById('vx-workspace-root');}
function renderList(result){const root=rootNode();if(!root||current!==result.module)return;currentData=result;const m=catalog[current],items=result.items||[];
 const regulated=regulatedModules.has(current)?'<div class="vx-ent-warning">Informações cadastradas internamente. Nenhuma consulta, regularidade ou emissão oficial é presumida; valide as evidências nos órgãos competentes.</div>':'';
 const control=`<div class="vx-ent-toolbar"><label class="vx-ent-search"><span>Localizar</span><input type="search" id="vx-ent-query" value="${e(view.query)}" maxlength="120" placeholder="Pesquisar título, responsável ou referência"></label><label><span>Situação</span><select id="vx-ent-status-filter"><option value="">Todas</option>${statuses.map(s=>`<option value="${e(s)}" ${s===view.status?'selected':''}>${e(s)}</option>`).join('')}</select></label><label class="vx-ent-check"><input type="checkbox" id="vx-ent-archived" ${view.archived?'checked':''}> Incluir arquivados</label><button type="button" class="vx-ent-primary" data-vx-action="new">+ Novo registro</button></div>`;
 const inner=`${regulated}${countsHtml(items,result)}<div class="vx-ent-grid">${chart(items)}<section class="vx-ent-insight"><div class="vx-ent-insight-dot"></div><h2>Visão do módulo</h2><p>${e(m.description)}. Informações vinculadas à operação interna.</p><div class="vx-ent-insight-tag">${result.total} registro(s) encontrado(s)</div></section></div><section class="vx-ent-table-card"><div class="vx-ent-table-head"><h2>Registros e acompanhamento</h2><button type="button" data-vx-action="csv">Exportar CSV</button></div>${control}${items.length?table(items):empty('Nenhum registro encontrado','Cadastre a primeira atividade ou ajuste os filtros para consultar os registros existentes.')}<footer class="vx-ent-pagination"><span>Página ${result.page} de ${result.pages} · ${result.total} registro(s)</span><div><button data-vx-action="page" data-page="${result.page-1}" ${result.page<=1?'disabled':''}>Anterior</button><button data-vx-action="page" data-page="${result.page+1}" ${result.page>=result.pages?'disabled':''}>Próxima</button></div></footer></section><p class="vx-ent-provenance">Fonte: registros do próprio VeloX. Controles especializados e integrações externas serão liberados somente após validação funcional e de segurança.</p>`;
 root.innerHTML=wrap(m,inner);
 if(current==='certificates'){
  const inView=current;
  ctx.api('workspace.regularity').then(r=>{
   if(current!==inView||!root.isConnected)return;
   const section=document.createElement('section');section.className='vx-ent-panel vx-ent-regularity-summary';
   section.innerHTML=`<h2>Certidões e conferências registradas</h2><p>${e(r.source)}</p><div class="vx-ent-finance"><article><span>Conferidas manualmente dentro da validade informada</span><strong>${r.conferidasManualmente}</strong></article><article><span>Vencidas</span><strong>${r.vencidas}</strong></article><article><span>Irregularidades informadas</span><strong>${r.irregularesInformadas}</strong></article><article><span>Sem confirmação</span><strong>${r.semConfirmacao}</strong></article></div>${r.desconhecido?'<p>Não há certidões cadastradas. Isso NÃO significa regularidade fiscal.</p>':''}`;
   root.querySelector('.vx-ent-table-card')?.insertAdjacentElement('beforebegin',section);
  }).catch(()=>{});
 }
}
async function refresh(){const chosen=current;const root=rootNode();if(!root)return;const id=++serial;root.innerHTML=wrap(catalog[chosen],'<div class="vx-ent-loading" role="status">Consultando registros empresariais…</div>');try{const result=await ctx.api('workspace.list',{module:chosen,query:view.query,status:view.status,includeArchived:view.archived,page:view.page,pageSize:25});if(id!==serial||chosen!==current||!root.isConnected)return;renderList(result);}catch(err){if(id!==serial)return;root.innerHTML=wrap(catalog[chosen],empty('Não foi possível consultar os registros',err.message||'Confira o ambiente de acesso.'));}}
function input(name,label,value='',type='text',extra=''){return `<label class="vx-ent-field"><span>${e(label)}</span><input name="${e(name)}" type="${e(type)}" value="${e(value)}" ${extra}></label>`;}
function formField(spec,record){
 const value=record?.detalhes?.[spec.key];
 const name='detail:'+spec.key;
 if(spec.type==='enum')return `<label class="vx-ent-field"><span>${e(spec.label)}</span><select name="${e(name)}"><option value="">Não informado</option>${spec.rule.map(o=>`<option value="${e(o)}" ${o===value?'selected':''}>${e(o)}</option>`).join('')}</select></label>`;
 const types={date:'date',month:'month',email:'email',url:'url',integer:'number',money:'number'};
 const type=types[spec.type]||'text';
 const show=spec.type==='money'?(value==null?'':(Number(value)/100).toFixed(2)):(value??'');
 const extra=spec.type==='integer'?`min="0" max="${Number(spec.rule)||100}" step="1"`:spec.type==='money'?`min="0" max="${Number(spec.rule)||9999999999}" step="0.01"`:spec.type==='url'?'maxlength="400" pattern="https://.*"':`maxlength="${Number(spec.rule)||400}"`;
 return input(name,spec.label,show,type,extra);
}
async function formDialog(rec={}){
 const m=catalog[current];if(!m)return;
 let schema;
 try{schema=await ctx.api('workspace.schema',{module:current});}catch(error){return notify('Não foi possível abrir os campos do módulo: '+error.message,true);}
 if(current!==m.id)return;
 document.getElementById('vx-enterprise-dialog')?.remove();const dialog=document.createElement('dialog');dialog.id='vx-enterprise-dialog';dialog.className='vx-ent-dialog';
 const mandatory=regulatedModules.has(current)?'<p class="vx-ent-warning">Registro interno. Certidões, tributos e comunicações oficiais exigem conferência efetiva no órgão competente e evidências válidas.</p>':'';
 const select=(name,label,options,selected)=>`<label class="vx-ent-field"><span>${e(label)}</span><select name="${e(name)}">${options.map(o=>`<option value="${e(o)}" ${o===selected?'selected':''}>${e(o)}</option>`).join('')}</select></label>`;
 const specific=(schema.fields||[]).map(field=>formField(field,rec)).join('');
 dialog.innerHTML=`<form method="dialog" id="vx-ent-form"><header><div><small>${e(m.group)}</small><h2>${rec.id?'Editar registro':'Novo registro'} · ${e(m.title)}</h2></div><button type="button" data-vx-action="close" aria-label="Fechar" class="vx-ent-x">×</button></header><div class="vx-ent-dialog-body">${mandatory}<div id="vx-ent-form-error" role="alert" hidden></div><div class="vx-ent-form-grid">${input('titulo','Título do registro',rec.titulo,'text','required minlength="3" maxlength="160"')}${input('categoria',current==='payments'?'Tipo de lançamento (Receita ou Despesa)':'Categoria / tipo',rec.categoria||'','text',`maxlength="100" ${current==='payments'?'required pattern="Receita|Despesa" title="Use Receita ou Despesa"':''}`)}${select('status','Situação',statuses,rec.status||'Pendente')}${select('prioridade','Prioridade',priorities,rec.prioridade||'Normal')}${input('responsavel','Responsável',rec.responsavel,'text','maxlength="140"')}${input('vencimento','Vencimento',rec.vencimento,'date')}${input('inicio','Início',rec.inicio,'date')}${input('fim','Fim',rec.fim,'date')}${input('referencia','Identificador / referência',rec.referencia,'text','maxlength="120"')}${moneyModules.has(current)?input('valor','Valor em R$ (opcional)',rec.valorCentavos==null?'':(rec.valorCentavos/100).toFixed(2),'number','min="0" max="9999999999" step="0.01"'):''}${input('fonte','Fonte ou documento de referência',rec.fonte,'text','maxlength="300"')}</div>${specific?`<h3 class="vx-ent-subheading">Informações específicas · ${e(m.title)}</h3><div class="vx-ent-form-grid">${specific}</div>`:''}<label class="vx-ent-field"><span>Descrição e observações</span><textarea name="descricao" maxlength="2000" rows="4">${e(rec.descricao||'')}</textarea></label></div><footer><button type="button" data-vx-action="close">Cancelar</button><button type="submit" class="vx-ent-primary">Salvar registro</button></footer></form>`;
 document.body.appendChild(dialog);dialog.showModal();const form=dialog.querySelector('form');dialog.addEventListener('close',()=>dialog.remove(),{once:true});
 form.addEventListener('submit',async ev=>{
  ev.preventDefault();if(!form.reportValidity())return;
  const submit=form.querySelector('[type="submit"]'),error=form.querySelector('#vx-ent-form-error');submit.disabled=true;error.hidden=true;
  const values={},detalhes={};for(const [key,value] of new FormData(form)){if(key.startsWith('detail:'))detalhes[key.slice(7)]=value;else values[key]=value;}
  if(regulatedModules.has(current)&&values.status==='Validado'&&!String(values.fonte||'').trim()){
   error.textContent='Para marcar como validado, informe a fonte ou evidência verificada.';error.hidden=false;submit.disabled=false;return;
  }
  try{await ctx.api('workspace.save',{...values,detalhes,module:current,id:rec.id,versao:rec.versao,chaveOperacao:opKey()});dialog.close();view.page=1;await refresh();notify('Registro salvo e auditado.');}
  catch(ex){error.textContent=ex.message||'Falha ao salvar';error.hidden=false;submit.disabled=false;}
 });
}
async function inspect(id){
 let result,spec;
 try{[result,spec]=await Promise.all([ctx.api('workspace.get',{id}),ctx.api('workspace.schema',{module:current})]);}catch(error){return notify(error.message,true);}
 const r=result.record;
 document.getElementById('vx-ent-detail-dialog')?.remove();const d=document.createElement('dialog');d.id='vx-ent-detail-dialog';d.className='vx-ent-dialog';
 const fields=[['Situação',r.status],['Prioridade',r.prioridade],['Responsável',r.responsavel],['Vencimento',fmtDate(r.vencimento)],['Categoria',r.categoria],['Valor cadastrado',r.valorCentavos==null?'—':fmtMoney(r.valorCentavos)],['Fonte informada',r.fonte],...(spec.fields||[]).map(x=>[x.label,x.type==='money'?(r.detalhes?.[x.key]==null?'—':fmtMoney(r.detalhes[x.key])):r.detalhes?.[x.key]])];
 const linked=[...(result.parent?[{...result.parent,tipo:'Origem'}]:[]),...(result.related||[]).map(x=>({...x,tipo:x.module==='tasks'?'Acompanhamento':'Próxima etapa'}))];
 const advanceButtons=(result.next||[]).filter(x=>!x.alreadyCreated&&!r.arquivadoEm).map(x=>`<button type="button" class="vx-ent-flow-btn" data-vx-action="advance" data-id="${e(r.id)}" data-versao="${e(r.versao)}" data-module="${e(x.module)}">Criar rascunho: ${e(catalog[x.module]?.title||x.module)}</button>`).join('');
 d.innerHTML=`<section><header><div><small>${e(catalog[r.module]?.title||'Registro empresarial')}</small><h2>${e(r.titulo)}</h2></div><button type="button" data-vx-action="close" aria-label="Fechar" class="vx-ent-x">×</button></header><div class="vx-ent-dialog-body"><div class="vx-ent-detail-list">${fields.filter(x=>x[1]!==undefined&&x[1]!==null&&x[1]!=='').map(([label,v])=>`<div><small>${e(label)}</small><strong>${e(v)}</strong></div>`).join('')}</div>${r.descricao?`<p>${e(r.descricao)}</p>`:''}<h3>Fluxo e registros relacionados</h3>${linked.length?linked.map(x=>`<p><strong>${e(x.tipo)}</strong> · <button type="button" class="vx-ent-related" data-vx-action="open-related" data-id="${e(x.id)}" data-module="${e(x.module)}">${e(catalog[x.module]?.title||x.module)} · ${e(x.titulo)}</button> (${e(x.status)})</p>`).join(''):'<p>Este registro ainda não possui outros registros relacionados.</p>'}${advanceButtons?`<h3>Próximas etapas disponíveis</h3><p>Cria apenas um rascunho relacionado; nenhuma ação externa é executada.</p><div class="vx-ent-flow-actions">${advanceButtons}</div>`:''}<h3>Histórico auditado</h3>${result.history.length?result.history.map(x=>`<p>${e(fmtDate(x.data))} · ${e(x.evento)} · ${e(x.usuario)}</p>`).join(''):'<p>Nenhum evento de alteração disponível.</p>'}</div><footer><button type="button" data-vx-action="close">Fechar</button></footer></section>`;
 document.body.appendChild(d);d.showModal();d.addEventListener('close',()=>d.remove(),{once:true});
}
async function followup(id){
 const r=currentData?.items?.find(x=>x.id===id);
 if(!r||r.arquivadoEm)return notify('Não é possível criar tarefa neste registro.',true);
 document.getElementById('vx-followup-dialog')?.remove();
 const dialog=document.createElement('dialog');dialog.id='vx-followup-dialog';dialog.className='vx-ent-dialog';
 dialog.innerHTML=`<form method="dialog"><header><div><small>ACOMPANHAMENTO</small><h2>Criar tarefa vinculada</h2></div><button type="button" data-vx-action="close" aria-label="Fechar" class="vx-ent-x">×</button></header><div class="vx-ent-dialog-body"><p>Origem: ${e(r.titulo)}</p><div id="vx-followup-error" role="alert" hidden></div>${input('titulo','O que precisa ser feito?',('Conferir: '+r.titulo).slice(0,150),'text','required minlength="3" maxlength="160"')}${input('responsavel','Responsável',r.responsavel||'','text','maxlength="140"')}${input('vencimento','Prazo da tarefa',r.vencimento||'','date')}</div><footer><button type="button" data-vx-action="close">Cancelar</button><button class="vx-ent-primary" type="submit">Criar tarefa</button></footer></form>`;
 document.body.appendChild(dialog);dialog.showModal();dialog.addEventListener('close',()=>dialog.remove(),{once:true});
 dialog.querySelector('form').addEventListener('submit',async ev=>{
  ev.preventDefault();const form=ev.currentTarget;if(!form.reportValidity())return;
  const button=form.querySelector('[type="submit"]'),error=form.querySelector('[role="alert"]');button.disabled=true;
  const values=Object.fromEntries(new FormData(form));
  try{await ctx.api('workspace.followup',{id,...values,chaveOperacao:opKey()});dialog.close();notify('Tarefa vinculada e registrada no histórico.');}
  catch(ex){error.textContent=ex.message||'Falha ao criar tarefa';error.hidden=false;button.disabled=false;}
 });
}
async function archive(id,restore){const row=currentData?.items?.find(r=>r.id===id);if(!row)return;const reason=restore?'':prompt('Motivo do arquivamento (obrigatório):');if(!restore&&(!reason||reason.trim().length<3))return;const choice=confirm(restore?'Restaurar este registro?':'Arquivar este registro? O histórico será preservado.');if(!choice)return;try{await ctx.api(restore?'workspace.restore':'workspace.archive',{id,versao:row.versao,motivo:reason,confirmado:true,chaveOperacao:opKey()});await refresh();notify('Registro atualizado com sucesso.');}catch(error){notify(error.message,true);}}
function exportCsv(){if(!currentData?.items?.length)return notify('Não há registros nesta página para exportar.',true);const rows=[['Título','Situação','Prioridade','Responsável','Vencimento','Categoria','Valor (R$)','Referência'],...currentData.items.map(r=>[r.titulo,r.status,r.prioridade,r.responsavel,r.vencimento,r.categoria,r.valorCentavos==null?'':(r.valorCentavos/100).toFixed(2),r.referencia])];const quote=s=>{let v=String(s??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';};const csv='\ufeff'+rows.map(r=>r.map(quote).join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='velox-'+current+'-'+new Date().toISOString().slice(0,10)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
async function specialView(id){const root=rootNode();if(!root)return;const m=catalog[id];if(id==='cash'){
 const r=await ctx.api('workspace.cash');const cards=[['Recebimentos informados',r.confirmedIn],['Pagamentos informados',r.confirmedOut],['Movimento líquido informado',r.net],['A receber informado',r.pendingIn],['A pagar informado',r.pendingOut]];
 const max=Math.max(1,...(r.months||[]).flatMap(m=>[m.recebido,m.pago]));
 const graph=(r.months||[]).map(x=>`<div class="vx-ent-cash-month"><div class="vx-ent-cash-bars"><span class="vx-ent-cash-in" title="Recebido: ${e(fmtMoney(x.recebido))}" style="height:${Math.round(x.recebido/max*100)}%"></span><span class="vx-ent-cash-out" title="Pago: ${e(fmtMoney(x.pago))}" style="height:${Math.round(x.pago/max*100)}%"></span></div><small>${e(x.month.slice(5))}/${e(x.month.slice(2,4))}</small></div>`).join('');
 root.innerHTML=wrap(m,`<div class="vx-ent-warning">${e(r.source)}</div><section class="vx-ent-finance">${cards.map(([label,n])=>`<article><span>${e(label)}</span><strong>${fmtMoney(n)}</strong></article>`).join('')}</section><section class="vx-ent-panel"><h2>Movimentação registrada · últimos 6 meses</h2><p>Somente baixas com data e comprovante informados. <span class="vx-ent-finance-legend"><i></i> Recebimentos <b></b> Pagamentos</span></p><div class="vx-ent-cash-chart" role="img" aria-label="Gráfico dos lançamentos financeiros informados por mês">${graph}</div></section><section class="vx-ent-panel"><h2>Conferência financeira</h2><p>${r.entries?'Visão derivada dos registros financeiros.':'Ainda não há lançamentos financeiros cadastrados.'} Para visualizar a movimentação ou adicionar um lançamento, abra Contas a Pagar e Receber.</p><button type="button" data-action="planned-module" data-module="payments" class="vx-ent-primary">Abrir lançamentos financeiros</button></section>`);return;
 }
 if(id==='documents'){
 const data=await ctx.api('workspace.documents',{query:view.query,page:view.page});root.innerHTML=wrap(m,`<section class="vx-ent-panel"><h2>Biblioteca vinculada</h2><p>Documentos existentes associados a pessoas, contratos e obrigações. O acesso e a abertura permanecem vinculados ao registro de origem.</p><label class="vx-ent-field"><span>Pesquisar documentos</span><input type="search" id="vx-ent-doc-query" value="${e(view.query)}" placeholder="Nome do arquivo, pessoa ou registro"></label>${data.items.length?`<div class="vx-ent-table-wrap"><table class="vx-ent-table"><thead><tr><th>ARQUIVO</th><th>ORIGEM</th><th>REGISTRO</th><th>ENVIADO</th><th>AÇÃO</th></tr></thead><tbody>${data.items.map(d=>`<tr><td>${e(d.nome)}</td><td>${e(d.escopo)}</td><td>${e(d.registro)}</td><td>${e(fmtDate(d.enviadoEm))}</td><td><button type="button" data-vx-action="open-document" data-id="${e(d.id)}">Abrir origem</button></td></tr>`).join('')}</tbody></table></div>`:empty('Nenhum documento encontrado','Anexe documentos pelos cadastros de pessoas, contratos ou obrigações.')}<footer class="vx-ent-pagination"><span>Página ${data.page} de ${data.pages} · ${data.total} arquivos</span><div><button data-vx-action="page" data-page="${data.page-1}" ${data.page<=1?'disabled':''}>Anterior</button><button data-vx-action="page" data-page="${data.page+1}" ${data.page>=data.pages?'disabled':''}>Próxima</button></div></footer></section>`);currentData=data;return;
 }
 if(id==='cost'){
 const b=await ctx.api('bootstrap');const items=b.centrosCusto||[];root.innerHTML=wrap(m,`<section class="vx-ent-panel"><h2>Centros de custo cadastrados</h2><p>Fonte única compartilhada com os cadastros de Pessoas e Organização.</p>${items.length?`<div class="vx-ent-table-wrap"><table class="vx-ent-table"><thead><tr><th>NOME</th><th>CÓDIGO</th><th>SITUAÇÃO</th></tr></thead><tbody>${items.map(i=>`<tr><td>${e(i.nome)}</td><td>${e(i.codigo||'—')}</td><td>${i.ativo===false?'Inativo':'Ativo'}</td></tr>`).join('')}</tbody></table></div>`:empty('Nenhum centro de custo cadastrado','Inicie pelo cadastro único da organização.')}<button type="button" class="vx-ent-primary" data-action="catalog" data-type="centroCusto">Gerenciar centros de custo</button></section>`);return;
 }
 if(id==='access'){
 const [b,companies]=await Promise.all([ctx.api('bootstrap'),ctx.api('company.list')]);
 const selected=companies.companies.find(c=>c.id===companies.selectedId);
 const scopeNote=companies.selectedId!=='company-primary'?'Os cadastros antigos de Pessoas, Contratos e Documentos permanecem exclusivamente na empresa principal e ficam indisponíveis aqui. Os novos módulos empresariais são separados.':'Seus cadastros existentes foram mantidos na empresa principal, sem migração ou exclusão.';
 root.innerHTML=wrap(m,`<section class="vx-ent-panel"><h2>Acesso autenticado e ambientes</h2><p><strong>${e(b.usuario?.nome||'Conta proprietária')}</strong> · ${e(b.usuario?.perfil||'Proprietário')}</p><p>Empresa selecionada: <strong>${e(selected?.nome||'Empresa principal')}</strong></p><div class="vx-ent-warning">${e(scopeNote)}</div><h3>Empresas cadastradas</h3><div class="vx-ent-company-grid">${companies.companies.map(c=>`<article class="vx-ent-company-card"><strong>${e(c.nome)}</strong><small>${e(c.documento||'Documento não informado')} · ${c.principal?'Empresa principal':'Novo ambiente empresarial'}</small><div>${c.id===companies.selectedId?'<span class="vx-ent-company-active">Selecionada</span>':`<button type="button" data-vx-action="company-select" data-id="${e(c.id)}" class="vx-ent-company-btn">Selecionar empresa</button>`}</div></article>`).join('')}</div><div class="vx-ent-company-actions"><button type="button" class="vx-ent-primary" data-vx-action="company-new">+ Cadastrar empresa</button></div><div class="vx-ent-warning">Multiusuário e convites não estão habilitados. Apenas a conta proprietária autenticada pode administrar empresas. A separação desta versão abrange os novos registros empresariais; a migração segura dos cadastros antigos é uma etapa futura.</div></section>`);return;
 }
 if(id==='config'){
 const b=await ctx.api('management.bootstrap');const p=b.preferences||{};root.innerHTML=wrap(m,`<section class="vx-ent-panel"><h2>Preferências efetivas</h2><div class="vx-ent-finance"><article><span>Antecedência de obrigações</span><strong>${e(p.antecedenciaDias??7)} dias</strong></article><article><span>Avisos de experiência</span><strong>${e(p.experienciaDias??7)} dias</strong></article></div><p>Estas preferências são compartilhadas com o mecanismo atual de alertas.</p><button type="button" class="vx-ent-primary" data-action="alert-preferences">Configurar alertas</button></section>`);return;
 }
 if(id==='integrations'){
 const b=await ctx.api('bootstrap');const sites=b.sites||[];root.innerHTML=wrap(m,`<section class="vx-ent-panel"><h2>Conexões cadastradas</h2><p>Os atalhos externos não equivalem a uma integração de dados ou a uma conexão autenticada entre sistemas.</p>${sites.length?`<div class="vx-ent-links">${sites.map(s=>`<a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.nome||s.url)} ↗</a>`).join('')}</div>`:empty('Nenhum atalho externo cadastrado','Os serviços poderão ser cadastrados por meio da área Aplicativos e Conexões.')}<button type="button" class="vx-ent-primary" data-vx-action="sites">Gerenciar aplicativos e conexões</button><div class="vx-ent-warning">APIs, pagamentos, consulta fiscal e comunicação oficial exigem integrações autorizadas e não são executadas por este módulo.</div></section>`);return;
 }
}
async function open(id,options){if(!catalog[id])throw Error('Módulo não identificado.');ctx=options;try{const c=await options.api('company.list');activeCompanyLabel=c.companies.find(x=>x.id===c.selectedId)?.nome||'Empresa principal';}catch(_){activeCompanyLabel='Empresa principal';}current=id;currentData=null;view={query:'',status:'',archived:false,page:1};const root=rootNode();if(!root)return;root.innerHTML=wrap(catalog[id],'<div class="vx-ent-loading" role="status">Carregando módulo…</div>');if(special.has(id)){
 const active=id,token=++serial;try{await specialView(id);}catch(ex){if(token!==serial||current!==active)return;root.innerHTML=wrap(catalog[id],empty('Não foi possível abrir o módulo',ex.message));}return;
 }return refresh();}
function setFilter(){view.query=document.getElementById('vx-ent-query')?.value?.trim()||document.getElementById('vx-ent-doc-query')?.value?.trim()||'';view.status=document.getElementById('vx-ent-status-filter')?.value||'';view.archived=document.getElementById('vx-ent-archived')?.checked||false;view.page=1;return special.has(current)?specialView(current):refresh();}
async function companyDialog(){
 document.getElementById('vx-company-dialog')?.remove();const dialog=document.createElement('dialog');dialog.id='vx-company-dialog';dialog.className='vx-ent-dialog';
 dialog.innerHTML=`<form method="dialog"><header><div><small>AMBIENTES DO VELOX</small><h2>Cadastrar empresa</h2></div><button type="button" data-vx-action="close" class="vx-ent-x" aria-label="Fechar">×</button></header><div class="vx-ent-dialog-body"><div role="alert" hidden id="vx-company-error"></div><p>A nova empresa terá registros empresariais separados da empresa principal. Os cadastros legados não serão copiados.</p>${input('nome','Nome da empresa ou razão social','','text','required minlength="3" maxlength="160"')}${input('documento','CNPJ ou identificação (opcional)','','text','maxlength="32"')}</div><footer><button type="button" data-vx-action="close">Cancelar</button><button class="vx-ent-primary" type="submit">Cadastrar empresa</button></footer></form>`;
 document.body.appendChild(dialog);dialog.showModal();dialog.addEventListener('close',()=>dialog.remove(),{once:true});
 dialog.querySelector('form').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const button=form.querySelector('[type=submit]');button.disabled=true;
  const values=Object.fromEntries(new FormData(form));
  try{await ctx.api('company.save',{...values,chaveOperacao:opKey()});dialog.close();notify('Empresa cadastrada. Os dados anteriores foram preservados.');await open('access',ctx);}catch(error){const out=form.querySelector('#vx-company-error');out.textContent=error.message||'Falha ao cadastrar empresa';out.hidden=false;button.disabled=false;}
 });
}
async function companySelect(id){
 const companies=await ctx.api('company.list');const entry=companies.companies.find(c=>c.id===id);
 if(!entry)return notify('Empresa não encontrada.',true);
 if(!confirm('Selecionar '+entry.nome+'? Os módulos antigos ficam disponíveis somente na empresa principal.'))return;
 try{await ctx.api('company.select',{id,chaveOperacao:opKey()});location.reload();}catch(error){notify(error.message||'Falha ao trocar empresa',true);}
}
function onClick(ev){const target=ev.target.closest('[data-vx-action]');if(!target)return;ev.preventDefault();const action=target.dataset.vxAction;if(action==='close'){target.closest('dialog')?.close();return;}
 if(action==='sites'){document.querySelector('.external-trigger')?.click();return;}
 if(action==='company-new')return companyDialog();
 if(action==='company-select')return companySelect(target.dataset.id);
 if(!rootNode()||!current)return;
 if(action==='new')return formDialog();
 if(action==='inspect')return inspect(target.dataset.id);
 if(action==='followup')return followup(target.dataset.id);
 if(action==='open-related'){
   const destination=target.dataset.module,recordId=target.dataset.id;
   document.getElementById('vx-ent-detail-dialog')?.close();
   return open(destination,ctx).then(()=>inspect(recordId)).catch(err=>notify(err.message,true));
 }
 if(action==='advance'){
   const id=target.dataset.id,destination=target.dataset.module;
   if(!confirm('Criar somente um rascunho em '+(catalog[destination]?.title||destination)+'? Nenhum processo externo será executado.'))return;
   target.disabled=true;
   return ctx.api('workspace.advance',{id,destination,versao:Number(target.dataset.versao),confirmado:true,chaveOperacao:opKey()})
    .then(result=>{document.getElementById('vx-ent-detail-dialog')?.close();notify('Rascunho vinculado criado, sem execução externa.');return open(result.record.module,ctx).then(()=>inspect(result.record.id));})
    .catch(err=>{target.disabled=false;notify(err.message,true);});
 }

 if(action==='edit')return formDialog(currentData?.items.find(r=>r.id===target.dataset.id));
 if(action==='archive'||action==='restore')return archive(target.dataset.id,action==='restore');
 if(action==='csv')return exportCsv();
 if(action==='page'){view.page=Math.max(1,Number(target.dataset.page)||1);return special.has(current)?specialView(current):refresh();}
 if(action==='open-document'){const d=currentData?.items?.find(x=>x.id===target.dataset.id);if(!d)return;if(d.escopo==='Pessoa'&&d.pessoaId)global.VXSearchOpen?.person(d.pessoaId);else if(d.registroId)global.VXSearchOpen?.management(d.tipo,d.registroId);return;}
}
function onChange(ev){if(!rootNode())return;if(ev.target.matches('#vx-ent-status-filter,#vx-ent-archived'))setFilter();}
let debounce;function onInput(ev){if(!rootNode())return;if(ev.target.matches('#vx-ent-query,#vx-ent-doc-query')){clearTimeout(debounce);debounce=setTimeout(setFilter,280);}}
async function mountExecutive(api){
 const home=document.querySelector('.vx-command-center');if(!home)return;
 const existing=home.querySelector('#vx-enterprise-executive');if(existing)existing.remove();
 const section=document.createElement('section');section.id='vx-enterprise-executive';section.className='vx-ent-executive';section.innerHTML='<div class="vx-ent-executive-loading" role="status">Conferindo os processos empresariais…</div>';
 const metrics=home.querySelector('.vx-cmd-metrics');if(metrics)metrics.insertAdjacentElement('afterend',section);else home.appendChild(section);
 try{
  const [s,pipeline]=await Promise.all([api('workspace.summary'),api('workspace.pipeline')]);if(!section.isConnected)return;
  const due=(s.urgent||[]).map(r=>`<button type="button" data-action="planned-module" data-module="${e(r.module)}" class="vx-ent-action-row"><span><strong>${e(r.titulo)}</strong><small>${e(catalog[r.module]?.title||r.module)} · ${e(r.responsavel||'Responsável não informado')}</small></span><span>${e(fmtDate(r.vencimento))}</span></button>`).join('');
  section.innerHTML=`<div class="vx-ent-executive-head"><div><span>VISÃO DE PROCESSOS · FONTE INTERNA</span><h2>Prioridades de toda a empresa</h2><p>${s.hasData?'Registros e prazos informados nos módulos empresariais.':'Ainda sem registros empresariais. O sistema não presume resultados ou regularidade.'}</p></div><span class="vx-ent-pulse">● Monitoramento interno</span></div><div class="vx-ent-executive-kpis"><article><span>Registros acompanhados</span><strong>${s.total}</strong></article><article><span>Em acompanhamento</span><strong>${s.open}</strong></article><article><span>Vencidos</span><strong>${s.overdue}</strong></article><article><span>Próximos 7 dias</span><strong>${s.dueSoon}</strong></article></div><section class="vx-ent-pipelines"><h3>Processos integrados · registros cadastrados</h3><div class="vx-ent-flow-grid">${pipeline.paths.map(path=>`<article class="vx-ent-flow-card"><strong>${e(path.name)}</strong><small>${path.total} registros · ${path.stages.reduce((n,s)=>n+s.linked,0)} com origem vinculada</small><div class="vx-ent-flow-steps">${path.stages.map(s=>`<span title="${e(catalog[s.module]?.title||s.module)}: ${s.total} registro(s)">${e(catalog[s.module]?.title||s.module)} <b>${s.total}</b></span>`).join('')}</div></article>`).join('')}</div></section><div class="vx-ent-executive-bottom"><div><h3>Ações que exigem atenção</h3>${due||'<p>Nenhuma ação com prazo identificado nos registros. Isso não comprova ausência de obrigações externas.</p>'}</div><div class="vx-ent-regularity"><span>REGULARIDADE FISCAL</span><strong>Não presumida</strong><p>A confirmação depende de consulta válida e evidência oficial.</p><button type="button" data-action="planned-module" data-module="certificates">Abrir Certidões e Regularidade</button></div></div>`;
 }catch(error){if(section.isConnected)section.innerHTML='<p role="status">Processos empresariais indisponíveis nesta consulta. Os demais indicadores permanecem acessíveis.</p>';}
}

document.addEventListener('click',onClick);document.addEventListener('change',onChange);document.addEventListener('input',onInput);install();installReadinessObserver();
global.VXEnterpriseUI=Object.freeze({open,inspectRecord:inspect,mountExecutive,getModule:id=>catalog[id]||null,getReadiness:id=>readiness[id]||legacyReadiness[id]||null,READINESS_VERSION,catalog});
})(window);
