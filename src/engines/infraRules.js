// src/engines/infraRules.js
// Regras técnicas INFRA
// Base principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const LARGURA_MINIMA_PISTA = {
  1: 18,
  2: 23,
  3: 30,
  4: 45,
};

export const LARGURA_TAXIWAY = {
  A: 7.5,
  B: 10.5,
  C: 15,
  D: 18,
  E: 23,
  F: 25,
};

export const RESA_COMPRIMENTO = {
  1: 30,
  2: 60,
  3: 90,
  4: 240,
};

// largura operacional de referência da RESA
// para exibição no painel como "comprimento x largura"
export const RESA_LARGURA = {
  1: 30,
  2: 40,
  3: 60,
  4: 90,
};

export const FAIXA_LARGURA_TOTAL = {
  1: 60,
  2: 80,
  3: 150,
  4: 300,
};

export const FAIXA_PREPARADA = {
  1: 30,
  2: 40,
  3: 75,
  4: 150,
};

function numero(valor, fallback = 1) {
  return Number(valor || fallback);
}

function texto(valor, fallback = "") {
  return String(valor || fallback).trim().toUpperCase();
}

export function obterParametroInfra(config = {}) {
  const codigoNumero = numero(config.codigoNumero, 1);
  const codigoLetra = texto(config.codigoLetra, "B");
  const tipoOperacao = texto(config.tipoOperacao, "VFR");
  const operacaoNoturna = config.operacaoNoturna === true;

  const isIFR = tipoOperacao === "IFR";
  const isCodigo34 = codigoNumero === 3 || codigoNumero === 4;

  const larguraPista = LARGURA_MINIMA_PISTA[codigoNumero] || 18;
  const larguraTaxiway = LARGURA_TAXIWAY[codigoLetra] || 10.5;
  const comprimentoRESA = RESA_COMPRIMENTO[codigoNumero] || 60;
  const larguraRESA = RESA_LARGURA[codigoNumero] || 30;
  const larguraFaixa = FAIXA_LARGURA_TOTAL[codigoNumero] || 60;
  const larguraFaixaPreparada = FAIXA_PREPARADA[codigoNumero] || 30;

  return {
    codigoReferencia: `${codigoNumero}${codigoLetra}`,

    codigoNumero,
    codigoLetra,
    tipoOperacao,
    operacaoNoturna,

    pista: {
      larguraMinimaEsperada: `${larguraPista} m`,
      exigeAvaliacaoSuperficie: true,
      exigeDrenagem: true,
      exigeSinalizacaoHorizontal: true,
    },

    taxiway: {
      larguraMinimaReferencial: `${larguraTaxiway} m`,
      exigeTaxiway:
        isCodigo34 ||
        isIFR ||
        operacaoNoturna ||
        config.possuiTaxiway === true,
      exigePosicaoEspera: isIFR || isCodigo34,
      exigeSinalizacaoLuminosa: operacaoNoturna,
    },

    faixa: {
      exigeFaixaPista: true,
      exigeFaixaPreparada: isCodigo34 || isIFR,

      larguraFaixaPista: `${larguraFaixa} m`,

      larguraFaixaPreparada: `${larguraFaixaPreparada} m`,

      descricaoFaixaPreparada: `${larguraFaixaPreparada} m centrais preparados`,

      criticidade: isIFR || isCodigo34 ? "ALTA" : "MÉDIA",
    },

    resa: {
      exigeRESA: isCodigo34 || isIFR,

      comprimentoMinimo: `${comprimentoRESA} m`,

      larguraMinima: `${larguraRESA} m`,

      dimensaoEsperada: `${comprimentoRESA} x ${larguraRESA} m`,

      criticidade: isCodigo34 || isIFR ? "CRÍTICA" : "MÉDIA",
    },

    sinalizacao: {
      exigeSinalizacaoHorizontal: true,
      exigeSinalizacaoVertical: true,
      exigeSinalizacaoLuminosa: operacaoNoturna,
      exigePosicaoEsperaIFR: isIFR,
    },

    drenagem: {
      exigeDrenagemPista: true,
      exigeDrenagemFaixa: true,
      exigeDrenagemRESA: isCodigo34 || isIFR,
      exigeControleFauna: true,
    },

    alertasOperacionais: [
      ...(isIFR
        ? [
            "Operação IFR exige avaliação rigorosa de faixa, RESA, sinalização e posição de espera.",
          ]
        : []),

      ...(operacaoNoturna
        ? [
            "Operação noturna exige balizamento, sinalização luminosa e inspeção reforçada.",
          ]
        : []),

      ...(isCodigo34
        ? ["Código 3 ou 4 exige avaliação dimensional mais rigorosa."]
        : []),
    ],
  };
}