/**
 * VeloX · desenvolvimento local (Vite).
 * App original carregado com dados locais, sem sessões ou serviços em produção.
 */
import { devCall } from './mock-api.js';
const resolve = window.__VX_PROD_READY;
if (typeof resolve !== 'function') throw new Error('Ponto de inicialização VeloX não encontrado');
resolve(devCall);
const logout = document.getElementById('vx-logout');
logout?.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.assign('./index.html');
});
// Biblioteca de PDF já compilada, recuperada junto da implantação pública.
window.VXLoadPDF = () => import('../assets/index-BK_YnMON.js');
