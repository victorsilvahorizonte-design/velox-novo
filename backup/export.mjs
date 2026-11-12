/** Executar APENAS em máquina confiável, nunca no frontend, com service_role local. */
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
import {mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {encryptRecords,sha256,verifyEncrypted} from './crypto.mjs';
const env=process.env;
const server=env.SUPABASE_URL||'',secret=env.SUPABASE_SERVICE_ROLE_KEY||'',owner=env.VELOX_OWNER_UUID||'';
const pass=env.VELOX_BACKUP_PASSPHRASE||'',dir=resolve(env.VELOX_BACKUP_DIR||'./backups');
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(server)||!secret||!/^[0-9a-f-]{36}$/i.test(owner)||pass.length<16)throw Error('Configure URL, service_role, UUID do proprietário e senha de backup com 16 ou mais caracteres.');
const admin=createClient(server,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const {data:snapshot,error:e}=await admin.from('velox_snapshots').select('revision,state').eq('owner_id',owner).single();if(e||!snapshot)throw Error('Snapshot do proprietário não encontrado.');
const objects=[];let complete=false;
for(let offset=0;offset<100000;offset+=100){const {data,error}=await admin.storage.from('velox-private').list(owner,{limit:100,offset,sortBy:{column:'name',order:'asc'}});
 if(error)throw Error('Erro ao listar arquivos do bucket privado.');
 for(const item of data||[]){if(item.id&&item.name)objects.push(item.name);}
 if((data||[]).length<100){complete=true;break;}
}
if(!complete)throw Error('Lista de documentos excedeu o limite de exportação; backup abortado.');
async function* records(){yield {type:'manifest',format:'velox-v1',createdAt:new Date().toISOString(),sourceProject:server.replace(/\/$/,''),owner,revision:snapshot.revision,state:snapshot.state,fileCount:objects.length};
 for(const name of objects){const path=`${owner}/${name}`;const {data:blob,error}=await admin.storage.from('velox-private').download(path);if(error||!blob)throw Error('Não foi possível exportar TODOS os arquivos. Backup abortado.');
 const bytes=Buffer.from(await blob.arrayBuffer());yield {type:'file',path,sha256:sha256(bytes),mime:blob.type||'application/octet-stream',base64:bytes.toString('base64')};}
 const {data:current,error}=await admin.from('velox_snapshots').select('revision').eq('owner_id',owner).single();
 if(error||current?.revision!==snapshot.revision)throw Error('Os dados mudaram durante a exportação. Execute novamente em um intervalo sem gravações.');
}
await mkdir(dir,{recursive:true});
const filename=`velox-${new Date().toISOString().slice(0,10)}-${randomUUID().slice(0,8)}.vxbackup`,target=join(dir,filename);
await encryptRecords(target,pass,records());
await verifyEncrypted(target,pass);
console.log('Backup criptografado e verificado. Guarde este arquivo fora do projeto Supabase.');
console.log('Arquivo:',target);
console.log('Arquivos protegidos:',objects.length);
