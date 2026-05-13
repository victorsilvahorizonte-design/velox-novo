// src/data/infra/parametros.js
// Parâmetros técnicos base para o módulo INFRA
// V3 - infra-lab

export const PARAMETROS_INFRA = {
    pista: {
      larguraMinima: {
        "1A": "18 m",
        "1B": "18 m",
        "2A": "23 m",
        "2B": "23 m",
        "2C": "30 m",
        "3C": "30 m",
        "3D": "45 m",
        "4C": "45 m",
        "4D": "45 m",
        "4E": "45 m",
        "4F": "60 m",
      },
  
      criterio:
        "A largura da pista deve ser compatível com o código de referência do aeródromo e aeronave crítica.",
  
      comoInspecionar:
        "Verificar largura publicada, levantamento em campo, degradações laterais, obstáculos e compatibilidade operacional.",
    },
  
    faixaPista: {
      larguraTotalEsperada: {
        "1": {
          VFR: "60 m",
          IFR: "150 m",
        },
  
        "2": {
          VFR: "80 m",
          IFR: "150 m",
        },
  
        "3": {
          VFR: "150 m",
          IFR: "300 m",
        },
  
        "4": {
          VFR: "150 m",
          IFR: "300 m",
        },
      },
  
      criterio:
        "A faixa de pista deve proteger aeronaves em caso de saída lateral ou longitudinal da pista.",
  
      comoInspecionar:
        "Verificar largura total, obstáculos, vegetação, drenagem, erosões e objetos incompatíveis.",
    },
  
    faixaPreparada: {
      larguraNumerica: {
        "1": "30 m",
        "2": "40 m",
        "3": "75 m",
        "4": "150 m",
      },
  
      descricaoOperacional: {
        "1": "Faixa preparada compatível com operação básica.",
        "2": "Faixa preparada compatível com operação regional.",
        "3": "Faixa preparada para pista de maior porte.",
        "4": "Faixa preparada para aeronaves críticas de grande porte.",
      },
  
      criterio:
        "A faixa preparada deve reduzir riscos de danos à aeronave em excursões de pista.",
  
      comoInspecionar:
        "Verificar compactação, drenagem, erosões, nivelamento, objetos fixos e resistência do solo.",
    },
  
    resa: {
      comprimentoNumerico: {
        "1": "90 m",
        "2": "90 m",
        "3": "90 m",
        "4": "240 m",
      },
  
      larguraNumerica: {
        "1": "36 m",
        "2": "46 m",
        "3": "60 m",
        "4": "90 m",
      },
  
      criterio:
        "A RESA deve reduzir riscos de danos à aeronave em caso de excursão ou ultrapassagem de pista.",
  
      comoInspecionar:
        "Verificar comprimento, largura, nivelamento, drenagem, obstáculos, erosões, cercas, taludes e objetos fixos.",
    },
  
    taxiway: {
      larguraMinima: {
        A: "7.5 m",
        B: "10.5 m",
        C: "15 m",
        D: "18 m",
        E: "23 m",
        F: "25 m",
      },
  
      criterio:
        "A largura da taxiway deve ser compatível com aeronave crítica e letra do código.",
  
      comoInspecionar:
        "Verificar largura, separações, curvas, sinalização, luzes, FOD e obstáculos laterais.",
    },
  
    acostamentoPista: {
      aplicabilidade:
        "Aplicável principalmente para códigos D, E e F.",
  
      criterio:
        "Acostamento deve reduzir riscos operacionais e ingestão de detritos.",
  
      comoInspecionar:
        "Verificar pavimentação, degraus, drenagem, FOD e resistência aparente.",
    },
  
    sinalizacaoHorizontal: {
      criterio:
        "Marcas operacionais devem estar visíveis, coerentes e sem conflito operacional.",
  
      comoInspecionar:
        "Verificar eixo, cabeceiras, zonas de toque, taxiways, posições de espera e contraste.",
    },
  
    sinalizacaoLuminosa: {
      aplicabilidade:
        "Aplicável em operações IFR ou noturnas.",
  
      criterio:
        "Auxílios luminosos devem estar funcionais e alinhados.",
  
      comoInspecionar:
        "Verificar luzes apagadas, intensidade, alinhamento e obstruções.",
    },
  
    drenagem: {
      criterio:
        "Sistema de drenagem deve evitar acúmulo de água e erosões.",
  
      comoInspecionar:
        "Verificar poças, canais, bueiros, erosões e obstruções.",
    },
  
    pavimento: {
      criterio:
        "Pavimento deve manter condição operacional segura.",
  
      comoInspecionar:
        "Verificar trincas, buracos, deformações, FOD e aderência.",
    },
  
    objetosEstranhos: {
      criterio:
        "Área operacional deve permanecer livre de FOD.",
  
      comoInspecionar:
        "Inspecionar pista, taxiway, faixa e áreas adjacentes.",
    },
  
    areasRestritasInfra: {
      criterio:
        "Áreas interditadas devem estar segregadas e sinalizadas.",
  
      comoInspecionar:
        "Verificar cones, barreiras, NOTAM, isolamento e coerência operacional.",
    },
  };
  
  export function obterChaveCodigo(codigoNumero, codigoLetra) {
    return `${String(codigoNumero || "").trim()}${String(codigoLetra || "")
      .trim()
      .toUpperCase()}`;
  }
  
  export function obterParametroPista(config = {}) {
    const chave = obterChaveCodigo(
      config.codigoNumero,
      config.codigoLetra
    );
  
    return {
      larguraEsperada:
        PARAMETROS_INFRA.pista.larguraMinima[chave] ||
        "Parâmetro não encontrado",
  
      criterio: PARAMETROS_INFRA.pista.criterio,
  
      comoInspecionar:
        PARAMETROS_INFRA.pista.comoInspecionar,
    };
  }
  
  export function obterParametroFaixaPista(config = {}) {
    const numero = String(config.codigoNumero || "").trim();
  
    const tipoOperacao = String(
      config.tipoOperacao || "VFR"
    ).toUpperCase();
  
    return {
      larguraEsperada:
        PARAMETROS_INFRA.faixaPista
          .larguraTotalEsperada?.[numero]?.[
          tipoOperacao
        ] || "Parâmetro não encontrado",
  
      criterio:
        PARAMETROS_INFRA.faixaPista.criterio,
  
      comoInspecionar:
        PARAMETROS_INFRA.faixaPista
          .comoInspecionar,
    };
  }
  
  export function obterParametroFaixaPreparada(config = {}) {
    const numero = String(config.codigoNumero || "").trim();
  
    return {
      larguraEsperada:
        PARAMETROS_INFRA.faixaPreparada
          .larguraNumerica[numero] ||
        "Verificar cenário",
  
      descricaoOperacional:
        PARAMETROS_INFRA.faixaPreparada
          .descricaoOperacional[numero] ||
        "Verificar cenário",
  
      criterio:
        PARAMETROS_INFRA.faixaPreparada.criterio,
  
      comoInspecionar:
        PARAMETROS_INFRA.faixaPreparada
          .comoInspecionar,
    };
  }
  
  export function obterParametroResa(config = {}) {
    const numero = String(config.codigoNumero || "").trim();
  
    const comprimento =
      PARAMETROS_INFRA.resa
        .comprimentoNumerico[numero] ||
      "90 m";
  
    const largura =
      PARAMETROS_INFRA.resa
        .larguraNumerica[numero] ||
      "60 m";
  
    return {
      comprimentoEsperado: comprimento,
  
      larguraEsperada: largura,
  
      dimensaoCompleta:
        `${comprimento} x ${largura}`,
  
      criterio:
        PARAMETROS_INFRA.resa.criterio,
  
      comoInspecionar:
        PARAMETROS_INFRA.resa
          .comoInspecionar,
    };
  }
  
  export function obterParametroTaxiway(config = {}) {
    const letra = String(
      config.codigoLetra || ""
    )
      .trim()
      .toUpperCase();
  
    return {
      larguraEsperada:
        PARAMETROS_INFRA.taxiway
          .larguraMinima[letra] ||
        "Parâmetro não encontrado",
  
      criterio:
        PARAMETROS_INFRA.taxiway.criterio,
  
      comoInspecionar:
        PARAMETROS_INFRA.taxiway
          .comoInspecionar,
    };
  }
  
  export default PARAMETROS_INFRA;