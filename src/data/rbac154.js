export const RBAC154 = [

  // =========================
  // SUBPARTE B - DADOS DO AERÓDROMO
  // =========================

  {
    REF: "154.101",
    Subparte: "SUBPARTE B - DADOS DO AERÓDROMO",
    "Item verificável": "Verificar se os dados aeronáuticos são mantidos atualizados e consistentes.",
    "Critério de conformidade": "Dados atendem aos requisitos de qualidade, integridade e atualização.",
    "Evidências esperadas": "AIP, banco de dados, registros DECEA.",
    "Risco associado": "ALTO - dados incorretos afetam navegação.",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    "Classe mínima": 0,
    regraAplicabilidade: {}
  },

  // =========================
  // SUBPARTE C - PISTA
  // =========================

  {
    REF: "154.201",
    Subparte: "SUBPARTE C - PISTA",
    "Item verificável": "Verificar largura da pista conforme código de referência.",
    "Critério de conformidade": "Dimensões compatíveis com código de referência.",
    "Evidências esperadas": "Projeto, medição em campo.",
    "Risco associado": "CRÍTICO",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    "Classe mínima": 0,
    regraAplicabilidade: {
      requerPista: true,
      codigoNumeroMin: 1
    }
  },

  {
    REF: "154.203",
    Subparte: "SUBPARTE C - PISTA",
    "Item verificável": "Verificar resistência do pavimento.",
    "Critério de conformidade": "PCN compatível com aeronaves operantes.",
    "Evidências esperadas": "Relatórios de engenharia.",
    "Risco associado": "CRÍTICO",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    regraAplicabilidade: {
      requerPavimentado: true
    }
  },

  {
    REF: "154.205",
    Subparte: "SUBPARTE C - PISTA",
    "Item verificável": "Verificar declividade longitudinal da pista.",
    "Critério de conformidade": "Dentro dos limites normativos.",
    "Evidências esperadas": "Topografia.",
    "Risco associado": "ALTO",
    Status: "NÃO VERIFICADO",
    Criticidade: "MÉDIO",
    regraAplicabilidade: {
      requerPista: true
    }
  },

  // =========================
  // TAXIWAY
  // =========================

  {
    REF: "154.301",
    Subparte: "SUBPARTE C - TAXIWAY",
    "Item verificável": "Verificar largura da taxiway.",
    "Critério de conformidade": "Compatível com aeronaves.",
    "Evidências esperadas": "Projeto geométrico.",
    "Risco associado": "ALTO",
    Status: "NÃO VERIFICADO",
    Criticidade: "MÉDIO",
    regraAplicabilidade: {
      requerTaxiway: true
    }
  },

  {
    REF: "154.303",
    Subparte: "SUBPARTE C - TAXIWAY",
    "Item verificável": "Verificar resistência do pavimento da taxiway.",
    "Critério de conformidade": "Compatível com operação.",
    "Evidências esperadas": "Relatório técnico.",
    "Risco associado": "ALTO",
    Status: "NÃO VERIFICADO",
    Criticidade: "MÉDIO",
    regraAplicabilidade: {
      requerTaxiway: true,
      requerPavimentado: true
    }
  },

  // =========================
  // PÁTIO
  // =========================

  {
    REF: "154.401",
    Subparte: "SUBPARTE C - PÁTIO",
    "Item verificável": "Verificar dimensionamento do pátio.",
    "Critério de conformidade": "Compatível com demanda operacional.",
    "Evidências esperadas": "Projeto e inspeção.",
    "Risco associado": "MÉDIO",
    Status: "NÃO VERIFICADO",
    Criticidade: "MÉDIO",
    regraAplicabilidade: {
      requerPatio: true
    }
  },

  // =========================
  // AUXÍLIOS VISUAIS
  // =========================

  {
    REF: "154.501",
    Subparte: "SUBPARTE D - AUXÍLIOS VISUAIS",
    "Item verificável": "Verificar sinalização horizontal da pista.",
    "Critério de conformidade": "Conforme padrão ICAO/ANAC.",
    "Evidências esperadas": "Inspeção visual.",
    "Risco associado": "ALTO",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    regraAplicabilidade: {
      requerPista: true
    }
  },

  {
    REF: "154.503",
    Subparte: "SUBPARTE D - AUXÍLIOS VISUAIS",
    "Item verificável": "Verificar iluminação da pista.",
    "Critério de conformidade": "Sistema funcionando e conforme padrão.",
    "Evidências esperadas": "Teste noturno.",
    "Risco associado": "CRÍTICO",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    regraAplicabilidade: {
      requerOperacaoNoturna: true
    }
  },

  // =========================
  // SISTEMA ELÉTRICO
  // =========================

  {
    REF: "154.601",
    Subparte: "SUBPARTE F - SISTEMAS ELÉTRICOS",
    "Item verificável": "Verificar redundância do sistema elétrico.",
    "Critério de conformidade": "Sistema possui backup.",
    "Evidências esperadas": "Testes e documentação.",
    "Risco associado": "CRÍTICO",
    Status: "NÃO VERIFICADO",
    Criticidade: "ALTO",
    regraAplicabilidade: {
      requerSistemaEletrico: true
    }
  },

  {
    REF: "154.603",
    Subparte: "SUBPARTE F - SISTEMAS ELÉTRICOS",
    "Item verificável": "Verificar manutenção do sistema elétrico.",
    "Critério de conformidade": "Plano de manutenção ativo.",
    "Evidências esperadas": "Registros.",
    "Risco associado": "ALTO",
    Status: "NÃO VERIFICADO",
    Criticidade: "MÉDIO",
    regraAplicabilidade: {
      requerSistemaEletrico: true
    }
  }

];