/** Browser-only demonstration adapter; no production data, credentials or external API. */
(function(){
  'use strict';
  const categories=window.VXDocuments.catalog.map(item=>item.name);
  window.VX_CONFIG=Object.freeze({version:'1.0.0',environment:'local',timeZone:'America/Sao_Paulo',rootId:'demo-root',maxUploadBytes:500000,tables:['Pessoas','Pastas','Documentos','Logs','Operacoes','CentrosCusto','Equipes','Cargos','SitesExternos','Obrigacoes','Contratos','GestaoDocumentos','GestaoHistorico','Preferencias','EnterpriseRecords','Companies','CompanySelections'],categories,accountingReferences:[],sitesDefaults:[]});
  const KEY='velox.stackblitz.demo.v1';
  let storageSchemaMigrated=false;
  const db=(()=>{try{const old=JSON.parse(localStorage.getItem(KEY)||'{}');for(const table of ['Pastas','Documentos','GestaoDocumentos'])for(const item of Array.isArray(old[table])?old[table]:[]){if(!item||typeof item!=='object')continue;if(item.storageObjectId===undefined&&item.driveId!==undefined){item.storageObjectId=item.driveId;storageSchemaMigrated=true;}if(Object.prototype.hasOwnProperty.call(item,'driveId')){delete item.driveId;storageSchemaMigrated=true;}}return Object.fromEntries(VX_CONFIG.tables.map(x=>[x,Array.isArray(old[x])?old[x]:[]]));}catch(_){return Object.fromEntries(VX_CONFIG.tables.map(x=>[x,[]]));}})();
  const folders=new Map([['demo-root',{id:'demo-root',nome:'Documentos dos colaboradores',parentId:'',url:'#'}]]);
  let rev=0;
  for(const p of db.Pessoas||[])if(p.pastaId)folders.set(p.pastaId,{id:p.pastaId,nome:p.pastaNome||p.nome,parentId:'demo-root',url:'#'});
  for(const f of db.Pastas||[])folders.set(f.storageObjectId,{id:f.storageObjectId,nome:f.categoria?categories[Number(f.categoria)-1]||f.nome:f.nome,parentId:f.parentId,url:'#'});
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(db));storageSchemaMigrated=false;}catch(e){console.warn('Falha ao salvar os dados:',e);throw Error('Não foi possível salvar os dados. Libere espaço no navegador e tente novamente.');}}
  if(storageSchemaMigrated){try{localStorage.setItem(KEY,JSON.stringify(db));storageSchemaMigrated=false;}catch(error){console.warn('Não foi possível atualizar o esquema local:',error);}}
  function uuid(){return (crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)).replaceAll('-','').slice(0,24);}
  function hash(text){const x=String(text??'');let a=2166136261;for(let i=0;i<x.length;i++){a^=x.charCodeAt(i);a=Math.imul(a,16777619);}return (a>>>0).toString(16).padStart(8,'0').repeat(8);}
  function folderFromRecord(id){return folders.get(id);}
  function ancestor(id,root){for(let i=0;i<30;i++){if(id===root)return true;const o=folderFromRecord(id);if(!o||!o.parentId)break;id=o.parentId;}return false;}
  function requireFolder(id,root){if(!ancestor(id,root))throw Error('Esta pasta não pertence ao colaborador.');return folderFromRecord(id);}
  const storage={
   ensureFolder(parentId,name,knownId){if(knownId){const f=requireFolder(knownId,parentId);return {id:f.id,nome:f.nome,url:'#'};}
    if(!folders.has(parentId))throw Error('Pasta pai indisponível.');let f=[...folders.values()].find(x=>x.parentId===parentId&&x.nome===name);
    if(!f){f={id:'folder_'+uuid(),nome:name,parentId,url:'#'};folders.set(f.id,f);}return {id:f.id,nome:f.nome,url:f.url};},
   assertFolder(id,root){return requireFolder(id,root);},
   list(id,root){const current=requireFolder(id,root),caminho=[];let at=id;
    while(at&&caminho.length<30){const f=folders.get(at);if(!f)break;caminho.unshift({id:f.id,nome:f.nome});if(at===root)break;at=f.parentId;}
    return {id,nome:current.nome,url:'#',caminho,pastas:[...folders.values()].filter(x=>x.parentId===id).map(x=>({id:x.id,nome:x.nome,url:'#'})).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR',{numeric:true})),documentos:db.Documentos.filter(x=>x.pastaId===id).map(x=>({id:x.storageObjectId,nome:x.nome,mime:x.mime,tamanho:x.tamanho,url:'#',atualizadoEm:x.enviadoEm})),parcial:false};},
   upload(parentId,root,documentId,name,mime,base64,imageOnly){requireFolder(parentId,root);
    const bytes=atob(base64||'');if(bytes.length>500000)throw Error('O arquivo excede o limite permitido de 500 KB.');
    if(db.Documentos.some(d=>d.pastaId===parentId&&d.nome===name&&d.id!==documentId))throw Error('Já existe documento com esse nome nesta pasta.');
    return {id:'doc_'+documentId,nome:name,url:'#',size:bytes.length,hash:hash(base64),mime};},
   photo(){return null;},
   download(){throw Error('Não foi possível preparar o download. Tente novamente.');},
   siteLogoUpload(){throw Error('Não foi possível enviar o logotipo. Tente novamente.');},
   siteLogoRead(){return null;},siteLogoDelete(){},
   managementReference(){throw Error('Não foi possível vincular o documento. Tente novamente.');},
   managementUpload(){throw Error('Não foi possível enviar os documentos. Tente novamente.');}
  };
  const store={all(t){return db[t]||[];},put(t,r){if(!db[t])db[t]=[];const i=db[t].findIndex(x=>x.id===r.id);if(i<0)db[t].push(r);else db[t][i]=r;return r;},remove(t,id){db[t]=(db[t]||[]).filter(x=>x.id!==id);}};
  function execute(action,payload){if(action==='bootstrap.version')return {revision:'demo:'+rev};
   if(action==='client.pdfLibrary')throw Error('Não foi possível preparar a exportação em PDF. Tente novamente.');
   if(action.startsWith('distribution.'))throw Error('Não foi possível concluir esta operação. Tente novamente.');
   const ctx={store,storage,email:'Administrador',role:'owner',rootId:'demo-root',categories,now:()=>new Date().toISOString(),today:()=>new Date().toISOString().slice(0,10),hash,uuid,maxUploadBytes:VX_CONFIG.maxUploadBytes};
   const isWrite=/^(people\.import|person\.save|person\.transfer|person\.terminate|catalog\.save|folder\.create|document\.upload|site\.save|site\.delete|obligation\.save|obligation\.resolve|contract\.save|management\.upload|management\.link|preferences\.save|workspace\.save|workspace\.archive|workspace\.restore|workspace\.followup|workspace\.advance|company\.save|company\.select)$/.test(action);
   // Transação da prévia: se uma regra ou gravação falhar, não deixar dados parcialmente alterados em memória.
   const previous=isWrite?JSON.parse(JSON.stringify(db)):null;
   const previousFolders=isWrite?new Map([...folders].map(([id,folder])=>[id,{...folder}])):null;
   const previousRevision=rev;
   try{
    const data=window.VeloXCore.execute(ctx,action,payload||{});
    if(action==='bootstrap'){data.pastaUrl='#';data.revision='demo:'+rev;}
    if(isWrite){rev++;persist();}
    return data;
   }catch(error){
    if(isWrite){
     Object.keys(db).forEach(table=>{delete db[table];});
     Object.entries(previous).forEach(([table,records])=>{db[table]=records;});
     folders.clear();previousFolders.forEach((folder,id)=>folders.set(id,folder));
     rev=previousRevision;
    }
    throw error;
   }
  }
  window.VeloXApi=Object.freeze({call(action,payload){return Promise.resolve().then(()=>({ok:true,data:execute(action,payload),metrics:{totalMs:0}}));}});
  window.VXDemo={api:execute,reset(){localStorage.removeItem(KEY);location.reload();}};
  })();
  