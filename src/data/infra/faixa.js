// src/data/infra/faixa.js
// INFRA - FAIXA DE PISTA
// Fonte principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_FAIXA = [
    {
      id: "INFRA-FXA-001",
      grupo: "FAIXA DE PISTA",
      item: "Existência e delimitação da faixa de pista",
      criterio:
        "Verificar se a pista possui faixa de pista definida, livre de obstáculos incompatíveis e coerente com o código de referência do aeródromo.",
      parametroEsperado:
        "Faixa de pista existente, delimitada e mantida em condição operacional segura.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar visualmente as laterais da pista, áreas antes das cabeceiras e áreas posteriores às cabeceiras, observando obstáculos, erosões, vegetação e interferências.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A faixa de pista é uma das áreas mais críticas para segurança operacional em excursões laterais ou longitudinais.",
    },
  
    {
      id: "INFRA-FXA-002",
      grupo: "FAIXA DE PISTA",
      item: "Ausência de obstáculos não frangíveis na faixa de pista",
      criterio:
        "Verificar se existem objetos, equipamentos, cercas, estruturas, veículos, materiais ou obstáculos incompatíveis dentro da faixa de pista.",
      parametroEsperado:
        "Faixa livre de obstáculos fixos ou móveis incompatíveis com a operação.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Percorrer as laterais da pista e registrar qualquer interferência física localizada dentro da faixa.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Objetos necessários à navegação aérea devem atender aos critérios de frangibilidade e localização adequada.",
    },
  
    {
      id: "INFRA-FXA-003",
      grupo: "FAIXA DE PISTA",
      item: "Nivelamento e regularidade da faixa de pista",
      criterio:
        "Verificar se a faixa apresenta buracos, valas, erosões, desníveis abruptos, sulcos ou irregularidades que possam agravar uma saída de pista.",
      parametroEsperado:
        "Área nivelada, regular e sem depressões perigosas.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Executar inspeção visual e, quando necessário, medição pontual de desníveis e avaliação da compactação superficial.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Irregularidades na faixa podem transformar uma excursão de pista em ocorrência grave.",
    },
  
    {
      id: "INFRA-FXA-004",
      grupo: "FAIXA DE PISTA",
      item: "Condição da vegetação na faixa de pista",
      criterio:
        "Verificar se a vegetação está controlada e não interfere na segurança operacional, visibilidade, drenagem, sinalização ou presença de fauna.",
      parametroEsperado:
        "Vegetação baixa, controlada e sem atrair fauna.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Inspecionar altura da vegetação, presença de ninhos, acúmulo de resíduos, áreas alagadas e possíveis atrativos de fauna.",
      referenciaNormativa: "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A vegetação também deve ser analisada sob o ponto de vista do gerenciamento do risco da fauna.",
    },
  
    {
      id: "INFRA-FXA-005",
      grupo: "FAIXA DE PISTA",
      item: "Condição de drenagem da faixa de pista",
      criterio:
        "Verificar se há acúmulo de água, erosões, assoreamento, valas obstruídas ou falhas de escoamento superficial.",
      parametroEsperado:
        "Drenagem funcional, sem empoçamentos ou erosões críticas.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar canaletas, taludes, caixas, áreas laterais, pontos baixos e sinais de fluxo concentrado de água.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Problemas de drenagem podem comprometer tanto a pista quanto a faixa preparada.",
    },
  
    {
      id: "INFRA-FXA-006",
      grupo: "FAIXA DE PISTA",
      item: "Faixa preparada compatível com operação IFR",
      criterio:
        "Verificar se a área preparada da faixa atende às necessidades operacionais de aeródromos com operação IFR.",
      parametroEsperado:
        "Faixa preparada compatível com a categoria operacional e código de referência.",
      aplicabilidade: {
        tipo: "operacaoIFR",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Comparar dimensões, obstáculos, regularidade e condição da faixa com o tipo de operação autorizada.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Operações IFR exigem análise mais rigorosa das áreas adjacentes à pista.",
    },
  
    {
      id: "INFRA-FXA-007",
      grupo: "FAIXA DE PISTA",
      item: "Faixa de pista compatível com operação noturna",
      criterio:
        "Verificar se a faixa está livre, mantida e sem interferências que possam comprometer inspeções ou operações noturnas.",
      parametroEsperado:
        "Área mantida, livre de obstáculos e compatível com operação noturna.",
      aplicabilidade: {
        tipo: "operacaoNoturna",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Realizar inspeção visual noturna ou simulação operacional, avaliando percepção visual, obstáculos e interferências luminosas.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A operação noturna aumenta a criticidade de obstáculos, vegetação alta e falhas de balizamento.",
    },
  ];
  
  export default INFRA_FAIXA;