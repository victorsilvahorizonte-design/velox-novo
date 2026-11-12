/** Executar APENAS na edição de uso real; nunca importa o adaptador de demonstração. */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)||!key){
  window.__VX_PROD_FAIL?.(new Error('VeloX não configurado para uso real. Não cadastre dados nesta versão.'));
} else {
  const client = createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storage:window.sessionStorage,storageKey:'velox.prod.auth'}});
  // Logout real: invalida a sessão; nenhuma credencial é guardada no HTML.
  document.getElementById('vx-logout')?.addEventListener('click',async()=>{
    try{await client.auth.signOut({scope:'local'});}finally{location.replace('./index.html');}
  });
  client.auth.getSession().then(({data:{session},error})=>{
    if(error||!session){location.replace('./index.html');return;}
    async function call(action,payload={}) {
      const {data:{session:updated},error:sessionError}=await client.auth.getSession();
      if(sessionError||!updated){location.replace('./index.html');throw Error('Sessão encerrada. Faça login novamente.');}
      const response=await fetch(`${url.replace(/\/$/,'')}/functions/v1/velox-api`,{
        method:'POST',headers:{'content-type':'application/json','apikey':key,'Authorization':`Bearer ${updated.access_token}`},
        body:JSON.stringify({action,payload}),cache:'no-store',credentials:'omit'
      });
      const data=await response.json().catch(()=>({ok:false,erro:{codigo:'SERVIDOR',mensagem:'O servidor não respondeu corretamente.'}}));
      if(response.status===401){await client.auth.signOut();location.replace('./index.html');}
      return data;
    }
    window.__VX_PROD_READY?.(call);
  }).catch(error=>window.__VX_PROD_FAIL?.(error));
}
