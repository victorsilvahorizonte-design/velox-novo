// src/data/infra/infraKnowledgeBase.js
// Base inteligente de conhecimento técnico INFRA
// V3 / infra-lab

export const INFRA_KNOWLEDGE_BASE = {
    vegetacao: {
      id: "vegetacao",
      assunto: "Vegetação em áreas operacionais",
      tipoComparacao: "MAXIMO",
      valorLimite: 15,
      unidade: "cm",
      exigeValorNumerico: true,
      parametro:
        "Vegetação controlada em áreas operacionais. Altura máxima operacional recomendada: 15 cm.",
      criterioTecnico:
        "Vegetação acima de 15 cm pode ocultar obstáculos, favorecer fauna, comprometer drenagem, reduzir visibilidade de sinalização e dificultar inspeções.",
      comoInspecionar:
        "Medir ou estimar altura predominante da vegetação na faixa de pista e áreas adjacentes.",
      logicaConformidade:
        "CONFORME quando altura da vegetação for menor ou igual a 15 cm.",
      criticidade: "MÉDIA",
      origem: "RBAC 153 / manutenção operacional",
    },
  
    borrachaZonaToque: {
      id: "borrachaZonaToque",
      assunto: "Borracha acumulada na zona de toque",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A zona de toque deve permanecer sem acúmulo excessivo de borracha.",
      criterioTecnico:
        "Acúmulo de borracha pode reduzir coeficiente de atrito.",
      comoInspecionar:
        "Inspecionar visualmente as zonas de toque.",
      logicaConformidade:
        "Avaliação qualitativa do acúmulo de borracha.",
      criticidade: "ALTA",
      origem: "RBAC 153",
    },
  
    pavimentoPista: {
      id: "pavimentoPista",
      assunto: "Condição do pavimento da pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Pavimento íntegro, regular e sem defeitos críticos.",
      criterioTecnico:
        "Defeitos podem gerar FOD e comprometer frenagem.",
      comoInspecionar:
        "Verificar trincas, buracos, deformações e material solto.",
      logicaConformidade:
        "Avaliação qualitativa do pavimento.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    drenagemPista: {
      id: "drenagemPista",
      assunto: "Drenagem da pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A pista deve permanecer sem empoçamentos.",
      criterioTecnico:
        "Drenagem inadequada aumenta risco de aquaplanagem.",
      comoInspecionar:
        "Verificar poças, pontos baixos e escoamento.",
      logicaConformidade:
        "CONFORME quando não houver acúmulo significativo de água.",
      criticidade: "ALTA",
      origem: "RBAC 153",
    },
  
    drenagemFaixa: {
      id: "drenagemFaixa",
      assunto: "Drenagem da faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A faixa deve possuir drenagem funcional.",
      criterioTecnico:
        "Erosões e valas podem comprometer suporte operacional.",
      comoInspecionar:
        "Verificar erosões, valas e solo saturado.",
      logicaConformidade:
        "Avaliação qualitativa da drenagem da faixa.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    drenagemResa: {
      id: "drenagemResa",
      assunto: "Drenagem da RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "RESA sem erosões críticas ou empoçamentos.",
      criterioTecnico:
        "Falhas de drenagem reduzem suporte da RESA.",
      comoInspecionar:
        "Verificar erosões, água acumulada e saturação.",
      logicaConformidade:
        "Avaliação qualitativa da drenagem da RESA.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    obstaculosResa: {
      id: "obstaculosResa",
      assunto: "Obstáculos na RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "RESA livre de obstáculos incompatíveis.",
      criterioTecnico:
        "Obstáculos agravam danos em excursões.",
      comoInspecionar:
        "Percorrer visualmente a RESA.",
      logicaConformidade:
        "CONFORME quando a RESA estiver livre de obstáculos incompatíveis.",
      criticidade: "CRÍTICA",
      origem: "RBAC 154",
    },
  
    superficieResa: {
      id: "superficieResa",
      assunto: "Regularidade superficial da RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Superfície regular e estável.",
      criterioTecnico:
        "Irregularidades aumentam danos à aeronave.",
      comoInspecionar:
        "Verificar nivelamento e suporte.",
      logicaConformidade:
        "Avaliação qualitativa da superfície.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    obstaculosFaixa: {
      id: "obstaculosFaixa",
      assunto: "Obstáculos na faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Faixa livre de obstáculos incompatíveis.",
      criterioTecnico:
        "Objetos incompatíveis aumentam danos em excursões.",
      comoInspecionar:
        "Verificar postes, objetos, vegetação e valas.",
      logicaConformidade:
        "Avaliação qualitativa da faixa.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    superficieFaixa: {
      id: "superficieFaixa",
      assunto: "Regularidade da faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Faixa com superfície regular.",
      criterioTecnico:
        "Desníveis aumentam danos à aeronave.",
      comoInspecionar:
        "Verificar erosões, recalques e irregularidades.",
      logicaConformidade:
        "Avaliação qualitativa da faixa.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    fod: {
      id: "fod",
      assunto: "Objetos estranhos / FOD",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Áreas operacionais livres de FOD.",
      criterioTecnico:
        "FOD pode causar danos graves às aeronaves.",
      comoInspecionar:
        "Inspecionar pista, taxiway, pátio e acostamentos.",
      logicaConformidade:
        "CONFORME quando área estiver livre de FOD.",
      criticidade: "ALTA",
      origem: "RBAC 153",
    },
  
    sinalizacaoHorizontal: {
      id: "sinalizacaoHorizontal",
      assunto: "Sinalização horizontal",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Sinalização visível e coerente.",
      criterioTecnico:
        "Sinalização ruim aumenta risco operacional.",
      comoInspecionar:
        "Verificar eixo, bordas e marcações.",
      logicaConformidade:
        "Avaliação qualitativa da sinalização.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    sinalizacaoLuminosa: {
      id: "sinalizacaoLuminosa",
      assunto: "Sinalização luminosa",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Auxílios luminosos operacionais.",
      criterioTecnico:
        "Falhas comprometem operações noturnas.",
      comoInspecionar:
        "Verificar alinhamento e funcionamento.",
      logicaConformidade:
        "Avaliação qualitativa do balizamento.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    taxiwayPavimento: {
      id: "taxiwayPavimento",
      assunto: "Pavimento da taxiway",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Taxiway com pavimento íntegro.",
      criterioTecnico:
        "Defeitos geram FOD e risco operacional.",
      comoInspecionar:
        "Verificar trincas, buracos e deformações.",
      logicaConformidade:
        "Avaliação qualitativa da taxiway.",
      criticidade: "MÉDIA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    obstaculosTaxiway: {
      id: "obstaculosTaxiway",
      assunto: "Obstáculos laterais na taxiway",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Taxiway e áreas laterais livres de obstáculos incompatíveis.",
      criterioTecnico:
        "Objetos laterais podem comprometer taxiamento.",
      comoInspecionar:
        "Percorrer lateralmente a taxiway verificando objetos e interferências.",
      logicaConformidade:
        "CONFORME quando não houver obstáculos incompatíveis.",
      criticidade: "CRÍTICA",
      origem: "RBAC 154",
    },
  
    drenagemTaxiway: {
      id: "drenagemTaxiway",
      assunto: "Drenagem da taxiway",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Taxiway sem empoçamentos ou erosões críticas.",
      criterioTecnico:
        "Drenagem inadequada aumenta degradação do pavimento.",
      comoInspecionar:
        "Verificar canaletas, grelhas e pontos baixos.",
      logicaConformidade:
        "CONFORME quando não houver acúmulo de água.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    posicaoEsperaIFR: {
      id: "posicaoEsperaIFR",
      assunto: "Posição de espera IFR",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Posições de espera corretamente identificadas.",
      criterioTecnico:
        "Falhas podem gerar incursão em pista.",
      comoInspecionar:
        "Verificar pintura, placas e visibilidade.",
      logicaConformidade:
        "Avaliação qualitativa da posição de espera.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    geometriaTaxiway: {
      id: "geometriaTaxiway",
      assunto: "Geometria e fillet da taxiway",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Curvas compatíveis com a aeronave crítica.",
      criterioTecnico:
        "Curvas inadequadas podem causar saída de pavimento.",
      comoInspecionar:
        "Verificar marcas de pneu e desgaste lateral.",
      logicaConformidade:
        "Avaliação qualitativa da geometria.",
      criticidade: "ALTA",
      origem: "RBAC 154",
    },
  
    cercaOperacional: {
      id: "cercaOperacional",
      assunto: "Cerca operacional",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Cerca operacional contínua e íntegra.",
      criterioTecnico:
        "A cerca protege áreas operacionais.",
      comoInspecionar:
        "Verificar continuidade, brechas e integridade.",
      logicaConformidade:
        "Avaliação qualitativa da cerca operacional.",
      criticidade: "ALTA",
      origem: "RBAC 107",
    },
  
    cercaOperacionalAltura: {
      id: "cercaOperacionalAltura",
      assunto: "Altura da cerca operacional",
      tipoComparacao: "MINIMO",
      valorLimite: 2.4,
      unidade: "m",
      exigeValorNumerico: true,
      parametro:
        "Altura mínima operacional recomendada: 2,40 m.",
      criterioTecnico:
        "Alturas inferiores facilitam invasões.",
      comoInspecionar:
        "Medir altura da cerca operacional.",
      logicaConformidade:
        "CONFORME quando >= 2,40 m.",
      criticidade: "CRÍTICA",
      origem: "AVSEC",
    },
  
    cercaPatrimonial: {
      id: "cercaPatrimonial",
      assunto: "Cerca patrimonial",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Perímetro patrimonial protegido.",
      criterioTecnico:
        "Proteção patrimonial do sítio aeroportuário.",
      comoInspecionar:
        "Verificar perímetro e vulnerabilidades.",
      logicaConformidade:
        "Avaliação qualitativa da cerca patrimonial.",
      criticidade: "MÉDIA",
      origem: "RBAC 107",
    },
  
    cercaPatrimonialAltura: {
      id: "cercaPatrimonialAltura",
      assunto: "Altura da cerca patrimonial",
      tipoComparacao: "MINIMO",
      valorLimite: 1.8,
      unidade: "m",
      exigeValorNumerico: true,
      parametro:
        "Altura patrimonial recomendada mínima: 1,80 m.",
      criterioTecnico:
        "Alturas inferiores aumentam vulnerabilidade.",
      comoInspecionar:
        "Medir altura da cerca patrimonial.",
      logicaConformidade:
        "CONFORME quando >= 1,80 m.",
      criticidade: "MÉDIA",
      origem: "AVSEC",
    },
  
    controleAcesso: {
      id: "controleAcesso",
      assunto: "Controle de acesso",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Acessos ao lado ar controlados.",
      criterioTecnico:
        "Controle AVSEC compatível com a operação.",
      comoInspecionar:
        "Verificar portões, guaritas e credenciais.",
      logicaConformidade:
        "Avaliação qualitativa do controle AVSEC.",
      criticidade: "CRÍTICA",
      origem: "RBAC 107",
    },
  
    areaRestrita: {
      id: "areaRestrita",
      assunto: "Área restrita",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Áreas restritas corretamente sinalizadas.",
      criterioTecnico:
        "Áreas mal segregadas aumentam risco operacional.",
      comoInspecionar:
        "Verificar placas, barreiras e isolamento.",
      logicaConformidade:
        "Avaliação qualitativa da segregação.",
      criticidade: "ALTA",
      origem: "RBAC 107 / RBAC 153",
    },
  };
  
  export function buscarConhecimentoInfra(chave) {
    if (!chave) return null;
    return INFRA_KNOWLEDGE_BASE[chave] || null;
  }
  
  export default INFRA_KNOWLEDGE_BASE;