/** Arquivo criptografado: AES-256-GCM, chave derivada por scrypt, sem JSON legível em disco. */
import {createCipheriv,createDecipheriv,randomBytes,scryptSync,createHash} from 'node:crypto';
import {createWriteStream,createReadStream} from 'node:fs';
import {rename,rm,stat,chmod} from 'node:fs/promises';
import {once} from 'node:events';
import {createInterface} from 'node:readline';
import {Readable} from 'node:stream';
const MAGIC=Buffer.from('VXBACK1\n','utf8');
const SALT_LEN=16,IV_LEN=12,TAG_LEN=16,HEADER_LEN=MAGIC.length+SALT_LEN+IV_LEN;
async function key(passphrase,salt){if(typeof passphrase!=='string'||passphrase.length<16)throw Error('Senha de backup deve ter no mínimo 16 caracteres.');try{return scryptSync(passphrase,salt,32,{N:32768,r:8,p:1,maxmem:128*1024*1024});}catch(error){if(error.message!=="p.run is not a function")throw error;const mod=await import("scrypt-js");const api=mod.default||mod;return Buffer.from(await api.scrypt(Buffer.from(passphrase),salt,32768,8,1,32));}}
function validateRecord(record){if(!record||typeof record!=='object'||!['manifest','file'].includes(record.type))throw Error('Entrada de backup inválida.');
 if(record.type==='file'){if(typeof record.path!=='string'||!/^[-a-f0-9]{36}\/(?:doc_|file_|logo_|mgdoc_)[\w-]+$/.test(record.path))throw Error('Caminho de arquivo inválido.');
 const b=Buffer.from(record.base64||'','base64');if(createHash('sha256').update(b).digest('hex')!==record.sha256)throw Error('Arquivo não passou na verificação de integridade.');}
}
export async function encryptRecords(target,passphrase,records){const salt=randomBytes(SALT_LEN),iv=randomBytes(IV_LEN),cipher=createCipheriv('aes-256-gcm',await key(passphrase,salt),iv);const temp=target+'.partial';let stream=null;
 try{stream=createWriteStream(temp,{flags:'wx',mode:0o600});await once(stream,'open');
  async function write(data){if(data.length&&!stream.write(data))await once(stream,'drain');}
  await write(Buffer.concat([MAGIC,salt,iv]));let count=0;
  for await(const record of records){validateRecord(record);await write(cipher.update(JSON.stringify(record)+'\n','utf8'));count++;}
  await write(cipher.final());await write(cipher.getAuthTag());stream.end();await once(stream,'finish');
  await chmod(temp,0o600);await rename(temp,target);return count;
 }catch(e){if(stream)stream.destroy();await rm(temp,{force:true}).catch(()=>{});throw e;}}
async function readEncrypted(target,passphrase,collect){const info=await stat(target);if(info.size<=HEADER_LEN+TAG_LEN)throw Error('Arquivo de backup incompleto.');
 const fs=await import('node:fs/promises');const handle=await fs.open(target,'r');let salt,iv,tag,magic;
 try{const header=Buffer.alloc(HEADER_LEN);await handle.read(header,0,HEADER_LEN,0);magic=header.subarray(0,MAGIC.length);salt=header.subarray(MAGIC.length,MAGIC.length+SALT_LEN);iv=header.subarray(MAGIC.length+SALT_LEN);tag=Buffer.alloc(TAG_LEN);await handle.read(tag,0,TAG_LEN,info.size-TAG_LEN);}finally{await handle.close();}
 if(!magic.equals(MAGIC))throw Error('Formato de backup desconhecido.');
 const decipher=createDecipheriv('aes-256-gcm',await key(passphrase,salt),iv);decipher.setAuthTag(tag);
 let count=0,files=0,manifest=null;
 const source=createReadStream(target,{start:HEADER_LEN,end:info.size-TAG_LEN-1});
 const plaintext=Readable.from((async function*(){
  for await(const chunk of source)yield decipher.update(chunk);
  yield decipher.final();
 })());
 const lines=createInterface({input:plaintext,crlfDelay:Infinity});
 try{
  for await(const line of lines){if(!line)continue;const record=JSON.parse(line);validateRecord(record);if(record.type==='manifest'){if(manifest||count!==0)throw Error('Manifesto duplicado ou fora de ordem.');manifest=record;}else{if(!manifest||!record.path.startsWith(manifest.owner+'/'))throw Error('Arquivo fora do proprietário do backup.');files++;}count++;collect?.(record);}
 }finally{plaintext.destroy();source.destroy();}
 // O decifrador verifica a autenticação AES-GCM antes do encerramento do stream.
 if(!manifest||files!==manifest.fileCount)throw Error('Backup inconsistente.');
 return {owner:manifest.owner,revision:manifest.revision,files,verified:true};
}
export const verifyEncrypted=(target,passphrase)=>readEncrypted(target,passphrase);
export async function loadVerifiedBackup(target,passphrase){
 const maxBytes=128*1024*1024;
 if((await stat(target)).size>maxBytes)throw Error('Backup excede o limite de 128 MiB desta ferramenta de restauração.');
 const files=new Map();
 let manifest;
 await readEncrypted(target,passphrase,record=>{
  if(record.type==='manifest'){manifest=record;return;}
  const name=record.path.split('/')[1];
  if(files.has(name))throw Error('Arquivo duplicado no backup.');
  files.set(name,{bytes:Buffer.from(record.base64,'base64'),mime:record.mime,sha256:record.sha256});
 });
 if(!Number.isSafeInteger(manifest.revision)||manifest.revision<0||!manifest.state||typeof manifest.state!=='object'||Array.isArray(manifest.state))throw Error('Snapshot inválido.');
 return {manifest,files};
}
export const sha256=buffer=>createHash('sha256').update(buffer).digest('hex');
