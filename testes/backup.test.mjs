import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {encryptRecords,verifyEncrypted,loadVerifiedBackup,sha256} from '../backup/crypto.mjs';
test('backup criptografado é íntegro e não grava dados em texto claro',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'velox-crypto-test-'));const target=join(folder,'backup.vxbackup');
 const owner='00000000-0000-4000-8000-000000000001';
 const data=Buffer.from('DOCUMENTO FICTÍCIO - CPF NENHUM');
 try{
  async function* records(){yield {type:'manifest',owner,revision:12,state:{Pessoas:[{nome:'Pessoa Fictícia'}]},fileCount:1};yield {type:'file',path:owner+'/doc_d_abc123',base64:data.toString('base64'),sha256:sha256(data)};}
  assert.equal(await encryptRecords(target,'senha muito longa para teste',records()),2);
  const binary=await readFile(target);
  assert.ok(!binary.includes(Buffer.from('Pessoa Fictícia')));
  assert.ok(!binary.includes(Buffer.from('DOCUMENTO FICTÍCIO')));
  const result=await verifyEncrypted(target,'senha muito longa para teste');
  assert.equal(result.revision,12);assert.equal(result.files,1);
  const recovered=await loadVerifiedBackup(target,'senha muito longa para teste');
  assert.deepEqual(recovered.manifest.state,{Pessoas:[{nome:'Pessoa Fictícia'}]});
  assert.deepEqual(recovered.files.get('doc_d_abc123').bytes,data);
  await assert.rejects(verifyEncrypted(target,'senha errada mas também longa'),/SyntaxError|JSON|authenticate|decrypt|unsupported state/i);
  binary[binary.length-1]^=1;
  await writeFile(target,binary);
  await assert.rejects(loadVerifiedBackup(target,'senha muito longa para teste'));
 }finally{await rm(folder,{recursive:true,force:true});}
});
