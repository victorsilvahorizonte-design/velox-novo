// src/engines/infraValidator.js
// Validador técnico operacional INFRA
// RBAC 154 EMD 08 + RBAC 153 EMD 09

import { obterParametroInfra } from "./infraRules";

function numero(valor) {
  return Number(valor || 0);
}

function texto(valor) {
  return String(valor || "").trim();
}

export function validarInfraestrutura(config = {}) {
  const parametros = obterParametroInfra(config);

  const alertas = [];
  const conformidades = [];
  const naoConformidades = [];

  const larguraPistaAtual = numero(config.larguraPista);

  const larguraMinimaPista = {
    "18 m": 18,
    "23 m": 23,
    "30 m": 30,
    "45 m": 45,
  }[parametros.pista.larguraMinimaEsperada];

  if (
    larguraMinimaPista &&
    larguraPistaAtual > 0 &&
    larguraPistaAtual < larguraMinimaPista
  ) {
    naoConformidades.push({
      grupo: "PISTA",
      severidade: "CRÍTICA",
      mensagem:
        `Largura da pista incompatível. ` +
        `Atual: ${larguraPistaAtual}m | ` +
        `Esperado: ${larguraMinimaPista}m.`,
    });
  } else if (larguraPistaAtual >= larguraMinimaPista) {
    conformidades.push({
      grupo: "PISTA",
      severidade: "OK",
      mensagem:
        `Largura da pista compatível ` +
        `(${larguraPistaAtual}m).`,
    });
  }

  if (
    parametros.resa.exigeRESA &&
    config.possuiRESA === false
  ) {
    naoConformidades.push({
      grupo: "RESA",
      severidade: "CRÍTICA",
      mensagem:
        "Operação exige RESA, porém o aeródromo informa ausência da área de segurança.",
    });
  }

  if (
    parametros.sinalizacao.exigeSinalizacaoLuminosa &&
    config.possuiSinalizacaoLuminosa === false
  ) {
    naoConformidades.push({
      grupo: "SINALIZAÇÃO",
      severidade: "CRÍTICA",
      mensagem:
        "Operação noturna sem sinalização luminosa operacional.",
    });
  }

  if (
    parametros.taxiway.exigeTaxiway &&
    config.possuiTaxiway === false
  ) {
    naoConformidades.push({
      grupo: "TAXIWAY",
      severidade: "ALTA",
      mensagem:
        "Cenário operacional indica necessidade de taxiway.",
    });
  }

  if (
    parametros.sinalizacao.exigePosicaoEsperaIFR &&
    config.possuiPosicaoEsperaIFR === false
  ) {
    naoConformidades.push({
      grupo: "IFR",
      severidade: "CRÍTICA",
      mensagem:
        "Operação IFR sem posição de espera identificada.",
    });
  }

  if (
    config.operacaoNoturna &&
    config.possuiBalizas === false
  ) {
    naoConformidades.push({
      grupo: "BALIZAMENTO",
      severidade: "CRÍTICA",
      mensagem:
        "Operação noturna sem balizamento operacional.",
    });
  }

  if (
    texto(config.tipoOperacao).toUpperCase() === "IFR" &&
    numero(config.codigoNumero) < 2
  ) {
    alertas.push({
      grupo: "OPERAÇÃO",
      severidade: "ATENÇÃO",
      mensagem:
        "Operação IFR em aeródromo de código reduzido exige avaliação técnica específica.",
    });
  }

  if (
    config.possuiObstaculos === true
  ) {
    alertas.push({
      grupo: "OBSTÁCULOS",
      severidade: "ATENÇÃO",
      mensagem:
        "Existem obstáculos reportados nas áreas operacionais.",
    });
  }

  const score =
    100 -
    naoConformidades.length * 15 -
    alertas.length * 5;

  let classificacao = "ADEQUADO";

  if (score < 85) classificacao = "ATENÇÃO";
  if (score < 70) classificacao = "CRÍTICO";
  if (score < 50) classificacao = "SEVERO";

  return {
    parametros,
    score: Math.max(score, 0),
    classificacao,
    alertas,
    conformidades,
    naoConformidades,
    totalAlertas: alertas.length,
    totalNaoConformidades:
      naoConformidades.length,
  };
}