/** Backend separado do navegador: autenticação obrigatória, regras do VeloX no servidor. */
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
import { createHash } from 'node:crypto';
import { VeloXCore, VeloXDocuments } from './rules.ts';

const BASE_URL = Deno.env.get('SUPABASE_URL') || '';
const ADMIN_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ORIGINS = (Deno.env.get('VELOX_ALLOWED_ORIGINS') || '').split(',').map(x=>x.trim()).filter(Boolean);
const BUCKET = 'velox-private';
const ROOT = 'velox-root';
const MAX_BYTES = 5_000_000; // limite inicial conservador, sujeito a revisão antes de produção
const MAX_BODY = 7_200_000;
const tables = ['Pessoas','Pastas','Documentos','Logs','Operacoes','CentrosCusto','Equipes','Cargos','SitesExternos','Obrigacoes','Contratos','GestaoDocumentos','GestaoHistorico','Preferencias','EnterpriseRecords','Companies','CompanySelections'];
const categories = VeloXDocuments.catalog.map(item=>item.name);
const writes = new Set(['people.import','person.save','person.transfer','person.terminate','catalog.save','folder.create','document.upload','site.save','site.delete','obligation.save','obligation.resolve','contract.save','management.upload','management.link','preferences.save','workspace.save','workspace.archive','workspace.restore','workspace.followup','workspace.advance','company.save','company.select']);
const uuid = () => crypto.randomUUID().replaceAll('-','').slice(0,24);
function hash(value:unknown){return createHash('sha256').update(String(value??'')).digest('hex');}
const admin = createClient(BASE_URL,ADMIN_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
function reply(data:unknown,status:number,origin:string){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','access-control-allow-origin':origin,'vary':'Origin','cache-control':'no-store','x-content-type-options':'nosniff'}})}
function decode64(b64:unknown){if(typeof b64!=='string'||!b64.length||b64.length%4||!/^[a-zA-Z0-9+/]*={0,2}$/.test(b64))throw Error('Arquivo inválido.');
 const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));if(bytes.length>MAX_BYTES)throw Error('Arquivo acima de 5 MB.');return bytes;}
