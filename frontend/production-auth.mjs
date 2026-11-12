/** Ativação de login verdadeiro no visual V10, sem senha fictícia. */
import { createClient } from '@supabase/supabase-js';
const form=document.querySelector('#v10form');
const email=document.querySelector('#v10email'),password=document.querySelector('#v10password'),message=document.querySelector('#v10feedback'),submit=document.querySelector('#v10submit');
const url=import.meta.env.VITE_SUPABASE_URL||'',key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'';
const good=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)&&Boolean(key);
let client=null;
if(good)client=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storage:window.sessionStorage,storageKey:'velox.prod.auth'}});
if(!good)message.textContent='Ambiente de uso real ainda não configurado. Não insira dados.';
else client.auth.getSession().then(({data:{session}})=>{if(session)location.replace('./app.html');}).catch(()=>{});
form.addEventListener('submit',async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  if(!client){message.textContent='Acesso indisponível: falta ativar o servidor seguro.';return;}
  if(!email.value.trim()||!password.value){message.textContent='Informe o e-mail e a senha do proprietário.';return;}
  submit.disabled=true;message.textContent='Validando acesso seguro…';
  try{
    const {error}=await client.auth.signInWithPassword({email:email.value.trim(),password:password.value});
    password.value='';
    if(error)throw Error('Não foi possível autenticar. Confira as credenciais.');
    location.assign('./app.html');
  }catch(error){message.textContent=error.message||'Não foi possível entrar.';}
  finally{submit.disabled=false;}
},true);
