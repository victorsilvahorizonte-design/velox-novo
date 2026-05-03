export function classificarAerodromo(dados) {
  const {
    tipoUso,
    passageirosAno = 0,
    comprimentoPista = 0,
    envergaduraMaxima = 0,
    tipoOperacaoAVSEC = [],
  } = dados;

  let rbac153 = "Não aplicável por passageiros";
  let classe153 = 0;

  if (tipoUso === "Público") {
    if (passageirosAno < 200000) {
      rbac153 = "Classe I";
      classe153 = 1;
    } else if (passageirosAno < 1000000) {
      rbac153 = "Classe II";
      classe153 = 2;
    } else if (passageirosAno < 5000000) {
      rbac153 = "Classe III";
      classe153 = 3;
    } else {
      rbac153 = "Classe IV";
      classe153 = 4;
    }
  }

  let codigoNumero = 1;
  if (comprimentoPista < 1200) codigoNumero = 1;
  else if (comprimentoPista <= 1800) codigoNumero = 2;
  else if (comprimentoPista <= 2400) codigoNumero = 3;
  else codigoNumero = 4;

  let codigoLetra = "A";
  if (envergaduraMaxima < 15) codigoLetra = "A";
  else if (envergaduraMaxima < 24) codigoLetra = "B";
  else if (envergaduraMaxima < 36) codigoLetra = "C";
  else if (envergaduraMaxima < 52) codigoLetra = "D";
  else if (envergaduraMaxima <= 65) codigoLetra = "E";
  else codigoLetra = "F";

  const operacoes = Array.isArray(tipoOperacaoAVSEC)
    ? tipoOperacaoAVSEC.map((op) => String(op).toLowerCase())
    : [String(tipoOperacaoAVSEC).toLowerCase()];

  const temPassageiros = operacoes.includes("passageiros");
  const temInternacional = operacoes.includes("internacional");
  const temCarga = operacoes.includes("carga");
  const temDomestica =
    operacoes.includes("doméstica") || operacoes.includes("domestica");

  let rbac107 = "Não aplicável ou aplicabilidade reduzida";

  if (temPassageiros && temInternacional) {
    rbac107 = "Aplicável - Operação Internacional de Passageiros";
  } else if (temPassageiros && temDomestica) {
    rbac107 = "Aplicável - Operação Doméstica de Passageiros";
  } else if (temCarga) {
    rbac107 = "Aplicável - Operação de Carga";
  }

  return {
    RBAC_153: rbac153,
    RBAC_154: `Código ${codigoNumero}${codigoLetra}`,
    RBAC_107: rbac107,
    classe153,
    codigoNumero,
    codigoLetra,
  };
}