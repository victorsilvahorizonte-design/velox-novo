// src/data/infra/taxiway.js
// INFRA - TAXIWAY
// Base principal: RBAC 154 Emenda 08
// Complemento operacional: RBAC 153 Emenda 09

export const INFRA_TAXIWAY = [
  {
    id: "INFRA-TWY-001",
    grupo: "TAXIWAY",
    item: "Largura da taxiway compatível com o código de referência",
    criterio:
      "Verificar se a largura da taxiway atende ao código de referência do aeródromo e à aeronave crítica considerada.",
    parametroEsperado:
      "Largura mínima da taxiway compatível com a letra do código de referência.",
    aplicabilidade: {
      tipo: "codigoNumero",
      valores: [2, 3, 4],
    },
    risco: "ALTO",
    comoInspecionar:
      "Medir ou validar a largura pavimentada da taxiway e comparar com o parâmetro esperado para a letra do código.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Este é o item dimensional principal da taxiway e deve permitir comparação automática.",
  },

  {
    id: "INFRA-TWY-002",
    grupo: "TAXIWAY",
    item: "Condição superficial do pavimento da taxiway",
    criterio:
      "Verificar presença de trincas, FOD, desagregações, afundamentos, deformações, juntas abertas ou deterioração superficial.",
    parametroEsperado:
      "Superfície íntegra e operacionalmente segura para circulação de aeronaves.",
    aplicabilidade: {
      tipo: "universal",
    },
    risco: "ALTO",
    comoInspecionar:
      "Inspecionar visualmente toda a taxiway, registrando defeitos de pavimento, FOD, remendos, juntas, trincas, deformações e bordas degradadas.",
    referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Defeitos em taxiway podem gerar FOD, danos a pneus e perda de controle direcional.",
  },

  {
    id: "INFRA-TWY-003",
    grupo: "TAXIWAY",
    item: "FOD e objetos estranhos na taxiway",
    criterio:
      "Verificar se há objetos, pedras, peças, resíduos, material solto ou detritos capazes de causar dano à aeronave.",
    parametroEsperado:
      "Taxiway livre de FOD e materiais soltos.",
    aplicabilidade: {
      tipo: "universal",
    },
    risco: "ALTO",
    comoInspecionar:
      "Percorrer visualmente a taxiway, bordas e acostamentos, verificando pedras soltas, peças, fragmentos de pavimento, material de obra e resíduos.",
    referenciaNormativa: "RBAC 153 Emenda 09",
    observacoesTecnicas:
      "FOD em taxiway pode causar ingestão por motores, dano a pneus e eventos de segurança operacional.",
  },

  {
    id: "INFRA-TWY-004",
    grupo: "TAXIWAY",
    item: "Sinalização horizontal da taxiway",
    criterio:
      "Verificar visibilidade, continuidade, contraste e coerência operacional das marcações da taxiway.",
    parametroEsperado:
      "Sinalização horizontal íntegra, visível, contínua e padronizada.",
    aplicabilidade: {
      tipo: "universal",
    },
    risco: "MÉDIO",
    comoInspecionar:
      "Avaliar eixo da taxiway, bordas, posições de espera, inscrições, setas direcionais, interseções e desgaste das pinturas.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Sinalização ruim reduz consciência situacional e pode contribuir para incursões em pista.",
  },

  {
    id: "INFRA-TWY-005",
    grupo: "TAXIWAY",
    item: "Sinalização luminosa e balizamento da taxiway",
    criterio:
      "Verificar funcionamento, integridade, alinhamento e visibilidade das luzes de taxiway quando aplicável.",
    parametroEsperado:
      "Sistema luminoso operacional, visível e compatível com operação noturna.",
    aplicabilidade: {
      tipo: "operacaoNoturna",
      valores: [true],
    },
    risco: "ALTO",
    comoInspecionar:
      "Executar inspeção noturna ou teste operacional verificando luzes apagadas, desalinhadas, obstruídas, danificadas ou com intensidade inadequada.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Falhas no balizamento comprometem taxiamento noturno e baixa visibilidade.",
  },

  {
    id: "INFRA-TWY-006",
    grupo: "TAXIWAY",
    item: "Posição de espera de pista em taxiway",
    criterio:
      "Verificar se as posições de espera estão corretamente identificadas, sinalizadas e compatíveis com operação IFR/VFR aprovada.",
    parametroEsperado:
      "Posições de espera corretamente identificadas, visíveis e operacionais.",
    aplicabilidade: {
      tipo: "operacaoIFR",
      valores: [true],
    },
    risco: "ALTO",
    comoInspecionar:
      "Avaliar marcações, placas, luzes quando aplicável, distância operacional, visibilidade e coerência com a circulação em solo.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Posições de espera são críticas para prevenção de incursão em pista.",
  },

  {
    id: "INFRA-TWY-007",
    grupo: "TAXIWAY",
    item: "Obstáculos laterais e faixa da taxiway",
    criterio:
      "Verificar presença de equipamentos, veículos, estruturas, materiais, valas ou objetos incompatíveis próximos à taxiway.",
    parametroEsperado:
      "Taxiway e suas áreas laterais livres de obstáculos incompatíveis.",
    aplicabilidade: {
      tipo: "universal",
    },
    risco: "CRÍTICO",
    comoInspecionar:
      "Percorrer lateralmente a taxiway, observando obstáculos, equipamentos, veículos, cones, materiais, postes, placas e interferências físicas.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Objetos indispensáveis devem respeitar frangibilidade, afastamento e localização segura.",
  },

  {
    id: "INFRA-TWY-008",
    grupo: "TAXIWAY",
    item: "Condição de drenagem da taxiway",
    criterio:
      "Verificar acúmulo de água, erosões, saturação, falhas de escoamento ou dispositivos de drenagem obstruídos.",
    parametroEsperado:
      "Taxiway sem empoçamentos, erosões críticas ou falhas de drenagem.",
    aplicabilidade: {
      tipo: "universal",
    },
    risco: "ALTO",
    comoInspecionar:
      "Inspecionar canaletas, caixas, grelhas, bordas, áreas laterais e pontos baixos, preferencialmente após chuva ou lavagem operacional.",
    referenciaNormativa: "RBAC 153 Emenda 09 / RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Água acumulada degrada pavimento, aumenta risco de FOD e prejudica taxiamento.",
  },

  {
    id: "INFRA-TWY-009",
    grupo: "TAXIWAY",
    item: "Curvas, fillets e compatibilidade com aeronave crítica",
    criterio:
      "Verificar se curvas, interseções e áreas de giro da taxiway são compatíveis com a aeronave crítica e não induzem excursões ou saída de pavimento.",
    parametroEsperado:
      "Geometria compatível com a aeronave crítica e com o fluxo operacional.",
    aplicabilidade: {
      tipo: "codigoNumero",
      valores: [3, 4],
    },
    risco: "ALTO",
    comoInspecionar:
      "Observar marcas de pneu fora do pavimento, desgaste nas bordas, necessidade de fillet, trajetória de aeronaves e compatibilidade das curvas.",
    referenciaNormativa: "RBAC 154 Emenda 08",
    observacoesTecnicas:
      "Curvas inadequadas podem causar saída de trem de pouso, FOD em bordas e restrição operacional.",
  },
];

export default INFRA_TAXIWAY;