// src/data/infra/pista.js
// INFRA - PISTA
// Baseado prioritariamente no RBAC 154 Emenda 08
// Complementado operacionalmente pelo RBAC 153

export const INFRA_PISTA = [
    {
      id: "INFRA-PST-001",
      grupo: "PISTA",
      item: "Largura da pista compatível com o código de referência do aeródromo",
      criterio:
        "Verificar se a largura da pista atende aos requisitos mínimos do RBAC 154 conforme código número e letra.",
      parametroEsperado: {
        codigo1: "18 m",
        codigo2: "23 m",
        codigo3: "30 m",
        codigo4: "45 m",
      },
      aplicabilidade: {
        tipo: "codigoNumero",
        valores: [1, 2, 3, 4],
      },
      risco: "ALTO",
      comoInspecionar:
        "Realizar medição física da largura pavimentada da pista e comparar com os parâmetros regulamentares.",
      referenciaNormativa: "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Considerar ampliações locais, ombros e restrições operacionais.",
    },
  
    {
      id: "INFRA-PST-002",
      grupo: "PISTA",
      item: "Condição superficial do pavimento",
      criterio:
        "Verificar existência de trincas, afundamentos, FOD, desagregação ou deterioração.",
      parametroEsperado:
        "Superfície íntegra, segura e operacional.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Executar inspeção visual completa em toda extensão da pista.",
      referenciaNormativa:
        "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Registrar fotografias das anomalias identificadas.",
    },
  
    {
      id: "INFRA-PST-003",
      grupo: "PISTA",
      item: "Presença de borracha excessiva na zona de toque",
      criterio:
        "Verificar acúmulo de borracha que possa comprometer atrito operacional.",
      parametroEsperado:
        "Ausência de acúmulo crítico.",
      aplicabilidade: {
        tipo: "operacaoIFR",
        valores: [true],
      },
      risco: "ALTO",
      comoInspecionar:
        "Avaliar visualmente regiões de toque das aeronaves.",
      referenciaNormativa:
        "RBAC 153 Emenda 09",
      observacoesTecnicas:
        "Pode exigir medição de atrito operacional.",
    },
  
    {
      id: "INFRA-PST-004",
      grupo: "PISTA",
      item: "Condição da sinalização horizontal da pista",
      criterio:
        "Verificar visibilidade, desgaste e conformidade da sinalização horizontal.",
      parametroEsperado:
        "Sinalização íntegra, visível e padronizada.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "MÉDIO",
      comoInspecionar:
        "Avaliar pintura horizontal em inspeção diurna e noturna.",
      referenciaNormativa:
        "RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Observar refletividade e contaminação superficial.",
    },
  
    {
      id: "INFRA-PST-005",
      grupo: "PISTA",
      item: "Condição do sistema de drenagem lateral da pista",
      criterio:
        "Verificar obstruções, erosões e acúmulo de água.",
      parametroEsperado:
        "Sistema funcional e sem acúmulo hídrico.",
      aplicabilidade: {
        tipo: "universal",
      },
      risco: "ALTO",
      comoInspecionar:
        "Realizar inspeção visual após chuvas ou lavagem operacional.",
      referenciaNormativa:
        "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
      observacoesTecnicas:
        "Registrar pontos de alagamento ou erosão.",
    },
  ];
  
  export default INFRA_PISTA;