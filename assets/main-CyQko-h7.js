// VELOX LOCAL VISUAL PREVIEW — no Supabase connection, no credentials.
// Only the preview gate is added to the published login. The original login layout remains intact.
function activateVisualMode() {
  const go = () => { window.location.href = './app.html'; };
  const form = document.getElementById('v10form');
  const feedback = document.getElementById('v10feedback');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault(); e.stopImmediatePropagation();
    if (feedback) feedback.textContent = 'Prévia segura: utilize o botão VISUALIZAR VELOX, sem informar senha.';
  }, true);
  const button = document.createElement('button');
  button.textContent = 'VISUALIZAR VELOX (SEM LOGIN)';
  button.type = 'button';
  button.id = 'vx-preview-open';
  button.setAttribute('aria-label','Visualizar VeloX com dados fictícios, sem entrar no sistema real');
  button.style.cssText = 'position:fixed;z-index:99999;bottom:18px;right:18px;padding:13px 18px;border-radius:12px;border:2px solid #8ad1a0;background:#123d28;color:#fff;font:700 13px Inter,Arial,sans-serif;box-shadow:0 6px 24px #0006;cursor:pointer';
  button.addEventListener('click',go);
  document.body.appendChild(button);
  // Erase accidentally typed credentials on this local preview; never read them.
  const pw=document.getElementById('v10password'); if(pw)pw.value='';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activateVisualMode);
else activateVisualMode();
