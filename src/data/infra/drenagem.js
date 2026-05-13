// src/data/infra/drenagem.js
// INFRA - DRENAGEM
// Base principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_DRENAGEM = [
    {
      id: "INFRA-DRN-001",
      grupo: "DRENAGEM",
      item: "Drenagem superficial da pista",
      criterio:
        "Verificar se a pista apresenta escoamento adequado, sem acúmulo de água, lâminas d’água, poças persistentes ou áreas de saturação.",
      parametroEsperado:
        "Pista sem acúmulo hídrico crítico e com escoamento superficial funcional.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Realizar inspeção visual após chuva ou lavagem operacional, observando pontos baixos, trilhas de escoamento e permanência de água.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Água acumulada na pista pode comprometer aderência, frenagem e controle direcional da aeronave.",
    },
  
    {
      id: "INFRA-DRN-002",
      grupo: "DRENAGEM",
      item: "Drenagem lateral da pista",
      criterio:
        "Verificar se valetas, canaletas, sarjetas, caixas e dispositivos laterais estão livres, funcionais e sem obstruções.",
      parametroEsperado:
        "Sistema lateral desobstruído, íntegro e capaz de conduzir o fluxo de água.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar laterais da pista, canaletas, caixas de passagem, grelhas, bocas de lobo e saídas de drenagem.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Obstruções podem gerar retorno de água para áreas operacionais críticas.",
    },
  
    {
      id: "INFRA-DRN-003",
      grupo: "DRENAGEM",
      item: "Drenagem da faixa de pista",
      criterio:
        "Verificar se a faixa de pista está livre de erosões, encharcamentos, assoreamentos e acúmulo de água.",
      parametroEsperado:
        "Faixa drenada, estável e sem processos erosivos relevantes.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Percorrer a faixa de pista, principalmente laterais e áreas próximas às cabeceiras, registrando erosões e pontos de retenção hídrica.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A saturação da faixa pode agravar saídas laterais ou longitudinais de pista.",
    },
  
    {
      id: "INFRA-DRN-004",
      grupo: "DRENAGEM",
      item: "Drenagem da RESA",
      criterio:
        "Verificar se a área de segurança de fim de pista possui escoamento adequado e não apresenta solo saturado, erosão ou depressões com água.",
      parametroEsperado:
        "RESA drenada, regular e sem empoçamentos significativos.",
      aplicabilidade: {
        tipo: "codigoNumero",
        valores: [3, 4],
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Inspecionar áreas além das cabeceiras, especialmente no prolongamento do eixo da pista e regiões de menor cota.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Problemas de drenagem na RESA reduzem a capacidade de suporte em caso de excursão longitudinal.",
    },
  
    {
      id: "INFRA-DRN-005",
      grupo: "DRENAGEM",
      item: "Erosões próximas à pista e áreas operacionais",
      criterio:
        "Verificar existência de erosões, ravinas, sulcos, carreamento de material ou instabilidade do solo próximos à pista, taxiways e pátios.",
      parametroEsperado:
        "Ausência de erosões que comprometam segurança, suporte ou integridade das superfícies operacionais.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Percorrer áreas laterais e pontos de descarga hidráulica, registrando extensão, profundidade e proximidade das erosões em relação às superfícies operacionais.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Erosões próximas ao pavimento podem evoluir para perda de suporte estrutural.",
    },
  
    {
      id: "INFRA-DRN-006",
      grupo: "DRENAGEM",
      item: "Assoreamento ou obstrução de dispositivos de drenagem",
      criterio:
        "Verificar presença de sedimentos, vegetação, resíduos, lixo, FOD ou materiais que reduzam a capacidade hidráulica do sistema.",
      parametroEsperado:
        "Dispositivos limpos, desobstruídos e com capacidade de escoamento preservada.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Abrir ou verificar caixas acessíveis, observar canaletas, grelhas, tubulações aparentes e pontos de lançamento.",
      referenciaNormativa: "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Assoreamento recorrente pode indicar falha de projeto, manutenção insuficiente ou erosão a montante.",
    },
  
    {
      id: "INFRA-DRN-007",
      grupo: "DRENAGEM",
      item: "Acúmulo de água em taxiways e pátios",
      criterio:
        "Verificar se taxiways, acessos e pátios apresentam poças persistentes, depressões, baixa declividade ou falhas de escoamento.",
      parametroEsperado:
        "Superfícies operacionais livres de empoçamentos críticos.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar taxiways e pátios após chuva, identificando áreas de acúmulo e impacto operacional.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Água acumulada em pátios pode gerar FOD, degradação de pavimento e risco durante manobras.",
    },
  
    {
      id: "INFRA-DRN-008",
      grupo: "DRENAGEM",
      item: "Compatibilidade da drenagem com operação noturna",
      criterio:
        "Verificar se dispositivos de drenagem, tampas, grelhas, canaletas e depressões estão visíveis, seguros e não representam risco adicional em operação noturna.",
      parametroEsperado:
        "Sistema seguro, perceptível e sem interferência nas operações noturnas.",
      aplicabilidade: {
        tipo: "operacaoNoturna",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Realizar inspeção em condição noturna ou simulação, observando visibilidade, iluminação e riscos de tropeço, colisão ou FOD.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "À noite, pequenos desníveis ou dispositivos mal posicionados podem se tornar riscos operacionais relevantes.",
    },
  
    {
      id: "INFRA-DRN-009",
      grupo: "DRENAGEM",
      item: "Drenagem e gerenciamento do risco da fauna",
      criterio:
        "Verificar se o sistema de drenagem cria áreas alagadas, vegetação densa, acúmulo de matéria orgânica ou ambientes atrativos à fauna.",
      parametroEsperado:
        "Drenagem sem formação de áreas atrativas à fauna ou focos permanentes de água.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar pontos de água parada, vegetação próxima, presença de aves, pegadas, fezes, ninhos ou animais.",
      referenciaNormativa: "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A drenagem deficiente pode aumentar o risco de colisão com fauna.",
    },
  
    {
      id: "INFRA-DRN-010",
      grupo: "DRENAGEM",
      item: "Plano de manutenção preventiva da drenagem",
      criterio:
        "Verificar se há rotina de limpeza, inspeção e manutenção preventiva dos dispositivos de drenagem das áreas operacionais.",
      parametroEsperado:
        "Rotina documentada e executada, com registros de limpeza e correções.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Solicitar registros de manutenção, ordens de serviço, fotografias anteriores, histórico de ocorrências e evidências de limpeza periódica.",
      referenciaNormativa: "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "A ausência de rotina preventiva tende a transformar falhas simples em não conformidades operacionais graves.",
    },
  ];
  
  export default INFRA_DRENAGEM;