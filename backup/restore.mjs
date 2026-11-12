/** Restauração de homologação em projeto separado, com banco e bucket vazios. */
import {createClient} from '@supabase/supabase-js';
import {isDeepStrictEqual} from 'node:util';
import {loadVerifiedBackup,sha256} from './crypto.mjs';

const {VELOX_BACKUP_PASSPHRASE:passphrase,VELOX_RESTORE_URL:url,VELOX_RESTORE_SECRET:secret,VELOX_RESTORE_OWNER:owner}=process.env;
const backup=process.argv[2];
const projectUrl=/^https:\/\/[a-z0-9]+\.supabase\.co$/;
const uuid=/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
if(!backup||!passphrase||!projectUrl.test(url)||!secret||!uuid.test(owner))throw Error('Informe o arquivo, a senha do backup e as variáveis do projeto isolado.');

const {manifest,files}=await loadVerifiedBackup(backup,passphrase);
const source=manifest.sourceProject||process.env.VELOX_BACKUP_SOURCE_URL;
if(!projectUrl.test(source)||source===url||manifest.owner===owner)throw Error('O destino deve ser outro projeto e outro usuário.');
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const bucket=admin.storage.from('velox-private');

function requireData(result,message){
 if(result.error||result.data==null)throw Error(message);
 return result.data;
}

const owners=requireData(await admin.from('velox_owners').select('user_id,active').limit(2),'Não foi possível conferir o proprietário de teste.');
const snapshots=requireData(await admin.from('velox_snapshots').select('owner_id').limit(1),'Não foi possível conferir o banco de destino.');
const {data:bucketInfo,error:bucketError}=await admin.storage.getBucket('velox-private');
const contents=requireData(await bucket.list('',{limit:1}),'Não foi possível conferir o armazenamento de destino.');
if(owners.length!==1||owners[0].user_id!==owner||!owners[0].active||snapshots.length||bucketError||bucketInfo?.public!==false||contents.length)throw Error('O destino deve ter somente o proprietário de teste autorizado, sem snapshot, e bucket privado vazio.');

for(const [name,file] of files){
 const path=owner+'/'+name;
 const {error}=await bucket.upload(path,file.bytes,{contentType:file.mime,upsert:false});
 if(error)throw Error('Upload interrompido no ambiente isolado. Confira os objetos antes de repetir.');
 const blob=requireData(await bucket.download(path),'Não foi possível ler o documento restaurado.');
 if(sha256(Buffer.from(await blob.arrayBuffer()))!==file.sha256)throw Error('O documento restaurado não corresponde ao backup.');
}

const saved=requireData(await admin.from('velox_snapshots').insert({owner_id:owner,revision:manifest.revision,state:manifest.state}).select('revision,state').single(),'Não foi possível gravar o snapshot. Confira o destino antes de repetir.');
if(saved.revision!==manifest.revision||!isDeepStrictEqual(saved.state,manifest.state))throw Error('O snapshot restaurado não corresponde ao backup.');
console.log(`Restauração verificada no projeto isolado. Revisão ${saved.revision}, ${files.size} documento(s).`);
