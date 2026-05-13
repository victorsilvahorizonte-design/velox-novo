// src/data/infra/resa.js
// INFRA - RESA
// Fonte principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_RESA = [
    {
      id: "INFRA-RESA-001",
      grupo: "RESA",
      item: "Existência de área de segurança de fim de pista",
      criterio:
        "Verificar se existe RESA nas extremidades da pista quando aplicável ao tipo de operação e ao código de referência do aeródromo.",
      parametroEsperado:
        "RESA existente nas extremidades aplicáveis, livre de obstáculos e mantida em condição operacional segura.",
      aplicabilidade: {
        tipo: "codigoNumero",
        valores: [3, 4],
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Inspecionar as áreas além das cabeceiras, verificando dimensões, obstáculos, declividade, regularidade superficial e condição de manutenção.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Para pistas código 3 ou 4, a análise da RESA é essencial para mitigação de excursões longitudinais.",
    },
  
    {
      id: "INFRA-RESA-002",
      grupo: "RESA",
      item: "RESA para pista com operação IFR",
      criterio:
        "Verificar a existência e condição da RESA em pistas utilizadas para operação IFR.",
      parametroEsperado:
        "RESA compatível com operação IFR, mantida livre de obstáculos e em condição segura.",
      aplicabilidade: {
        tipo: "operacaoIFR",
        valores: [true],
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Comparar a condição física da área após cada cabeceira com os requisitos aplicáveis à operação IFR.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Operações IFR elevam a criticidade da proteção de fim de pista.",
    },
  
    {
      id: "INFRA-RESA-003",
      grupo: "RESA",
      item: "Ausência de obstáculos incompatíveis na RESA",
      criterio:
        "Verificar se há obstáculos fixos, móveis, valas, estruturas, materiais, cercas ou equipamentos incompatíveis dentro da RESA.",
      parametroEsperado:
        "Área livre de obstáculos incompatíveis; objetos indispensáveis devem ser frangíveis e adequadamente localizados.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Percorrer visualmente toda a área de fim de pista e registrar interferências por foto e observação técnica.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Mesmo pequenas estruturas podem representar risco elevado em uma ultrapassagem de pista.",
    },
  
    {
      id: "INFRA-RESA-004",
      grupo: "RESA",
      item: "Regularidade superficial da RESA",
      criterio:
        "Verificar se a RESA apresenta buracos, valas, erosões, desníveis abruptos, materiais soltos ou depressões perigosas.",
      parametroEsperado:
        "Superfície regular, nivelada e sem elementos que agravem uma excursão de pista.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Executar inspeção visual e registrar qualquer irregularidade relevante, especialmente em áreas próximas ao prolongamento do eixo da pista.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A RESA não deve introduzir risco adicional à aeronave em caso de saída longitudinal.",
    },
  
    {
      id: "INFRA-RESA-005",
      grupo: "RESA",
      item: "Drenagem da RESA",
      criterio:
        "Verificar se há acúmulo de água, erosão, assoreamento, solo saturado ou falhas de escoamento na RESA.",
      parametroEsperado:
        "Área drenada, estável e sem empoçamentos significativos.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar a área após chuva ou buscar evidências de fluxo concentrado, erosão e saturação do solo.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Falhas de drenagem podem reduzir a capacidade de suporte e agravar excursões.",
    },
  
    {
      id: "INFRA-RESA-006",
      grupo: "RESA",
      item: "Condição da vegetação na RESA",
      criterio:
        "Verificar se a vegetação está controlada e não oculta irregularidades, obstáculos ou riscos à segurança operacional.",
      parametroEsperado:
        "Vegetação controlada, sem ocultar desníveis, obstáculos ou animais.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Avaliar altura da vegetação, presença de fauna, ninhos, buracos, resíduos e objetos ocultos.",
      referenciaNormativa: "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A vegetação excessiva pode mascarar não conformidades críticas.",
    },
  ];
  
  export default INFRA_RESA;