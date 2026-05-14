// src/engines/infraDimensionEngine.js
// Motor inteligente contextual do módulo INFRA
// V3 / infra-lab

import {
    obterParametroPista,
    obterParametroFaixaPista,
    obterParametroFaixaPreparada,
    obterParametroResa,
    obterParametroTaxiway,
  } from "../data/infra/parametros";
  
  import { buscarConhecimentoInfra } from "../data/infra/infraKnowledgeBase";
  
  function textoCompleto(item = {}) {
    return `
  ${item.id || ""}
  ${item.ref || ""}
  ${item.item || ""}
  ${item.grupo || ""}
  ${item.descricao || ""}
  ${item.criterio || ""}
  ${item.referenciaNormativa || ""}
  ${item.parametroEsperado || ""}
  `
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  
  function possui(texto, termos = []) {
    return termos.some((termo) => texto.includes(termo));
  }
  
  function respostaBaseConhecimento(chave) {
    const k = buscarConhecimentoInfra(chave);
  
    if (!k) return null;
  
    return {
      parametroEsperado: k.parametro,
  
      criterioTecnico: `${k.criterioTecnico}
  
  Origem técnica: ${k.origem}`,
  
      comoInspecionar: k.comoInspecionar,
  
      criticidadeTecnica: k.criticidade,
  
      assuntoTecnico: k.assunto,
  
      origemTecnica: k.origem,
  
      tipoComparacao: k.tipoComparacao || "QUALITATIVO",
  
      valorLimite: k.valorLimite || null,
  
      unidade: k.unidade || "",
  
      exigeValorNumerico: k.exigeValorNumerico || false,
  
      logicaConformidade: k.logicaConformidade || "",
    };
  }
  
  function detectarAssunto(texto) {
    // =====================================================
    // CERCA OPERACIONAL - ALTURA
    // =====================================================
  
    if (
      possui(texto, [
        "altura da cerca operacional",
        "altura cerca operacional",
        "altura do alambrado operacional",
      ])
    ) {
      return "cercaOperacionalAltura";
    }
  
    // =====================================================
    // CERCA PATRIMONIAL - ALTURA
    // =====================================================
  
    if (
      possui(texto, [
        "altura da cerca patrimonial",
        "altura cerca patrimonial",
        "altura do alambrado patrimonial",
      ])
    ) {
      return "cercaPatrimonialAltura";
    }
  
    // =====================================================
    // CONTROLE DE ACESSO
    // =====================================================
  
    if (
      possui(texto, [
        "controle de acesso",
        "controle avsec",
        "portao",
        "portoes",
        "guarita",
        "credencial",
        "acesso ao lado ar",
      ])
    ) {
      return "controleAcesso";
    }
  
    // =====================================================
    // CERCA OPERACIONAL
    // =====================================================
  
    if (
      possui(texto, [
        "cerca operacional",
        "lado ar",
        "perimetro operacional",
      ])
    ) {
      return "cercaOperacional";
    }
  
    // =====================================================
    // CERCA PATRIMONIAL
    // =====================================================
  
    if (
      possui(texto, [
        "cerca patrimonial",
        "sitio aeroportuario",
        "perimetro patrimonial",
      ])
    ) {
      return "cercaPatrimonial";
    }
  
    // =====================================================
    // VEGETAÇÃO
    // =====================================================
  
    if (
      possui(texto, [
        "vegetacao",
        "grama",
        "capim",
        "mato",
        "arbusto",
      ])
    ) {
      return "vegetacao";
    }
  
    // =====================================================
    // BORRACHA / ATRITO
    // =====================================================
  
    if (
      possui(texto, [
        "borracha",
        "zona de toque",
        "atrito",
      ])
    ) {
      return "borrachaZonaToque";
    }
  
    // =====================================================
    // ÁREA RESTRITA
    // =====================================================
  
    if (
      possui(texto, [
        "area restrita",
        "interditada",
        "fora de servico",
        "obra",
      ])
    ) {
      return "areaRestrita";
    }
  
    // =====================================================
    // TAXIWAY - POSIÇÃO DE ESPERA IFR
    // =====================================================
  
    if (
      possui(texto, [
        "posicao de espera",
        "holding point",
        "holding position",
        "espera ifr",
      ])
    ) {
      return "posicaoEsperaIFR";
    }
  
    // =====================================================
    // TAXIWAY - GEOMETRIA / FILLET
    // =====================================================
  
    if (
      possui(texto, [
        "fillet",
        "geometria da taxiway",
        "curva da taxiway",
        "curvas da taxiway",
        "aeronave critica",
      ])
    ) {
      return "geometriaTaxiway";
    }
  
    // =====================================================
    // TAXIWAY - OBSTÁCULOS
    // =====================================================
  
    if (
      texto.includes("taxiway") &&
      possui(texto, [
        "obstaculo",
        "obstaculos",
        "objeto",
        "veiculo",
        "equipamento",
        "interferencia",
      ])
    ) {
      return "obstaculosTaxiway";
    }
  
    // =====================================================
    // TAXIWAY - DRENAGEM
    // =====================================================
  
    if (
      texto.includes("taxiway") &&
      possui(texto, [
        "drenagem",
        "agua",
        "empoçamento",
        "erosao",
        "vala",
        "canaleta",
      ])
    ) {
      return "drenagemTaxiway";
    }
  
    // =====================================================
    // FOD
    // =====================================================
  
    if (
      possui(texto, [
        "fod",
        "objeto estranho",
        "objetos estranhos",
        "detrito",
      ])
    ) {
      return "fod";
    }
  
    // =====================================================
    // SINALIZAÇÃO LUMINOSA
    // =====================================================
  
    if (
      possui(texto, [
        "sinalizacao luminosa",
        "luzes",
        "balizamento",
        "papi",
      ])
    ) {
      return "sinalizacaoLuminosa";
    }
  
    // =====================================================
    // SINALIZAÇÃO HORIZONTAL
    // =====================================================
  
    if (
      possui(texto, [
        "sinalizacao",
        "pintura",
        "marcacao",
        "marca horizontal",
        "placa",
      ])
    ) {
      return "sinalizacaoHorizontal";
    }
  
    // =====================================================
    // DRENAGEM
    // =====================================================
  
    if (
      possui(texto, [
        "drenagem",
        "agua",
        "poca",
        "empoçamento",
        "erosao",
        "vala",
      ])
    ) {
      if (texto.includes("resa")) return "drenagemResa";
  
      if (texto.includes("faixa")) return "drenagemFaixa";
  
      return "drenagemPista";
    }
  
    // =====================================================
    // OBSTÁCULOS
    // =====================================================
  
    if (
      possui(texto, [
        "obstaculo",
        "obstaculos",
        "objeto fixo",
        "poste",
        "torre",
        "talude",
      ])
    ) {
      if (texto.includes("resa")) return "obstaculosResa";
  
      if (texto.includes("faixa")) return "obstaculosFaixa";
    }
  
    // =====================================================
    // SUPERFÍCIE
    // =====================================================
  
    if (
      possui(texto, [
        "superficie",
        "regularidade",
        "nivelamento",
        "compactacao",
        "suporte",
        "solo",
        "recalque",
      ])
    ) {
      if (texto.includes("resa")) return "superficieResa";
  
      if (texto.includes("faixa")) return "superficieFaixa";
    }
  
    // =====================================================
    // PAVIMENTO
    // =====================================================
  
    if (
      possui(texto, [
        "pavimento",
        "trinca",
        "buraco",
        "deformacao",
        "revestimento",
      ])
    ) {
      if (
        texto.includes("taxiway") ||
        texto.includes("pista de taxi")
      ) {
        return "taxiwayPavimento";
      }
  
      return "pavimentoPista";
    }
  
    return null;
  }
  
  function ehDimensional(texto) {
    return possui(texto, [
      "largura",
      "comprimento",
      "dimensao",
      "distancia",
      "separacao",
      "afastamento",
      "medida",
      "dimensionamento",
    ]);
  }
  
  export function gerarParametroInfraPorItem(item = {}, config = {}) {
    const texto = textoCompleto(item);
  
    const assunto = detectarAssunto(texto);
  
    const conhecimento = respostaBaseConhecimento(assunto);
  
    if (conhecimento) {
      return conhecimento;
    }
  
    if (texto.includes("resa")) {
      const p = obterParametroResa(config);
  
      if (
        ehDimensional(texto) ||
        texto.includes("infra-resa-001") ||
        texto.includes("infra-resa-002")
      ) {
        return {
          parametroEsperado: p.dimensaoCompleta,
  
          criterioTecnico: `
  Comprimento mínimo esperado:
  ${p.comprimentoEsperado}
  
  Largura mínima esperada:
  ${p.larguraEsperada}
  `,
  
          comoInspecionar:
            "Confirmar existência da RESA e medir dimensões.",
  
          tipoComparacao: "DIMENSIONAL",
  
          exigeValorNumerico: true,
  
          valorLimite: p.comprimentoEsperado,
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "RESA operacionalmente segura.",
  
        criterioTecnico: p.criterio,
  
        comoInspecionar: p.comoInspecionar,
  
        tipoComparacao: "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (texto.includes("faixa preparada")) {
      const p = obterParametroFaixaPreparada(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado: p.larguraEsperada,
  
          criterioTecnico:
            "Largura compatível com o código de referência.",
  
          comoInspecionar:
            "Medir largura da faixa preparada.",
  
          tipoComparacao: "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite: Number(
            String(p.larguraEsperada).replace(/[^\d]/g, "")
          ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Faixa preparada operacionalmente segura.",
  
        criterioTecnico: p.criterio,
  
        comoInspecionar: p.comoInspecionar,
  
        tipoComparacao: "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("faixa de pista") ||
      texto.includes("runway strip") ||
      texto.includes("infra-fxa")
    ) {
      const p = obterParametroFaixaPista(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado: p.larguraEsperada,
  
          criterioTecnico:
            "Largura da faixa compatível com o código.",
  
          comoInspecionar:
            "Medir largura total da faixa.",
  
          tipoComparacao: "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite: Number(
            String(p.larguraEsperada).replace(/[^\d]/g, "")
          ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Faixa operacionalmente segura.",
  
        criterioTecnico: p.criterio,
  
        comoInspecionar: p.comoInspecionar,
  
        tipoComparacao: "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("taxiway") ||
      texto.includes("pista de taxi")
    ) {
      const p = obterParametroTaxiway(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado: p.larguraEsperada,
  
          criterioTecnico:
            "Largura compatível com aeronave crítica.",
  
          comoInspecionar:
            "Medir largura e afastamentos.",
  
          tipoComparacao: "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite: Number(
            String(p.larguraEsperada).replace(/[^\d.]/g, "")
          ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Taxiway operacionalmente segura.",
  
        criterioTecnico: p.criterio,
  
        comoInspecionar: p.comoInspecionar,
  
        tipoComparacao: "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("pista de pouso") ||
      texto.includes("infra-pst") ||
      texto.includes("largura da pista")
    ) {
      const p = obterParametroPista(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado: p.larguraEsperada,
  
          criterioTecnico:
            "Largura da pista compatível com o código.",
  
          comoInspecionar:
            "Medir largura operacional da pista.",
  
          tipoComparacao: "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite: Number(
            String(p.larguraEsperada).replace(/[^\d]/g, "")
          ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Pista operacionalmente segura.",
  
        criterioTecnico: p.criterio,
  
        comoInspecionar: p.comoInspecionar,
  
        tipoComparacao: "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    return {
      parametroEsperado:
        item.parametroEsperado ||
        "Avaliar conforme operação aprovada.",
  
      criterioTecnico:
        item.criterio || "Verificar conformidade técnica.",
  
      comoInspecionar:
        item.comoInspecionar || "Realizar inspeção visual.",
  
      tipoComparacao: "QUALITATIVO",
  
      exigeValorNumerico: false,
    };
  }
  
  export function enriquecerItensInfra(itens = [], config = {}) {
    return itens.map((item) => {
      const parametros = gerarParametroInfraPorItem(item, config);
  
      return {
        ...item,
  
        parametroEsperado: parametros.parametroEsperado,
  
        criterioTecnico: parametros.criterioTecnico,
  
        comoInspecionar: parametros.comoInspecionar,
  
        tipoComparacao: parametros.tipoComparacao,
  
        valorLimite: parametros.valorLimite,
  
        unidade: parametros.unidade,
  
        exigeValorNumerico: parametros.exigeValorNumerico,
  
        logicaConformidade: parametros.logicaConformidade,
      };
    });
  }
  
  export default gerarParametroInfraPorItem;