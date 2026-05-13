// src/engines/infraComplianceEngine.js
// Motor de conformidade operacional INFRA
// RBAC 154 + RBAC 153
// V3 - Comparação inteligente: mínimo, máximo, dimensional e qualitativo

function extrairNumeros(valor) {
    if (valor === null || valor === undefined) return [];
  
    const texto = String(valor).replace(",", ".");
  
    const encontrados = texto.match(/\d+(\.\d+)?/g);
  
    if (!encontrados) return [];
  
    return encontrados.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
  }
  
  function textoContemDimensaoDupla(valor) {
    const texto = String(valor || "").toLowerCase();
  
    return (
      texto.includes(" x ") ||
      texto.includes("x") ||
      texto.includes("×") ||
      texto.includes("comprimento") ||
      texto.includes("largura")
    );
  }
  
  function compararValores({
    grupo,
    encontrado,
    esperado,
    tipoComparacao,
    valorLimite,
  }) {
    const tipo = String(tipoComparacao || "MINIMO").toUpperCase();
  
    if (tipo === "QUALITATIVO") {
      return {
        status: "AVALIAÇÃO MANUAL",
        conformidade: null,
        valorEncontradoNumerico: 0,
        valorEsperadoNumerico: 0,
        detalhesDimensionais: null,
      };
    }
  
    const valoresEncontrados = extrairNumeros(encontrado);
  
    if (!valoresEncontrados.length) {
      return {
        status: "NÃO VERIFICADO",
        conformidade: false,
        valorEncontradoNumerico: 0,
        valorEsperadoNumerico: Number(valorLimite || 0),
        detalhesDimensionais: null,
      };
    }
  
    if (tipo === "MAXIMO") {
      const valorEncontrado = valoresEncontrados[0];
      const limite = Number(valorLimite || extrairNumeros(esperado)[0] || 0);
  
      if (!limite) {
        return {
          status: "NÃO VERIFICADO",
          conformidade: false,
          valorEncontradoNumerico: valorEncontrado,
          valorEsperadoNumerico: 0,
          detalhesDimensionais: null,
        };
      }
  
      const conforme = valorEncontrado <= limite;
  
      return {
        status: conforme ? "CONFORME" : "NÃO CONFORME",
        conformidade: conforme,
        valorEncontradoNumerico: valorEncontrado,
        valorEsperadoNumerico: limite,
        detalhesDimensionais: {
          tipo: "LIMITE_MAXIMO",
          valorEncontrado,
          valorLimite: limite,
          valorConforme: conforme,
        },
      };
    }
  
    const valoresEsperados = extrairNumeros(valorLimite || esperado);
  
    if (!valoresEsperados.length) {
      return {
        status: "NÃO VERIFICADO",
        conformidade: false,
        valorEncontradoNumerico: valoresEncontrados[0] || 0,
        valorEsperadoNumerico: 0,
        detalhesDimensionais: null,
      };
    }
  
    const grupoUpper = String(grupo || "").toUpperCase();
  
    const deveCompararDimensaoDupla =
      tipo === "DIMENSIONAL" &&
      (grupoUpper.includes("RESA") ||
        textoContemDimensaoDupla(esperado) ||
        textoContemDimensaoDupla(encontrado));
  
    if (deveCompararDimensaoDupla && valoresEsperados.length >= 2) {
      const comprimentoEsperado = valoresEsperados[0];
      const larguraEsperada = valoresEsperados[1];
  
      const comprimentoEncontrado = valoresEncontrados[0] || 0;
      const larguraEncontrada = valoresEncontrados[1] || 0;
  
      const comprimentoConforme = comprimentoEncontrado >= comprimentoEsperado;
      const larguraConforme = larguraEncontrada >= larguraEsperada;
  
      const conforme = comprimentoConforme && larguraConforme;
  
      return {
        status: conforme ? "CONFORME" : "NÃO CONFORME",
        conformidade: conforme,
        valorEncontradoNumerico: comprimentoEncontrado,
        valorEsperadoNumerico: comprimentoEsperado,
        detalhesDimensionais: {
          tipo: "DIMENSIONAL_DUPLA",
          comprimentoEsperado,
          larguraEsperada,
          comprimentoEncontrado,
          larguraEncontrada,
          comprimentoConforme,
          larguraConforme,
        },
      };
    }
  
    const valorEncontrado = valoresEncontrados[0];
    const valorEsperado = valoresEsperados[0];
  
    const conforme = valorEncontrado >= valorEsperado;
  
    return {
      status: conforme ? "CONFORME" : "NÃO CONFORME",
      conformidade: conforme,
      valorEncontradoNumerico: valorEncontrado,
      valorEsperadoNumerico: valorEsperado,
      detalhesDimensionais: {
        tipo: "LIMITE_MINIMO",
        valorEsperado,
        valorEncontrado,
        valorConforme: conforme,
      },
    };
  }
  
  function calcularCriticidade(grupo, conformidade, detalhesDimensionais) {
    if (conformidade === true) return "ACEITÁVEL";
  
    if (conformidade === null) return "AVALIAÇÃO MANUAL";
  
    const grupoUpper = String(grupo || "").toUpperCase();
  
    if (
      grupoUpper.includes("RESA") ||
      detalhesDimensionais?.tipo === "DIMENSIONAL_DUPLA"
    ) {
      return "CRÍTICA";
    }
  
    if (grupoUpper.includes("PISTA")) return "CRÍTICA";
  
    if (grupoUpper.includes("FAIXA")) return "ALTA";
  
    if (grupoUpper.includes("TAXIWAY")) return "MÉDIA";
  
    if (grupoUpper.includes("SINALIZA")) return "ALTA";
  
    return "MÉDIA";
  }
  
  function gerarRecomendacao(grupo, criticidade, detalhesDimensionais) {
    if (criticidade === "AVALIAÇÃO MANUAL") {
      return `
  Este item exige avaliação qualitativa do inspetor.
  Marque CONFORME ou NÃO CONFORME conforme a condição observada em campo.
  `;
    }
  
    const grupoUpper = String(grupo || "").toUpperCase();
  
    if (criticidade === "CRÍTICA") {
      const falhaComprimento =
        detalhesDimensionais?.tipo === "DIMENSIONAL_DUPLA" &&
        detalhesDimensionais.comprimentoConforme === false;
  
      const falhaLargura =
        detalhesDimensionais?.tipo === "DIMENSIONAL_DUPLA" &&
        detalhesDimensionais.larguraConforme === false;
  
      if (
        grupoUpper.includes("RESA") ||
        detalhesDimensionais?.tipo === "DIMENSIONAL_DUPLA"
      ) {
        return `
  Necessária ação corretiva imediata.
  Avaliar impacto em excursão de pista, pouso antes da cabeceira ou ultrapassagem de final de pista.
  ${falhaComprimento ? "Comprimento abaixo do parâmetro esperado." : ""}
  ${falhaLargura ? "Largura abaixo do parâmetro esperado." : ""}
  Considerar restrição operacional até avaliação técnica.
  `;
      }
  
      if (grupoUpper.includes("PISTA")) {
        return `
  Necessária ação corretiva imediata.
  Avaliar restrição operacional da pista e compatibilidade com a aeronave crítica.
  `;
      }
  
      return `
  Necessária ação corretiva imediata.
  Avaliar restrição operacional do aeródromo.
  `;
    }
  
    if (criticidade === "ALTA") {
      return `
  Necessária correção prioritária.
  Monitoramento operacional reforçado recomendado.
  `;
    }
  
    if (criticidade === "MÉDIA") {
      return `
  Programar adequação operacional conforme plano de ação.
  `;
    }
  
    return `
  Condição operacional aceitável.
  `;
  }
  
  export function avaliarConformidadeInfra({
    grupo,
    valorEncontrado,
    valorEsperado,
    tipoComparacao = "MINIMO",
    valorLimite = null,
  }) {
    const comparacao = compararValores({
      grupo,
      encontrado: valorEncontrado,
      esperado: valorEsperado,
      tipoComparacao,
      valorLimite,
    });
  
    const criticidade = calcularCriticidade(
      grupo,
      comparacao.conformidade,
      comparacao.detalhesDimensionais
    );
  
    const recomendacao = gerarRecomendacao(
      grupo,
      criticidade,
      comparacao.detalhesDimensionais
    );
  
    return {
      status: comparacao.status,
      conformidade: comparacao.conformidade,
      criticidade,
      recomendacao,
      valorEncontrado,
      valorEsperado,
      tipoComparacao,
      valorLimite,
      valorEncontradoNumerico: comparacao.valorEncontradoNumerico,
      valorEsperadoNumerico: comparacao.valorEsperadoNumerico,
      detalhesDimensionais: comparacao.detalhesDimensionais,
    };
  }