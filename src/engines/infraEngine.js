// src/engines/infraEngine.js
// Motor inteligente INFRA V5
// RBAC 154 EMD 08 + RBAC 153 EMD 09

import { obterParametroInfra } from "./infraRules";
import { validarInfraestrutura } from "./infraValidator";
import { gerarParametroInfraPorItem } from "./infraDimensionEngine";
import { avaliarConformidadeInfra } from "./infraComplianceEngine";

function valorBooleano(valor) {
  return (
    valor === true ||
    valor === "true" ||
    valor === "SIM" ||
    valor === "sim"
  );
}

function operacaoEhIFR(config = {}) {
  return (
    String(config.tipoOperacao || "")
      .trim()
      .toUpperCase() === "IFR"
  );
}

export function verificarAplicabilidadeInfra(
  item,
  config = {}
) {
  if (!item?.aplicabilidade) return true;

  const regra = item.aplicabilidade;

  switch (regra.tipo) {
    case "universal":
      return true;

    case "codigoNumero":
      return regra.valores?.includes(
        Number(config.codigoNumero)
      );

    case "operacaoIFR":
      return regra.valores?.includes(true)
        ? operacaoEhIFR(config)
        : !operacaoEhIFR(config);

    case "operacaoNoturna":
      return regra.valores?.includes(true)
        ? valorBooleano(config.operacaoNoturna)
        : !valorBooleano(config.operacaoNoturna);

    default:
      return true;
  }
}

function gerarParametroEsperado(
  grupo,
  item,
  parametros
) {
  const grupoUpper = String(
    grupo || ""
  ).toUpperCase();

  if (grupoUpper.includes("PISTA")) {
    return `
Largura mínima esperada da pista:
${parametros.pista.larguraMinimaEsperada}

Código de referência:
${parametros.codigoReferencia}

Operação:
${parametros.tipoOperacao}
`;
  }

  if (grupoUpper.includes("RESA")) {
    return `
RESA mínima esperada:
${parametros.resa.dimensaoEsperada || parametros.resa.comprimentoMinimo}

Comprimento:
${parametros.resa.comprimentoMinimo}

Largura:
${parametros.resa.larguraMinima || "Verificar cenário"}

Criticidade:
${parametros.resa.criticidade}

Código:
${parametros.codigoReferencia}
`;
  }

  if (grupoUpper.includes("FAIXA")) {
    return `
Faixa de pista esperada:
${parametros.faixa.larguraFaixaPista}

Faixa preparada esperada:
${parametros.faixa.descricaoFaixaPreparada || parametros.faixa.larguraFaixaPreparada}

Criticidade:
${parametros.faixa.criticidade}
`;
  }

  if (grupoUpper.includes("TAXIWAY")) {
    return `
Largura referencial da taxiway:
${parametros.taxiway.larguraMinimaReferencial}

Posição de espera IFR:
${parametros.taxiway.exigePosicaoEspera ? "OBRIGATÓRIA" : "NÃO OBRIGATÓRIA"}

Sinalização luminosa:
${parametros.taxiway.exigeSinalizacaoLuminosa ? "OBRIGATÓRIA" : "NÃO OBRIGATÓRIA"}
`;
  }

  return item.parametroEsperado || "";
}

function obterTextoClassificacaoItem(item = {}) {
  return `${item.grupo || ""} ${item.item || ""} ${
    item.descricao || ""
  } ${item.criterio || ""} ${
    item.ref || ""
  } ${item.id || ""}`.toUpperCase();
}

function obterValorEsperadoParaComparacao(
  item = {},
  parametros,
  parametroCalculado
) {
  const textoGrupo =
    obterTextoClassificacaoItem(item);

  if (textoGrupo.includes("RESA")) {
    return (
      parametros.resa.dimensaoEsperada ||
      parametros.resa.comprimentoMinimo
    );
  }

  if (textoGrupo.includes("FAIXA PREPARADA")) {
    return (
      parametros.faixa
        .descricaoFaixaPreparada ||
      parametros.faixa
        .larguraFaixaPreparada
    );
  }

  if (
    textoGrupo.includes("FAIXA DE PISTA") ||
    textoGrupo.includes("FAIXA")
  ) {
    return parametros.faixa.larguraFaixaPista;
  }

  if (
    textoGrupo.includes("PISTA") &&
    !textoGrupo.includes("FAIXA")
  ) {
    return parametros.pista
      .larguraMinimaEsperada;
  }

  if (
    textoGrupo.includes("TAXIWAY") ||
    textoGrupo.includes("TÁXI") ||
    textoGrupo.includes("TAXI")
  ) {
    return parametros.taxiway
      .larguraMinimaReferencial;
  }

  return parametroCalculado;
}

