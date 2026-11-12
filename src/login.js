/**
 * VeloX · autenticação local de desenvolvimento.
 * Mantém a tela V10 original; a ação Entrar abre o app local, sem senha, sem Supabase.
 * O módulo de produção não faz parte desta cópia. Nunca publicar em uso real.
 */
const form = document.getElementById('v10form');
if (!form) throw new Error('Formulário V10 não encontrado');
// No navegador de desenvolvimento a validação de credenciais não deve impedir a navegação.
form.noValidate = true;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  document.getElementById('v10password').value = '';
  window.location.assign('./app.html');
}, true);