function encode64(bytes:Uint8Array){const block=16384;let value='';for(let i=0;i<bytes.length;i+=block)value+=String.fromCharCode(...bytes.subarray(i,i+block));return btoa(value);}
function prepare(state:any){const obj=state&&typeof state==='object'&&!Array.isArray(state)?state:{};return {...structuredClone(obj),...Object.fromEntries(tables.map(t=>[t,Array.isArray(obj[t])?structuredClone(obj[t]):[]]))};}
function makeStorage(data:any){
 const folders=new Map<string,any>([[ROOT,{id:ROOT,nome:'Documentos VeloX',parentId:'',url:'#'}]]);
 for(const p of data.Pessoas)if(p.pastaId)folders.set(p.pastaId,{id:p.pastaId,nome:p.pastaNome||p.nome,parentId:ROOT,url:'#'});
 for(const f of data.Pastas)if(f.storageObjectId)folders.set(f.storageObjectId,{id:f.storageObjectId,nome:f.nome,parentId:f.parentId,url:'#'});
 const staged:Array<{id:string,name:string,mime:string,bytes:Uint8Array}>=[];
 function ancestor(id:string,root:string){for(let i=0;i<40;i++){if(id===root)return true;const p=folders.get(id);if(!p?.parentId)break;id=p.parentId;}return false;}
 function folder(id:string,root:string){if(!ancestor(id,root)||!folders.has(id))throw Error('Pasta fora do vínculo selecionado.');return folders.get(id);}
 function stage(id:string,name:string,mime:string,base64:unknown){if(!/^(?:doc_|file_|logo_|mgdoc_)[\w-]{1,120}$/.test(id))throw Error('Identificador de arquivo inválido.');
   const bytes=decode64(base64);staged.push({id,name,mime,bytes});return {id,nome:name,url:'#',size:bytes.length,mime,hash:hash(base64)};}
 return {
   staged,
   ensureFolder(parentId:string,name:string,knownId?:string){if(knownId){const f=folder(knownId,parentId);return {id:f.id,nome:f.nome,url:'#'};}
     if(!folders.has(parentId))throw Error('Pasta pai não encontrada.');let f=[...folders.values()].find(x=>x.parentId===parentId&&x.nome===name);
     if(!f){f={id:'folder_'+uuid(),nome:name,parentId,url:'#'};folders.set(f.id,f);}return {id:f.id,nome:f.nome,url:'#'};},
   assertFolder:folder,
   list(id:string,root:string){const current=folder(id,root),caminho=[];let at=id;
     while(at&&caminho.length<40){const f=folders.get(at);if(!f)break;caminho.unshift({id:f.id,nome:f.nome});if(at===root)break;at=f.parentId;}
     return {id,nome:current.nome,url:'#',caminho,pastas:[...folders.values()].filter(x=>x.parentId===id).map(x=>({id:x.id,nome:x.nome,url:'#'})).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR',{numeric:true})),documentos:data.Documentos.filter((d:any)=>d.pastaId===id).map((d:any)=>({id:d.storageObjectId,nome:d.nome,mime:d.mime,tamanho:d.tamanho,url:'#',atualizadoEm:d.enviadoEm})),parcial:false};},
   upload(parentId:string,root:string,docId:string,name:string,mime:string,b64:string){folder(parentId,root);if(data.Documentos.some((d:any)=>d.pastaId===parentId&&d.nome===name&&d.id!==docId))throw Error('Já existe documento com esse nome nesta pasta.');return stage('doc_'+docId,name,mime,b64);},
   photo(id:string,root:string){const d=data.Documentos.find((d:any)=>d.storageObjectId===id&&data.Pessoas.some((p:any)=>p.pastaId===root&&p.id===d.pessoaId));if(!d)throw Error('Foto não encontrada.');return {__file:id,name:d.nome};},
   download(parentId:string,root:string,ids:string[]){folder(parentId,root);const items=ids.map(id=>{const d=data.Documentos.find((d:any)=>d.storageObjectId===id&&d.pastaId===parentId&&data.Pessoas.some((p:any)=>p.id===d.pessoaId&&p.pastaId===root));if(!d)throw Error('Documento indisponível.');return {id,name:d.nome,mime:d.mime};});return {__files:items};},
   siteLogoUpload(id:string,opId:string,logo:any){const name=String(logo.nome||'logo');const mime=String(logo.mime||'image/png');if(!['image/png','image/jpeg','image/webp'].includes(mime))throw Error('Logo deve ser PNG, JPEG ou WebP.');return stage('logo_'+opId,name,mime,logo.base64);},
   siteLogoRead(id:string){return {__file:id};},
   siteLogoDelete(){},
   managementReference(){throw Error('Vínculo externo de documentos não é permitido.');},
   managementUpload(type:string,record:any,id:string,name:string,mime:string,b64:string){return stage('mgdoc_'+id,name,mime,b64);},
 };
}
async function loadFile(owner:string,id:string,name='documento'){const {data,error}=await admin.storage.from(BUCKET).download(`${owner}/${id}`);if(error||!data)throw Error('Arquivo não encontrado no armazenamento privado.');
  const bytes=new Uint8Array(await data.arrayBuffer());if(bytes.length>MAX_BYTES)throw Error('Arquivo acima do limite de resposta.');return {base64:encode64(bytes),mime:data.type||'application/octet-stream',nome:name};}
Deno.serve(async req=>{
 const origin=req.headers.get('Origin')||'';
 if(!BASE_URL||!ADMIN_KEY)return reply({ok:false,erro:{codigo:'CONFIG',mensagem:'Servidor ainda não foi configurado.'}},503,'null');
 let allowed=Boolean(origin)&&ORIGINS.includes(origin);
 if(origin&&!allowed){const {data,error}=await admin.from('velox_app_origins').select('origin').eq('origin',origin).eq('active',true).maybeSingle();allowed=!error&&Boolean(data);}
 if(req.method==='OPTIONS')return new Response(null,{status:allowed?204:403,headers:{'access-control-allow-origin':allowed?origin:'null','access-control-allow-headers':'authorization,apikey,content-type,x-client-info','access-control-allow-methods':'POST,OPTIONS','vary':'Origin'}});

 if(!allowed||req.method!=='POST')return reply({ok:false,erro:{codigo:'ACESSO',mensagem:'Requisição não autorizada.'}},403,'null');
 try {
   const bearer=req.headers.get('Authorization')||'';if(!/^Bearer [\w.-]+$/.test(bearer))return reply({ok:false,erro:{codigo:'LOGIN',mensagem:'Faça login para continuar.'}},401,origin);
   const token=bearer.substring(7),{data:{user},error:authError}=await admin.auth.getUser(token);
   if(authError||!user||!user.email)return reply({ok:false,erro:{codigo:'LOGIN',mensagem:'Sessão inválida.'}},401,origin);
   const {data:owner,error:ownerError}=await admin.from('velox_owners').select('user_id,active').eq('user_id',user.id).maybeSingle();
   if(ownerError||!owner?.active)return reply({ok:false,erro:{codigo:'PERMISSAO',mensagem:'Conta sem autorização no VeloX.'}},403,origin);
   const length=Number(req.headers.get('Content-Length')||'0');if(length>MAX_BODY)return reply({ok:false,erro:{codigo:'LIMITE',mensagem:'Requisição muito grande.'}},413,origin);
   const reader=req.body?.getReader();let size=0;const chunks:Uint8Array[]=[];
   if(reader){while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){await reader.cancel();return reply({ok:false,erro:{codigo:'LIMITE',mensagem:'Requisição muito grande.'}},413,origin);}chunks.push(value);}}
   const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}const body=new TextDecoder().decode(bytes);
   const input=JSON.parse(body);if(!input||typeof input.action!=='string'||input.action.length>60||!input.payload||typeof input.payload!=='object'||Array.isArray(input.payload))throw Error('Requisição inválida.');
   const action=input.action,payload=input.payload;
   if(action==='client.pdfLibrary'||action.startsWith('distribution.'))throw Error('Recurso não habilitado no ambiente de produção.');
   const {data:row,error:dbError}=await admin.from('velox_snapshots').select('revision,state').eq('owner_id',user.id).single();
   if(dbError||!row)throw Error('Banco não inicializado para o proprietário.');
   const revision=Number(row.revision);
   if(action==='bootstrap.version')return reply({ok:true,data:{revision:'server:'+revision}},200,origin);
   const snapshot=prepare(row.state),storage=makeStorage(snapshot);
   const store={all:(t:string)=>snapshot[t]||[],put:(t:string,r:any)=>{const arr=snapshot[t];if(!arr)throw Error('Tabela inválida.');const i=arr.findIndex((x:any)=>x.id===r.id);if(i<0)arr.push(r);else arr[i]=r;return r;},remove:(t:string,id:string)=>{snapshot[t]=snapshot[t].filter((x:any)=>x.id!==id);}};
   const ctx={store,storage,role:'owner',email:user.email,rootId:ROOT,categories,now:()=>new Date().toISOString(),today:()=>new Date().toISOString().slice(0,10),hash,uuid,maxUploadBytes:MAX_BYTES};
   let result=VeloXCore.execute(ctx,action,payload);
   if(action==='bootstrap'){result.revision='server:'+revision;result.pastaUrl='#';}
   if(action==='management.get' && Array.isArray(result?.documentos)){
     for(const doc of result.documentos){
       if(typeof doc.storageObjectId!=='string'||!/^mgdoc_[\w-]+$/.test(doc.storageObjectId))continue;
       const {data:signed,error:signError}=await admin.storage.from(BUCKET).createSignedUrl(`${user.id}/${doc.storageObjectId}`,120,{download:doc.nome||true});
       if(signError||!signed?.signedUrl)throw Error('Não foi possível disponibilizar o documento.');
       doc.url=signed.signedUrl;
     }
   }
   if(result?.__file){result=await loadFile(user.id,result.__file,result.name);}
   if(result?.__files){const files=result.__files;if(files.length>1)throw Error('Download de vários arquivos ainda precisa ser homologado. Selecione um arquivo por vez.');result=await loadFile(user.id,files[0].id,files[0].name);}
   if(writes.has(action)){
     const uploaded:string[]=[];
     try{
       for(const f of storage.staged){const path=`${user.id}/${f.id}`;const {error}=await admin.storage.from(BUCKET).upload(path,f.bytes,{contentType:f.mime,upsert:false,cacheControl:'private'});if(error)throw new Error('Não foi possível gravar documento com segurança.');uploaded.push(path);}
       const {data:newRev,error:saveError}=await admin.rpc('velox_cas_write',{p_owner:user.id,p_expected:revision,p_state:snapshot});
       if(saveError||!Number.isFinite(Number(newRev)))throw Error('Conflito de gravação. Atualize e tente novamente.');
     } catch(error) {
       if(uploaded.length)await admin.storage.from(BUCKET).remove(uploaded).catch(()=>{});
       throw error;
     }
   }
   return reply({ok:true,data:result,metrics:{totalMs:0}},200,origin);
 } catch(error) {
   const msg=error instanceof Error?error.message:'Erro ao processar solicitação.';
   // Nunca enviar detalhes internos do banco, chaves ou payload para o navegador.
   const validationCodes=new Set(['VALIDACAO','DUPLICADO','CPF_ATIVO','CONFLITO','OPERACAO_DIFERENTE','CRONOLOGIA','HISTORICO_INCOMPLETO','RECONTRATACAO','CONFIRMACAO','HIERARQUIA_CIRCULAR','ESCOPO_EMPRESA','PERMISSAO','NAO_ENCONTRADO','PASTA_INVALIDA']);
   const code=validationCodes.has(error?.code)?error.code:'OPERACAO';
   const safe=validationCodes.has(code)?msg:/^(Arquivo|Pasta|Foto|Documento|Selecione|Confirme|Informe|Escolha|Conta|Sessão|Faça|Login|Acesso|Recurso|Já existe|Essa|Esse|Não foi possível|Conflito|O registro|O colaborador|Colaborador|Requisição|Cadastro|Dados|Essa pasta|Esta pasta|Limite|Vínculo|Erro ao processar)/.test(msg)?msg:'Não foi possível concluir a operação. Verifique os dados e tente novamente.';
   return reply({ok:false,erro:{codigo:code,mensagem:safe}},400,origin);
 }
});