export function enriquecerItemInfra(
  item,
  config = {}
) {
  const parametros =
    obterParametroInfra(config);

  const parametroPorItem =
    gerarParametroInfraPorItem(
      item,
      config
    );

  const parametroCalculado =
    parametroPorItem.parametroEsperado ||
    gerarParametroEsperado(
      item.grupo,
      item,
      parametros
    );

  const textoGrupo =
    obterTextoClassificacaoItem(item);

  const valorEsperadoParaComparacao =
    obterValorEsperadoParaComparacao(
      item,
      parametros,
      parametroCalculado
    );

  const tipoComparacao =
    parametroPorItem.tipoComparacao ||
    "QUALITATIVO";

  const valorLimite =
    parametroPorItem.valorLimite ||
    null;

  const unidade =
    parametroPorItem.unidade || "";

  const exigeValorNumerico =
    parametroPorItem.exigeValorNumerico ||
    false;

  const conformidade =
    avaliarConformidadeInfra({
      grupo: textoGrupo,

      valorEncontrado:
        item.valorEncontrado,

      valorEsperado:
        valorEsperadoParaComparacao,

      tipoComparacao,

      valorLimite,
    });

  return {
    ...item,

    parametroEsperadoCalculado:
      parametroCalculado,

    valorEsperadoComparacao:
      valorEsperadoParaComparacao,

    tipoComparacao,

    valorLimite,

    unidade,

    exigeValorNumerico,

    analiseConformidade:
      conformidade,

    criterioTecnicoCalculado:
      parametroPorItem.criterioTecnico ||
      item.criterio ||
      "Verificar conformidade técnica e operacional conforme RBAC aplicável.",

    comoInspecionarCalculado:
      parametroPorItem.comoInspecionar ||
      item.comoInspecionar ||
      "Realizar inspeção visual, conferência documental, registro fotográfico e comparação com a condição operacional declarada.",

    logicaConformidade:
      parametroPorItem.logicaConformidade ||
      "",

    parametrosInfra:
      parametros,

    aplicavel:
      verificarAplicabilidadeInfra(
        item,
        config
      ),
  };
}

export function gerarChecklistInfra(
  checklist = [],
  config = {}
) {
  return checklist.map((item) =>
    enriquecerItemInfra(item, config)
  );
}

export function gerarResumoTecnicoInfra(
  config = {}
) {
  const parametros =
    obterParametroInfra(config);

  const validacao =
    validarInfraestrutura(config);

  return {
    titulo:
      "Resumo Técnico INFRA",

    codigoReferencia:
      parametros.codigoReferencia,

    tipoOperacao:
      parametros.tipoOperacao,

    operacaoNoturna:
      parametros.operacaoNoturna,

    larguraMinimaPista:
      parametros.pista
        .larguraMinimaEsperada,

    larguraTaxiwayReferencial:
      parametros.taxiway
        .larguraMinimaReferencial,

    exigeRESA:
      parametros.resa.exigeRESA,

    comprimentoRESA:
      parametros.resa
        .comprimentoMinimo,

    larguraRESA:
      parametros.resa
        .larguraMinima,

    dimensaoRESA:
      parametros.resa
        .dimensaoEsperada ||
      parametros.resa
        .comprimentoMinimo,

    faixaPista:
      parametros.faixa
        .larguraFaixaPista,

    faixaPreparada:
      parametros.faixa
        .larguraFaixaPreparada,

    descricaoFaixaPreparada:
      parametros.faixa
        .descricaoFaixaPreparada ||
      parametros.faixa
        .larguraFaixaPreparada,

    exigeFaixaPreparada:
      parametros.faixa
        .exigeFaixaPreparada,

    criticidadeFaixa:
      parametros.faixa
        .criticidade,

    criticidadeRESA:
      parametros.resa
        .criticidade,

    exigeSinalizacaoLuminosa:
      parametros.sinalizacao
        .exigeSinalizacaoLuminosa,

    exigePosicaoEsperaIFR:
      parametros.sinalizacao
        .exigePosicaoEsperaIFR,

    alertasOperacionais:
      parametros.alertasOperacionais,

    validacao,
  };
}