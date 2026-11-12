/**
 * Dados locais de desenvolvimento. Não se conecta a Supabase, Cloudflare nem Drive.
 * Cadastros básicos podem ser testados neste navegador. Anexos e operações
 * dependentes do backend real permanecem bloqueados até termos backend de testes.
 */
const STORAGE_KEY = 'velox.dev.local.v1';
const defaults = () => ({
  revision: 'local-1',
  pessoas: [], centrosCusto: [], equipes: [], cargos: [], sites: [],
  contratos: [], obrigacoes: [],
  preferences: {antecedenciaDias: 7, experienciaDias: 7}
});
let state = readState();
function readState() {
  try {
    const obj=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    return obj && typeof obj === 'object' ? {...defaults(),...obj} : defaults();
  } catch {return defaults();}
}
function saveState() {
  state.revision='local-'+Date.now();
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{}
}
function id(prefix) {
  return prefix+'_'+(typeof crypto!=='undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+'_'+Math.random().toString(36).slice(2));
}
const ok=data=>({ok:true,data,metrics:{local:true}});
const bad=message=>({ok:false,erro:{codigo:'SOMENTE_DESENVOLVIMENTO',mensagem:message}});
const blocked='Esta operação depende do servidor de testes. Nenhuma informação foi enviada ao sistema publicado.';
function list(type){return state[type]||[];}
function catalogKey(value){return ({centroCusto:'centrosCusto',equipe:'equipes',cargo:'cargos'})[value]||'';}
function folderFor(person, folderId='') {
  const folderIdReal=folderId||person.pastaId;
  return {id:folderIdReal,nome:'Documentos do colaborador',pastas:[],arquivos:[],
    caminho:[{id:person.pastaId,nome:'Documentos do colaborador'}]};
}
function saveEntity(type,payload,prefix) {
  const entries=list(type), previous=entries.find(v=>v.id===payload.id);
  const entity={...(previous||{}),...payload,id:payload.id||id(prefix),versao:(previous?.versao||0)+1};
  delete entity.chaveOperacao;
  const pos=entries.findIndex(v=>v.id===entity.id);
  if(pos<0)entries.push(entity);else entries[pos]=entity;
  saveState();return entity;
}
function personOf(payload) {
  const prev=state.pessoas.find(v=>v.id===payload.id);
  const source={...(prev||{}),...payload};
  const result={...source,id:payload.id||id('pessoa'),versao:(prev?.versao||0)+1,
    situacao:prev?.situacao||'Ativo',pastaId:prev?.pastaId||id('pasta')};
  delete result.chaveOperacao;
  return result;
}
export async function devCall(action,payload={}) {
  switch(action){
    case 'bootstrap':
      return ok({...state, usuario:{email:'desenvolvimento@velox.local'},atualizadoEm:new Date().toISOString()});
    case 'bootstrap.version': return ok({revision:state.revision});
    case 'people.list': return ok([...state.pessoas]);
    case 'person.get': return ok(state.pessoas.find(p=>p.id===payload.id)||null);
    case 'person.open': {
      const p=state.pessoas.find(p=>p.id===payload.id);
      return p?ok({pessoa:p,pasta:folderFor(p,payload.pastaId)}):bad('Colaborador não encontrado.');
    }
    case 'person.save': {
      const person=personOf(payload);
      const pos=state.pessoas.findIndex(p=>p.id===person.id);
      if(pos===-1)state.pessoas.push(person);else state.pessoas[pos]=person;
      saveState();return ok(person);
    }
    case 'person.terminate': {
      const p=state.pessoas.find(p=>p.id===payload.id);
      if(!p)return bad('Colaborador não encontrado.');
      p.situacao='Desligado';p.desligamento=payload.data;p.versao=(p.versao||0)+1;
      saveState();return ok(p);
    }
    case 'catalog.save': {
      const key=catalogKey(payload.tipo);
      return key?ok(saveEntity(key,payload,'catalogo')):bad('Catálogo desconhecido.');
    }
    case 'site.save': return ok(saveEntity('sites',payload,'site'));
    case 'site.delete': {
      state.sites=state.sites.filter(s=>s.id!==payload.id);saveState();return ok({aviso:'Acesso removido da base local.'});
    }
    case 'site.logo':
    case 'photo.get':
    case 'client.brand.banner': return ok(null);
    case 'folder.list': {
      const person=state.pessoas.find(p=>p.id===payload.pessoaId);
      return person?ok(folderFor(person,payload.pastaId)):bad('Colaborador não encontrado.');
    }
    case 'management.bootstrap': return ok({
      obrigacoes:state.obrigacoes, contratos:state.contratos,
      preferences:state.preferences
    });
    case 'management.get': {
      const type=payload.tipo==='contract'?'contratos':'obrigacoes';
      const record=list(type).find(o=>o.id===payload.id);
      return record?ok({record,arquivos:[],eventos:[]}):bad('Registro não encontrado.');
    }
    case 'contract.save': return ok(saveEntity('contratos',payload,'contrato'));
    case 'obligation.save': return ok(saveEntity('obrigacoes',payload,'obrigacao'));
    case 'preferences.save':
      state.preferences={...state.preferences,antecedenciaDias:Number(payload.antecedenciaDias),experienciaDias:Number(payload.experienciaDias)};
      saveState();return ok(state.preferences);
    case 'document.upload':
    case 'document.download':
    case 'folder.create':
    case 'management.upload':
    case 'management.link':
    case 'obligation.resolve': return bad(blocked);
    default: return bad(`Ação ${String(action).slice(0,60)} indisponível no desenvolvimento local. ${blocked}`);
  }
}
