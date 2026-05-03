export function verificarAplicabilidade(item, config) {
  if (!item.regraAplicabilidade) return true;

  const regra = item.regraAplicabilidade;

  if (regra.codigoNumeroMin && Number(config.codigoNumero) < Number(regra.codigoNumeroMin)) {
    return false;
  }

  if (regra.codigoLetraMin) {
    const ordem = ["A", "B", "C", "D", "E", "F"];
    const letraAtual = ordem.indexOf(config.codigoLetra);
    const letraMinima = ordem.indexOf(regra.codigoLetraMin);

    if (letraAtual < letraMinima) {
      return false;
    }
  }

  if (regra.requerPista && !config.pista) return false;
  if (regra.requerTaxiway && !config.taxiway) return false;
  if (regra.requerPatio && !config.patio) return false;
  if (regra.requerPavimentado && !config.pavimentado) return false;
  if (regra.requerOperacaoNoturna && !config.operacaoNoturna) return false;
  if (regra.requerSistemaEletrico && !config.sistemaEletrico) return false;
  if (regra.requerBaixaVisibilidade && !config.baixaVisibilidade) return false;
  if (regra.requerUsoPublico && !config.usoPublico) return false;
  if (regra.requerInternacional && !config.internacional) return false;

  if (
    regra.tiposOperacao &&
    Array.isArray(regra.tiposOperacao) &&
    !regra.tiposOperacao.includes(config.tipoOperacao)
  ) {
    return false;
  }

  return true;
}