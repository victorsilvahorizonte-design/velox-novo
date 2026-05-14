// src/data/infra/faixa.js
// INFRA - FAIXA DE PISTA E FAIXA PREPARADA
// RBAC 154 EMD 08 + RBAC 153 EMD 09

export const INFRA_FAIXA = [
  // =========================================================
  // FAIXA DE PISTA
  // =========================================================

  {
    id: "INFRA-FXA-001",

    grupo: "FAIXA DE PISTA",

    item:
      "Largura da faixa de pista compatível com o código de referência",

    criterio:
      "Verificar se a largura total da faixa de pista atende ao código de referência do aeródromo e ao tipo de operação aprovada.",

    parametroEsperado:
      "Largura da faixa compatível com RBAC 154.",

    aplicabilidade: {
      tipo: "universal",
    },

    risco: "CRÍTICO",

    comoInspecionar:
      "Medir ou validar largura total da faixa de pista a partir do eixo da pista e verificar compatibilidade com o código de referência.",

    referenciaNormativa:
      "RBAC 154 Emenda 08",

    observacoesTecnicas:
      "A faixa de pista reduz danos em excursões laterais e longitudinais.",
  },

  {
    id: "INFRA-FXA-002",

    grupo: "FAIXA DE PISTA",

    item:
      "Ausência de obstáculos incompatíveis na faixa de pista",

    criterio:
      "Verificar se existem objetos, equipamentos, cercas, estruturas, veículos ou obstáculos incompatíveis dentro da faixa.",

    parametroEsperado:
      "Faixa livre de obstáculos incompatíveis.",

    aplicabilidade: {
      tipo: "universal",
    },

    risco: "CRÍTICO",

    comoInspecionar:
      "Percorrer visualmente toda a faixa e registrar obstáculos fixos ou móveis.",

    referenciaNormativa:
      "RBAC 154 Emenda 08",

    observacoesTecnicas:
      "Objetos incompatíveis aumentam significativamente o dano em excursões.",
  },

  {
    id: "INFRA-FXA-003",

    grupo: "FAIXA DE PISTA",

    item:
      "Regularidade superficial e nivelamento da faixa de pista",

    criterio:
      "Verificar erosões, buracos, valas, recalques, desníveis e irregularidades superficiais.",

    parametroEsperado:
      "Superfície regular e operacionalmente segura.",

    aplicabilidade: {
      tipo: "universal",
    },

    risco: "ALTO",

    comoInspecionar:
      "Percorrer visualmente a faixa verificando erosões, depressões, desníveis e estabilidade do solo.",

    referenciaNormativa:
      "RBAC 154 / RBAC 153",

    observacoesTecnicas:
      "Irregularidades podem agravar excursões de pista.",
  },

  {
    id: "INFRA-FXA-004",

    grupo: "FAIXA DE PISTA",

    item:
      "Condição da vegetação na faixa de pista",

    criterio:
      "Verificar se a vegetação permanece controlada e compatível com a segurança operacional.",

    parametroEsperado:
      "Vegetação operacional controlada.",

    aplicabilidade: {
      tipo: "universal",
    },

    risco: "MÉDIO",

    comoInspecionar:
      "Verificar altura da vegetação, moitas, arbustos, atração de fauna e interferência operacional.",

    referenciaNormativa:
      "RBAC 153 Emenda 09",

    observacoesTecnicas:
      "Vegetação elevada aumenta risco de fauna e reduz visibilidade.",
  },

  {
    id: "INFRA-FXA-005",

    grupo: "FAIXA DE PISTA",

    item:
      "Condição de drenagem da faixa de pista",

    criterio:
      "Verificar drenagem, erosões, acúmulo de água e saturação do solo.",

    parametroEsperado:
      "Drenagem funcional e ausência de erosões críticas.",

    aplicabilidade: {
      tipo: "universal",
    },

    risco: "ALTO",

    comoInspecionar:
      "Inspecionar canaletas, caixas, taludes, pontos baixos e sinais de empoçamento.",

    referenciaNormativa:
      "RBAC 154 / RBAC 153",

    observacoesTecnicas:
      "Falhas de drenagem comprometem faixa e pavimento.",
  },

  // =========================================================
  // FAIXA PREPARADA
  // =========================================================

  {
    id: "INFRA-FXP-001",

    grupo: "FAIXA PREPARADA",

    item:
      "Largura da faixa preparada compatível com operação aprovada",

    criterio:
      "Verificar se a largura da faixa preparada atende ao código de referência e operação IFR/VFR aprovada.",

    parametroEsperado:
      "Faixa preparada compatível com operação autorizada.",

    aplicabilidade: {
      tipo: "operacaoIFR",
      valores: [true],
    },

    risco: "CRÍTICO",

    comoInspecionar:
      "Medir largura preparada lateralmente ao eixo da pista e validar continuidade operacional.",

    referenciaNormativa:
      "RBAC 154 Emenda 08",

    observacoesTecnicas:
      "A faixa preparada é especialmente importante em operações IFR.",
  },

  {
    id: "INFRA-FXP-002",

    grupo: "FAIXA PREPARADA",

    item:
      "Regularidade superficial da faixa preparada",

    criterio:
      "Verificar se a faixa preparada apresenta superfície regular e sem riscos operacionais.",

    parametroEsperado:
      "Superfície regular e compatível com excursão de pista.",

    aplicabilidade: {
      tipo: "operacaoIFR",
      valores: [true],
    },

    risco: "ALTO",

    comoInspecionar:
      "Verificar erosões, buracos, recalques, drenagem e suporte superficial.",

    referenciaNormativa:
      "RBAC 154 Emenda 08",

    observacoesTecnicas:
      "A faixa preparada deve reduzir danos em excursões.",
  },

  {
    id: "INFRA-FXP-003",

    grupo: "FAIXA PREPARADA",

    item:
      "Ausência de obstáculos incompatíveis na faixa preparada",

    criterio:
      "Verificar existência de objetos fixos, cercas, valas perigosas ou obstáculos incompatíveis.",

    parametroEsperado:
      "Faixa preparada livre de interferências críticas.",

    aplicabilidade: {
      tipo: "operacaoIFR",
      valores: [true],
    },

    risco: "CRÍTICO",

    comoInspecionar:
      "Percorrer visualmente a faixa preparada identificando obstáculos incompatíveis.",

    referenciaNormativa:
      "RBAC 154 Emenda 08",

    observacoesTecnicas:
      "Obstáculos podem agravar excursões e saídas laterais.",
  },
];

export default INFRA_FAIXA;