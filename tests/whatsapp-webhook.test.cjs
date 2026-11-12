const {readFileSync}=require('fs');const {webcrypto}=require('crypto');const assert=require('node:assert/strict');
const code=readFileSync('supabase/functions/velox-whatsapp-webhook/index.ts','utf8');
const env={WA_VERIFY_TOKEN:'test-only-verify',WA_APP_SECRET:'test-only-secret',WA_EXPECTED_WABA_ID:'w1',WA_EXPECTED_PHONE_NUMBER_ID:'p1',WA_TEST_SENDERS:'556299136262',SUPABASE_URL:'https://example.invalid',SUPABASE_SERVICE_ROLE_KEY:'test-only-key'};
let handler,calls=[],storageStatus=201;
new Function('Deno','crypto','fetch',code)({env:{get:k=>env[k]},serve:h=>handler=h},webcrypto,async(url,opts)=>{calls.push({url,...opts});return new Response(null,{status:storageStatus})});
const payload=()=>({object:'whatsapp_business_account',entry:[{id:'w1',changes:[{field:'messages',value:{metadata:{phone_number_id:'p1'},messages:[{id:'msg1',from:'556299136262',type:'text',text:{body:' ponto '},timestamp:'1794400000'}]}}]}]});
async function post(p,valid=true){let body=typeof p==='string'?p:JSON.stringify(p);const key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(env.WA_APP_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);const signature=Buffer.from(await webcrypto.subtle.sign('HMAC',key,new TextEncoder().encode(body))).toString('hex');return handler(new Request('https://example.invalid',{method:'POST',body,headers:{'x-hub-signature-256':valid?'sha256='+signature:'sha256='+'0'.repeat(64)}}));}
(async()=>{let count=0;async function check(name,fn){await fn();console.log('PASS '+name);count++;}
await check('handshake exato',async()=>{const r=await handler(new Request('https://x/?hub.mode=subscribe&hub.verify_token=test-only-verify&hub.challenge=123'));assert.equal(r.status,200);assert.equal(await r.text(),'123')});
await check('token incorreto rejeitado',async()=>assert.equal((await handler(new Request('https://x/?hub.mode=subscribe&hub.verify_token=errado&hub.challenge=123'))).status,403));
await check('assinatura falsa sem gravacao',async()=>{assert.equal((await post(payload(),false)).status,401);assert.equal(calls.length,0)});
await check('PONTO autorizado persistido com idempotencia',async()=>{assert.equal((await post(payload())).status,200);assert.ok(calls[0].url.includes('on_conflict=phone_number_id,provider_message_id'));assert.ok(calls[0].headers.Prefer.includes('ignore-duplicates'));assert.equal(JSON.parse(calls[0].body)[0].stage,'test_received')});
await check('outra conta rejeitada',async()=>{let p=payload();p.entry[0].id='outra';assert.equal((await post(p)).status,403)});
await check('outro numero receptor rejeitado',async()=>{let p=payload();p.entry[0].changes[0].value.metadata.phone_number_id='outro';assert.equal((await post(p)).status,403)});
await check('remetente nao autorizado ignorado',async()=>{let p=payload();p.entry[0].changes[0].value.messages[0].from='5599999999999';const before=calls.length;assert.equal((await post(p)).status,200);assert.equal(calls.length,before)});
await check('oi nao marca ponto',async()=>{let p=payload();p.entry[0].changes[0].value.messages[0].text.body='oi';const before=calls.length;assert.equal((await post(p)).status,200);assert.equal(calls.length,before)});
await check('JSON invalido rejeitado',async()=>assert.equal((await post('{')).status,400));
await check('payload grande rejeitado',async()=>assert.equal((await post('a'.repeat(262145))).status,413));
await check('falha do banco pede reenvio',async()=>{storageStatus=500;assert.equal((await post(payload())).status,503)});
await check('configuracao incompleta bloqueia',async()=>{delete env.WA_TEST_SENDERS;assert.equal((await post(payload())).status,503)});
console.log(count+' verificacoes aprovadas');})();
