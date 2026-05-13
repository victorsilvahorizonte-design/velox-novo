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
  
      tipoComparacao:
        k.tipoComparacao || "QUALITATIVO",
  
      valorLimite:
        k.valorLimite || null,
  
      unidade:
        k.unidade || "",
  
      exigeValorNumerico:
        k.exigeValorNumerico || false,
  
      logicaConformidade:
        k.logicaConformidade || "",
    };
  }
  
  function detectarAssunto(texto) {
    if (possui(texto, ["borracha", "zona de toque", "atrito"])) {
      return "borrachaZonaToque";
    }
  
    if (possui(texto, ["vegetacao", "grama", "capim", "mato", "altura"])) {
      return "vegetacao";
    }
  
    if (
      possui(texto, [
        "cerca operacional",
        "lado ar",
        "area operacional",
      ])
    ) {
      return "cercaOperacional";
    }
  
    if (
      possui(texto, [
        "cerca patrimonial",
        "sitio aeroportuario",
        "perimetro patrimonial",
      ])
    ) {
      return "cercaPatrimonial";
    }
  
    if (
      possui(texto, [
        "controle de acesso",
        "portao",
        "credencial",
        "guarita",
        "avsec",
      ])
    ) {
      return "controleAcesso";
    }
  
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
  
  export function gerarParametroInfraPorItem(
    item = {},
    config = {}
  ) {
    const texto = textoCompleto(item);
  
    const assunto = detectarAssunto(texto);
  
    const conhecimento =
      respostaBaseConhecimento(assunto);
  
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
          parametroEsperado:
            p.dimensaoCompleta,
  
          criterioTecnico: `
  Comprimento mínimo esperado:
  ${p.comprimentoEsperado}
  
  Largura mínima esperada:
  ${p.larguraEsperada}
  
  Este item trata da existência, aplicabilidade ou dimensão da RESA.
  `,
  
          comoInspecionar:
            "Confirmar existência da RESA, medir ou validar comprimento e largura disponíveis.",
  
          tipoComparacao:
            "DIMENSIONAL",
  
          exigeValorNumerico: true,
  
          valorLimite:
            p.comprimentoEsperado,
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "RESA operacionalmente disponível, livre de interferências críticas.",
  
        criterioTecnico:
          p.criterio,
  
        comoInspecionar:
          p.comoInspecionar,
  
        tipoComparacao:
          "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (texto.includes("faixa preparada")) {
      const p =
        obterParametroFaixaPreparada(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado:
            p.larguraEsperada,
  
          criterioTecnico:
            "A largura da faixa preparada deve ser compatível com o código de referência.",
  
          comoInspecionar:
            "Medir ou validar a largura preparada.",
  
          tipoComparacao:
            "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite:
            Number(
              String(p.larguraEsperada).replace(
                /[^\d]/g,
                ""
              )
            ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Faixa preparada em condição operacional adequada.",
  
        criterioTecnico:
          p.criterio,
  
        comoInspecionar:
          p.comoInspecionar,
  
        tipoComparacao:
          "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("faixa de pista") ||
      texto.includes("runway strip") ||
      texto.includes("infra-fxa")
    ) {
      const p =
        obterParametroFaixaPista(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado:
            p.larguraEsperada,
  
          criterioTecnico:
            "A largura da faixa de pista deve ser compatível com o código de referência.",
  
          comoInspecionar:
            "Medir ou validar largura total da faixa.",
  
          tipoComparacao:
            "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite:
            Number(
              String(p.larguraEsperada).replace(
                /[^\d]/g,
                ""
              )
            ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Faixa de pista em condição operacional segura.",
  
        criterioTecnico:
          p.criterio,
  
        comoInspecionar:
          p.comoInspecionar,
  
        tipoComparacao:
          "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("taxiway") ||
      texto.includes("pista de taxi")
    ) {
      const p =
        obterParametroTaxiway(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado:
            p.larguraEsperada,
  
          criterioTecnico:
            "A largura da taxiway deve ser compatível com a aeronave crítica.",
  
          comoInspecionar:
            "Medir ou validar largura e afastamentos.",
  
          tipoComparacao:
            "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite:
            Number(
              String(p.larguraEsperada).replace(
                /[^\d.]/g,
                ""
              )
            ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Taxiway em condição operacional segura.",
  
        criterioTecnico:
          p.criterio,
  
        comoInspecionar:
          p.comoInspecionar,
  
        tipoComparacao:
          "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    if (
      texto.includes("pista de pouso") ||
      texto.includes("infra-pst") ||
      texto.includes("largura da pista")
    ) {
      const p =
        obterParametroPista(config);
  
      if (ehDimensional(texto)) {
        return {
          parametroEsperado:
            p.larguraEsperada,
  
          criterioTecnico:
            "A largura da pista deve ser compatível com o código de referência.",
  
          comoInspecionar:
            "Medir ou validar largura operacional da pista.",
  
          tipoComparacao:
            "MINIMO",
  
          exigeValorNumerico: true,
  
          valorLimite:
            Number(
              String(p.larguraEsperada).replace(
                /[^\d]/g,
                ""
              )
            ),
  
          unidade: "m",
        };
      }
  
      return {
        parametroEsperado:
          "Pista em condição operacional segura.",
  
        criterioTecnico:
          p.criterio,
  
        comoInspecionar:
          p.comoInspecionar,
  
        tipoComparacao:
          "QUALITATIVO",
  
        exigeValorNumerico: false,
      };
    }
  
    return {
      parametroEsperado:
        item.parametroEsperado ||
        "Avaliar conforme operação aprovada.",
  
      criterioTecnico:
        item.criterio ||
        "Verificar conformidade técnica.",
  
      comoInspecionar:
        item.comoInspecionar ||
        "Realizar inspeção visual.",
  
      tipoComparacao:
        "QUALITATIVO",
  
      exigeValorNumerico: false,
    };
  }
  
  export function enriquecerItensInfra(
    itens = [],
    config = {}
  ) {
    return itens.map((item) => {
      const parametros =
        gerarParametroInfraPorItem(
          item,
          config
        );
  
      return {
        ...item,
  
        parametroEsperado:
          parametros.parametroEsperado,
  
        criterioTecnico:
          parametros.criterioTecnico,
  
        comoInspecionar:
          parametros.comoInspecionar,
  
        tipoComparacao:
          parametros.tipoComparacao,
  
        valorLimite:
          parametros.valorLimite,
  
        unidade:
          parametros.unidade,
  
        exigeValorNumerico:
          parametros.exigeValorNumerico,
  
        logicaConformidade:
          parametros.logicaConformidade,
      };
    });
  }
  
  export default gerarParametroInfraPorItem;