/** Catálogo de links: regras compartilhadas, sem busca externa ou credenciais. */
function createSiteRules_(){
 const categories=['Institucional','Governo/Fiscal','Benefícios','Comunicação','Outros'];
 function url(value){
  const raw=String(value||'').trim();
  if(raw.length>1200||/[\u0000-\u0020\u007f<>"\\]/.test(raw))throw new Error('Informe uma URL HTTPS válida, sem espaços ou credenciais.');
  const m=raw.match(/^https:\/\/([^/?#]+)([/?#].*)?$/i);if(!m)throw new Error('Use um endereço HTTPS completo.');
  const authority=m[1].toLowerCase(),host=authority.replace(/:443$/,'');
  if(authority.includes('@')||host.includes(':')||host.length>253||!host.includes('.')||/^\d+(\.\d+){3}$/.test(host)||/\.(local|localhost|internal|test|invalid)$/.test(host)||!host.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))||!/[a-z]/.test(host.split('.').at(-1)))throw new Error('Use um domínio público válido, sem usuário, senha ou porta especial.');
  if(/[?&](?:password|senha|token|access_token|api_key|apikey|secret|authorization)=/i.test(raw))throw new Error('Não salve senhas, tokens ou credenciais no endereço.');
  return {url:'https://'+host+(m[2]||'/'),domain:host.replace(/^www\./,'')};
 }
 function validate(p){if(p.ativo!==undefined&&typeof p.ativo!=='boolean')throw new Error('Informe uma situação válida.');const u=url(p.url),name=String(p.nome||'').trim(),description=String(p.descricao||'').trim();if(name.length>100||description.length>240)throw new Error('Nome: até 100 caracteres. Descrição: até 240.');if(p.categoria&&!categories.includes(p.categoria))throw new Error('Escolha uma categoria válida.');return {...u,nome:name,categoria:p.categoria||'Outros',descricao:description,ativo:p.ativo!==false};}
 return {url,validate,categories};
}
var VeloXSites=createSiteRules_();

window.VXSites=createSiteRules_();
