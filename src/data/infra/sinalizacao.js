// src/data/infra/sinalizacao.js
// INFRA - SINALIZAÇÃO AEROPORTUÁRIA
// Base principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_SINALIZACAO = [
    {
      id: "INFRA-SIN-001",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização horizontal da pista",
      criterio:
        "Verificar se a sinalização horizontal da pista está visível, íntegra, padronizada e compatível com a operação autorizada.",
      parametroEsperado:
        "Marcas de pista visíveis, contínuas, sem desgaste crítico e coerentes com o tipo de operação.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Inspecionar cabeceiras, eixo, bordas, designadores, zona de toque, ponto de visada e demais marcações existentes.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Em operação IFR ou noturna, a degradação da sinalização horizontal possui criticidade maior.",
    },
  
    {
      id: "INFRA-SIN-002",
      grupo: "SINALIZAÇÃO",
      item: "Designadores de cabeceira",
      criterio:
        "Verificar se os números designadores de cabeceira estão legíveis, posicionados corretamente e coerentes com a orientação magnética da pista.",
      parametroEsperado:
        "Designadores íntegros, legíveis e corretamente posicionados.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Verificar visualmente as duas cabeceiras e registrar desgaste, obstrução, pintura incorreta ou ausência de marcação.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Designadores incorretos podem gerar erro operacional de identificação da pista.",
    },
  
    {
      id: "INFRA-SIN-003",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização de eixo de pista",
      criterio:
        "Verificar continuidade, contraste e visibilidade da marcação de eixo da pista.",
      parametroEsperado:
        "Eixo visível, contínuo e com contraste suficiente.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Percorrer a pista visualmente e avaliar falhas, desgaste, desalinhamento ou trechos apagados.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A marcação de eixo é essencial para orientação direcional durante pouso e decolagem.",
    },
  
    {
      id: "INFRA-SIN-004",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização de borda de pista",
      criterio:
        "Verificar se as marcas de borda existem quando aplicáveis e estão visíveis e conservadas.",
      parametroEsperado:
        "Bordas corretamente identificadas e sem desgaste crítico.",
      aplicabilidade: {
        tipo: "codigoNumero",
        valores: [3, 4],
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Avaliar as laterais da pista e registrar ausência, desgaste ou baixa visibilidade.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A sinalização de borda auxilia especialmente em pistas largas, operação noturna ou baixa visibilidade.",
    },
  
    {
      id: "INFRA-SIN-005",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização horizontal de taxiway",
      criterio:
        "Verificar eixo, bordas, posições de espera e demais marcações da taxiway.",
      parametroEsperado:
        "Marcação de taxiway íntegra, visível e padronizada.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Inspecionar todas as taxiways, interseções e acessos ao pátio.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Falhas de marcação podem provocar incursão em pista ou erro de taxiamento.",
    },
  
    {
      id: "INFRA-SIN-006",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização de posição de espera de pista",
      criterio:
        "Verificar se as posições de espera estão corretamente demarcadas, visíveis e compatíveis com a operação.",
      parametroEsperado:
        "Posições de espera claras, visíveis e preservadas.",
      aplicabilidade: {
        tipo: "operacaoIFR",
        valores: [true],
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Avaliar marcações nas entradas de pista, placas associadas e distância em relação ao eixo da pista.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Item crítico para prevenção de incursão em pista, especialmente em operação IFR.",
    },
  
    {
      id: "INFRA-SIN-007",
      grupo: "SINALIZAÇÃO",
      item: "Placas de sinalização vertical operacional",
      criterio:
        "Verificar placas de identificação, localização, direção, obrigação e informação operacional.",
      parametroEsperado:
        "Placas legíveis, conservadas, posicionadas corretamente e visíveis de dia e à noite quando aplicável.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Inspecionar placas em pista, taxiways, pátios e acessos operacionais.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Observar fixação, refletividade, iluminação, orientação e obstruções visuais.",
    },
  
    {
      id: "INFRA-SIN-008",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização luminosa para operação noturna",
      criterio:
        "Verificar existência, funcionamento, alinhamento, cor e intensidade dos auxílios luminosos aplicáveis.",
      parametroEsperado:
        "Sistema luminoso operacional, visível, íntegro e compatível com a operação noturna.",
      aplicabilidade: {
        tipo: "operacaoNoturna",
        valores: [true],
      },
      risco: "CRÍTICO",
      comoInspecionar:
        "Realizar teste operacional noturno, verificando pista, taxiways, cabeceiras, bordas, placas iluminadas e pátios.",
      referenciaNormativa: "RBAC 154 Emenda 08 / RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Falhas de balizamento em operação noturna devem ser tratadas como risco elevado.",
    },
  
    {
      id: "INFRA-SIN-009",
      grupo: "SINALIZAÇÃO",
      item: "Sinalização de áreas interditadas ou fora de serviço",
      criterio:
        "Verificar se áreas interditadas, trechos em obra ou superfícies fora de serviço estão adequadamente sinalizadas.",
      parametroEsperado:
        "Áreas indisponíveis claramente identificadas e protegidas contra uso inadvertido.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Verificar cones, barreiras, marcas, luzes, NOTAM operacional e comunicação ao tráfego, quando aplicável.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A ausência de sinalização de interdição pode induzir uso indevido de área insegura.",
    },
  
    {
      id: "INFRA-SIN-010",
      grupo: "SINALIZAÇÃO",
      item: "Contraste e manutenção geral da sinalização",
      criterio:
        "Verificar se a sinalização apresenta contraste suficiente com o pavimento e está livre de sujeira, borracha, vegetação ou desgaste excessivo.",
      parametroEsperado:
        "Sinalização limpa, contrastante e perceptível ao operador.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Avaliar a visibilidade em diferentes trechos e registrar pontos com baixa percepção visual.",
      referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "A manutenção preventiva da sinalização deve considerar tráfego, chuva, borracha e envelhecimento da pintura.",
    },
  ];
  
  export default INFRA_SINALIZACAO;