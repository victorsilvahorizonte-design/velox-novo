import {verifyEncrypted} from './crypto.mjs';
const backup=process.argv[2],pass=process.env.VELOX_BACKUP_PASSPHRASE||'';
if(!backup||!pass)throw Error('Informe o caminho do arquivo e a senha por variável de ambiente.');
const result=await verifyEncrypted(backup,pass);
console.log('Integridade criptográfica aprovada. Total de documentos:',result.files);
