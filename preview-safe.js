// VISUAL ONLY. This file must never be deployed to the real VeloX.
(()=>{'use strict';
  const bootstrap = () => ({
    revision:'preview-local-visual',
    atualizadoEm:new Date().toISOString(),
    usuario:{email:'visualizacao@exemplo.local'},
    pessoas:[],centrosCusto:[],equipes:[],cargos:[],sites:[],
    preferences:{antecedenciaDias:7,experienciaDias:7}
  });
  const response=(data)=>({ok:true,data,metrics:{preview:true}});
  async function simulatedApi(action, payload={}) {
    switch(action){
      case 'bootstrap':return response(bootstrap());
      case 'bootstrap.version':return response({revision:'preview-local-visual'});
      case 'people.list':return response([]);
      case 'management.bootstrap':return response({obrigacoes:[],contratos:[],preferences:{antecedenciaDias:7,experienciaDias:7}});
      case 'client.brand.banner':return response(null);
      case 'site.logo': case 'photo.get':return response(null);
      default: return {ok:false,erro:{codigo:'PREVIA_SOMENTE_VISUAL',mensagem:'Ação desativada: esta é uma prévia segura com dados fictícios, sem conexão com o VeloX real.'}};
    }
  }
  if(typeof window.__VX_PROD_READY!=='function')throw new Error('Inicialização da prévia não encontrada.');
  window.__VX_PROD_READY(simulatedApi);
  const badge=document.createElement('div');
  badge.textContent='PRÉVIA SEGURA · SEM DADOS REAIS';
  badge.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99999;border:1px solid #91cda4;border-radius:8px;padding:9px 12px;background:#103d28;color:white;font:700 11px Inter,Arial,sans-serif;box-shadow:0 4px 15px #0004;pointer-events:none';
  const draw=()=>document.body.appendChild(badge);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',draw);else draw();
})();
