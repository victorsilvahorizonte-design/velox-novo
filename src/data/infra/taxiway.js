// src/data/infra/taxiway.js
// INFRA - TAXIWAY
// Base principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_TAXIWAY = [
    {
      id: "INFRA-TWY-001",
      grupo: "TAXIWAY",
      item:
        "Existência de taxiway compatível com a operação do aeródromo",
      criterio:
        "Verificar se o sistema de taxiways é compatível com o tipo de operação, fluxo operacional e porte das aeronaves atendidas.",
      parametroEsperado:
        "Sistema operacional adequado ao fluxo e categoria operacional.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Avaliar o fluxo operacional do aeródromo, movimentação de aeronaves e geometria das taxiways.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Aeródromos com operações mais complexas exigem sistema de taxiway compatível para segurança e fluidez operacional.",
    },
  
    {
      id: "INFRA-TWY-002",
      grupo: "TAXIWAY",
      item:
        "Condição superficial do pavimento da taxiway",
      criterio:
        "Verificar presença de trincas, FOD, desagregações, afundamentos, deformações ou deterioração superficial.",
      parametroEsperado:
        "Superfície íntegra e operacionalmente segura.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Executar inspeção visual completa ao longo da taxiway e registrar anomalias.",
      referenciaNormativa:
        "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A presença de FOD em taxiways representa elevado risco operacional.",
    },
  
    {
      id: "INFRA-TWY-003",
      grupo: "TAXIWAY",
      item:
        "Largura da taxiway compatível com o código de referência",
      criterio:
        "Verificar se a largura da taxiway atende aos requisitos mínimos aplicáveis ao código de referência do aeródromo.",
      parametroEsperado:
        "Largura compatível com o código ICAO aplicável.",
      aplicabilidade: {
        tipo: "codigoNumero",
        valores: [2, 3, 4],
      },
      risco: "ALTO",
      comoInspecionar:
        "Realizar medição física da largura pavimentada e comparar com parâmetros regulamentares.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Deve-se considerar também ombros e afastamentos operacionais.",
    },
  
    {
      id: "INFRA-TWY-004",
      grupo: "TAXIWAY",
      item:
        "Condição da sinalização horizontal da taxiway",
      criterio:
        "Verificar visibilidade, continuidade e conformidade da sinalização horizontal.",
      parametroEsperado:
        "Sinalização íntegra, visível e padronizada.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Avaliar visualmente eixo, bordas, posições de espera e demais marcações operacionais.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Observar desgaste excessivo e perda de refletividade.",
    },
  
    {
      id: "INFRA-TWY-005",
      grupo: "TAXIWAY",
      item:
        "Condição da sinalização luminosa da taxiway",
      criterio:
        "Verificar funcionamento, integridade física e visibilidade das luzes de taxiway quando aplicável.",
      parametroEsperado:
        "Sistema luminoso operacional e visível.",
      aplicabilidade: {
        tipo: "operacaoNoturna",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Executar inspeção noturna ou teste operacional do sistema luminoso.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Falhas no balizamento podem comprometer a segurança operacional em baixa visibilidade.",
    },
  
    {
      id: "INFRA-TWY-006",
      grupo: "TAXIWAY",
      item:
        "Ausência de obstáculos na faixa da taxiway",
      criterio:
        "Verificar presença de equipamentos, veículos, estruturas ou materiais incompatíveis próximos à taxiway.",
      parametroEsperado:
        "Faixa da taxiway livre de obstáculos incompatíveis.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Percorrer lateralmente toda extensão da taxiway observando interferências físicas.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Objetos indispensáveis devem obedecer critérios de frangibilidade.",
    },
  
    {
      id: "INFRA-TWY-007",
      grupo: "TAXIWAY",
      item:
        "Condição de drenagem da taxiway",
      criterio:
        "Verificar acúmulo de água, erosões, saturação do pavimento ou falhas de escoamento.",
      parametroEsperado:
        "Sistema de drenagem funcional e sem empoçamentos.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar canaletas, áreas laterais e regiões críticas após precipitação.",
      referenciaNormativa:
        "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Água acumulada aumenta risco operacional e degrada pavimento.",
    },
  
    {
      id: "INFRA-TWY-008",
      grupo: "TAXIWAY",
      item:
        "Condição operacional das posições de espera",
      criterio:
        "Verificar identificação, sinalização e posicionamento das posições de espera.",
      parametroEsperado:
        "Posições de espera corretamente identificadas e operacionais.",
      aplicabilidade: {
        tipo: "operacaoIFR",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Avaliar posições de espera visualmente e confrontar com operação autorizada.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Operações IFR exigem atenção rigorosa às posições de espera.",
    },
  ];
  
  export default INFRA_TAXIWAY;