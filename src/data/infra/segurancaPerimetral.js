// src/data/infra/segurancaPerimetral.js
// INFRA - SEGURANÇA PERIMETRAL / AVSEC
// RBAC 107 + RBAC 153 + apoio técnico aeroportuário

export const INFRA_SEGURANCA_PERIMETRAL = [
    // =========================================================
    // CERCA OPERACIONAL
    // =========================================================
  
    {
      id: "INFRA-SEG-001",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Existência e continuidade da cerca operacional do lado ar",
  
      criterio:
        "A área operacional deve possuir barreira física contínua protegendo pista, taxiway, pátio e áreas restritas.",
  
      parametroEsperado:
        "Cerca operacional contínua e sem interrupções críticas.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "CRÍTICO",
  
      comoInspecionar:
        "Percorrer o perímetro operacional verificando continuidade da cerca, brechas, passagens irregulares e vulnerabilidades.",
  
      referenciaNormativa:
        "RBAC 107 / RBAC 153",
  
      observacoesTecnicas:
        "A cerca operacional reduz risco de invasão de pessoas, animais e veículos.",
    },
  
    {
      id: "INFRA-SEG-002",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Altura da cerca operacional compatível com proteção do lado ar",
  
      criterio:
        "A altura da cerca operacional deve dificultar invasões e acessos indevidos ao lado ar.",
  
      parametroEsperado:
        "Altura mínima recomendada: 2,40 m.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "CRÍTICO",
  
      comoInspecionar:
        "Medir altura da cerca em diferentes pontos críticos do perímetro operacional.",
  
      referenciaNormativa:
        "RBAC 107 / apoio técnico aeroportuário",
  
      observacoesTecnicas:
        "Altura operacional de referência utilizada em aeroportos públicos: aproximadamente 2,40 m a 2,50 m.",
    },
  
    {
      id: "INFRA-SEG-003",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Integridade estrutural da cerca operacional",
  
      criterio:
        "A cerca não deve apresentar telas rompidas, corrosão crítica, deformações ou falhas estruturais.",
  
      parametroEsperado:
        "Estrutura íntegra e operacionalmente segura.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "ALTO",
  
      comoInspecionar:
        "Inspecionar postes, telas, fixações, bases, arames, concertinas e pontos vulneráveis.",
  
      referenciaNormativa:
        "RBAC 107",
  
      observacoesTecnicas:
        "Falhas estruturais facilitam invasões e comprometem segurança operacional.",
    },
  
    {
      id: "INFRA-SEG-004",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Existência de proteção superior na cerca operacional",
  
      criterio:
        "Verificar existência de concertina, arame superior ou proteção adicional contra invasão.",
  
      parametroEsperado:
        "Proteção superior instalada quando aplicável ao risco operacional.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "MÉDIO",
  
      comoInspecionar:
        "Verificar presença de concertina, arame farpado ou proteção anti-invasão.",
  
      referenciaNormativa:
        "Apoio técnico aeroportuário / AVSEC",
  
      observacoesTecnicas:
        "Proteções superiores aumentam eficiência contra invasões.",
    },
  
    {
      id: "INFRA-SEG-005",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Faixa livre operacional junto à cerca",
  
      criterio:
        "A vegetação e obstáculos junto à cerca não devem dificultar inspeção, vigilância ou manutenção.",
  
      parametroEsperado:
        "Faixa livre operacional e vegetação controlada.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "MÉDIO",
  
      comoInspecionar:
        "Verificar vegetação, entulhos, materiais, erosões e obstáculos próximos à cerca.",
  
      referenciaNormativa:
        "RBAC 153 / apoio operacional",
  
      observacoesTecnicas:
        "Vegetação elevada reduz visibilidade e facilita invasões.",
    },
  
    // =========================================================
    // CONTROLE DE ACESSO
    // =========================================================
  
    {
      id: "INFRA-SEG-006",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Controle de portões e acessos ao lado ar",
  
      criterio:
        "Os acessos ao lado ar devem permanecer controlados e protegidos.",
  
      parametroEsperado:
        "Portões controlados, protegidos e monitorados.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "CRÍTICO",
  
      comoInspecionar:
        "Verificar cadeados, controle AVSEC, guaritas, registros de acesso, credenciais, iluminação e monitoramento.",
  
      referenciaNormativa:
        "RBAC 107",
  
      observacoesTecnicas:
        "Portões descontrolados representam risco crítico AVSEC.",
    },
  
    {
      id: "INFRA-SEG-007",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Existência de pontos vulneráveis ou acessos irregulares",
  
      criterio:
        "Não devem existir trilhas, passagens clandestinas, cortes ou brechas no perímetro.",
  
      parametroEsperado:
        "Ausência de acessos irregulares.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "CRÍTICO",
  
      comoInspecionar:
        "Percorrer o perímetro observando sinais de invasão, erosões sob a cerca, cortes e passagens improvisadas.",
  
      referenciaNormativa:
        "RBAC 107",
  
      observacoesTecnicas:
        "Pontos vulneráveis aumentam risco operacional e AVSEC.",
    },
  
    // =========================================================
    // CERCA PATRIMONIAL
    // =========================================================
  
    {
      id: "INFRA-SEG-008",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Existência da cerca patrimonial do sítio aeroportuário",
  
      criterio:
        "O sítio aeroportuário deve possuir delimitação patrimonial definida.",
  
      parametroEsperado:
        "Perímetro patrimonial delimitado.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "MÉDIO",
  
      comoInspecionar:
        "Inspecionar limites externos do sítio aeroportuário e acessos públicos.",
  
      referenciaNormativa:
        "RBAC 107 / apoio técnico",
  
      observacoesTecnicas:
        "A cerca patrimonial complementa proteção do sítio aeroportuário.",
    },
  
    {
      id: "INFRA-SEG-009",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Altura da cerca patrimonial compatível com proteção externa",
  
      criterio:
        "A cerca patrimonial deve possuir altura compatível com controle patrimonial.",
  
      parametroEsperado:
        "Altura referencial mínima recomendada: 1,80 m.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "MÉDIO",
  
      comoInspecionar:
        "Medir altura da cerca patrimonial em pontos representativos.",
  
      referenciaNormativa:
        "Apoio técnico aeroportuário",
  
      observacoesTecnicas:
        "Alturas patrimoniais variam conforme vulnerabilidade local.",
    },
  
    {
      id: "INFRA-SEG-010",
  
      grupo: "SEGURANÇA PERIMETRAL",
  
      item:
        "Sinalização de áreas restritas e controle AVSEC",
  
      criterio:
        "Áreas restritas devem possuir sinalização coerente com procedimentos AVSEC.",
  
      parametroEsperado:
        "Áreas restritas identificadas e protegidas.",
  
      aplicabilidade: {
        tipo: "universal",
      },
  
      risco: "ALTO",
  
      comoInspecionar:
        "Verificar placas, segregação física, iluminação e coerência operacional.",
  
      referenciaNormativa:
        "RBAC 107",
  
      observacoesTecnicas:
        "A sinalização reduz acessos indevidos e melhora o controle operacional.",
    },
  ];
  
  export default INFRA_SEGURANCA_PERIMETRAL;