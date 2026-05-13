// src/data/infra/infraKnowledgeBase.js
// Base inteligente de conhecimento técnico INFRA
// V3 / infra-lab
// Fontes principais:
// - RBAC 154: infraestrutura, geometria, dimensões, faixa, RESA, pista, taxiway, sinalização e auxílios visuais.
// - RBAC 153: operação, manutenção, pavimento, vegetação, drenagem, FOD, inspeções e condição operacional.
// - RBAC 107: AVSEC, controle de acesso, áreas restritas, cercas, barreiras e proteção do lado ar.
// - Manual SAC/MINFRA/ITA 2021: apoio conceitual e de engenharia, nunca como fonte normativa principal.

export const INFRA_KNOWLEDGE_BASE = {
    vegetacao: {
      id: "vegetacao",
  
      assunto: "Vegetação em áreas operacionais",
  
      tipoComparacao: "MAXIMO",
  
      valorLimite: 15,
  
      unidade: "cm",
  
      exigeValorNumerico: true,
  
      parametro:
        "A vegetação em áreas operacionais, especialmente faixa de pista e áreas adjacentes, deve permanecer controlada, baixa e sem interferir na segurança operacional. Altura máxima operacional recomendada: 15 cm.",
  
      criterioTecnico:
        "Vegetação acima de 15 cm pode ocultar obstáculos, favorecer fauna, comprometer drenagem, reduzir visibilidade de sinalização e dificultar inspeções operacionais.",
  
      comoInspecionar:
        "Medir ou estimar altura predominante da vegetação na faixa de pista e áreas adjacentes. Verificar vegetação densa, moitas, arbustos, árvores, acúmulo orgânico, atração de fauna e interferência na drenagem.",
  
      logicaConformidade:
        "CONFORME quando altura da vegetação for menor ou igual a 15 cm.",
  
      criticidade: "MÉDIA",
  
      origem: "RBAC 153 / manutenção operacional",
    },
  
    borrachaZonaToque: {
      id: "borrachaZonaToque",
      assunto: "Borracha acumulada na zona de toque",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A zona de toque deve permanecer sem acúmulo excessivo de borracha que comprometa atrito, frenagem, aderência ou segurança operacional.",
      criterioTecnico:
        "Acúmulo de borracha pode reduzir coeficiente de atrito, aumentar distância de parada, elevar risco em pista molhada e indicar necessidade de medição de atrito ou remoção.",
      comoInspecionar:
        "Inspecionar visualmente as zonas de toque das cabeceiras em operação. Observar manchas escuras contínuas, polimento superficial, contaminação, perda aparente de textura e necessidade de ensaio de atrito.",
      logicaConformidade:
        "Avaliação qualitativa: CONFORME quando não houver acúmulo relevante de borracha; NÃO CONFORME quando houver acúmulo capaz de comprometer atrito ou indicar necessidade de intervenção.",
      criticidade: "ALTA",
      origem: "RBAC 153 / manutenção de pavimentos e segurança operacional",
    },
  
    pavimentoPista: {
      id: "pavimentoPista",
      assunto: "Condição do pavimento da pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "O pavimento da pista deve permanecer íntegro, regular, sem defeitos críticos, sem FOD e sem degradação que comprometa rolamento, controle direcional, frenagem ou segurança operacional.",
      criterioTecnico:
        "Trincas, buracos, deformações, recalques, desagregação, remendos inadequados e material solto podem gerar FOD, perda de controle, dano a aeronaves e redução da segurança.",
      comoInspecionar:
        "Verificar trincas, buracos, remendos, juntas abertas, afundamentos, ondulações, deformações, borracha acumulada, material solto, FOD e condição superficial geral.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual e operacional.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    drenagemPista: {
      id: "drenagemPista",
      assunto: "Drenagem da pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A pista deve permanecer sem acúmulo de água, lâminas d’água, poças persistentes ou condições que favoreçam aquaplanagem.",
      criterioTecnico:
        "Drenagem inadequada pode comprometer aderência, aumentar distância de frenagem, gerar aquaplanagem e degradar o pavimento.",
      comoInspecionar:
        "Verificar poças, pontos baixos, lâminas d’água, escoamento superficial, marcas de fluxo, obstrução de dispositivos de drenagem e sinais de aquaplanagem.",
      logicaConformidade:
        "Avaliação qualitativa: CONFORME quando não houver acúmulo relevante; NÃO CONFORME quando houver empoçamento, lâmina d’água ou risco de aquaplanagem.",
      criticidade: "ALTA",
      origem: "RBAC 153 / manutenção operacional",
    },
  
    drenagemFaixa: {
      id: "drenagemFaixa",
      assunto: "Drenagem da faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A faixa de pista deve possuir drenagem funcional, sem erosões, valas perigosas, saturação de solo ou carreamento de material que comprometa a segurança.",
      criterioTecnico:
        "Erosões, valas e saturação podem reduzir suporte da área, criar obstáculos perigosos e comprometer a função protetiva da faixa.",
      comoInspecionar:
        "Verificar erosões, valas, bueiros, caixas, canais, obstruções, solo saturado, acúmulo de água e carreamento de material.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da condição de drenagem e erosão.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    drenagemResa: {
      id: "drenagemResa",
      assunto: "Drenagem da RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A RESA deve permanecer drenada, sem empoçamento, erosão crítica, valas perigosas ou drenagem exposta que comprometa sua função de segurança.",
      criterioTecnico:
        "A drenagem inadequada pode reduzir suporte do solo, gerar erosões e transformar a RESA em área de risco em caso de excursão de pista.",
      comoInspecionar:
        "Verificar acúmulo de água, valas, erosões, saturação do solo, dispositivos de drenagem expostos, taludes e pontos de instabilidade.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da RESA.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    obstaculosResa: {
      id: "obstaculosResa",
      assunto: "Obstáculos na RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A RESA deve permanecer livre de obstáculos incompatíveis, objetos fixos, cercas, equipamentos, valas perigosas, taludes agressivos ou interferências que comprometam a segurança.",
      criterioTecnico:
        "Obstáculos na RESA podem agravar danos à aeronave em caso de pouso antes da cabeceira ou ultrapassagem do final de pista.",
      comoInspecionar:
        "Percorrer visualmente a RESA, registrar obstáculos, cercas, postes, equipamentos, valas, vegetação densa, taludes e objetos fixos com foto e localização aproximada.",
      logicaConformidade:
        "Avaliação qualitativa: CONFORME quando a RESA estiver livre de obstáculos incompatíveis; NÃO CONFORME quando houver interferência perigosa.",
      criticidade: "CRÍTICA",
      origem: "RBAC 154 / segurança operacional",
    },
  
    superficieResa: {
      id: "superficieResa",
      assunto: "Regularidade superficial da RESA",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A superfície da RESA deve estar regular, nivelada, sem erosões críticas, sem recalques relevantes, sem material solto e com suporte compatível com sua função de segurança.",
      criterioTecnico:
        "Irregularidades superficiais podem aumentar danos à aeronave, prejudicar desaceleração e comprometer a função da área de segurança.",
      comoInspecionar:
        "Verificar nivelamento, compactação, buracos, sulcos, recalques, material solto, erosões, trilhas de água e perda de suporte do solo.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual e operacional.",
      criticidade: "ALTA",
      origem: "RBAC 154 / RBAC 153",
    },
  
    obstaculosFaixa: {
      id: "obstaculosFaixa",
      assunto: "Obstáculos na faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A faixa de pista deve permanecer livre de obstáculos não frangíveis, objetos fixos incompatíveis, valas perigosas, vegetação inadequada e interferências operacionais.",
      criterioTecnico:
        "A faixa de pista protege aeronaves em excursão lateral ou longitudinal. Objetos incompatíveis aumentam o risco de dano à aeronave.",
      comoInspecionar:
        "Verificar objetos, equipamentos, cercas, postes, vegetação, valas, desníveis, drenagens expostas e materiais soltos dentro da faixa.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da faixa de pista.",
      criticidade: "ALTA",
      origem: "RBAC 154 / RBAC 153",
    },
  
    superficieFaixa: {
      id: "superficieFaixa",
      assunto: "Nivelamento e regularidade da faixa de pista",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A faixa de pista deve apresentar superfície regular, sem desníveis perigosos, erosões críticas, recalques, valas ou perda de suporte.",
      criterioTecnico:
        "A regularidade da faixa reduz danos à aeronave em caso de excursão e permite melhor condição operacional da área protegida.",
      comoInspecionar:
        "Verificar nivelamento, buracos, erosões, recalques, valas, transições laterais, solo saturado, vegetação e presença de material solto.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da regularidade da faixa.",
      criticidade: "ALTA",
      origem: "RBAC 154 / RBAC 153",
    },
  
    fod: {
      id: "fod",
      assunto: "Objetos estranhos / FOD",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Áreas operacionais devem permanecer livres de objetos estranhos, detritos, pedras, peças, materiais soltos ou qualquer elemento capaz de causar dano à aeronave.",
      criterioTecnico:
        "FOD pode causar ingestão por motores, perfuração de pneus, danos estruturais e eventos de segurança operacional.",
      comoInspecionar:
        "Inspecionar pista, taxiway, pátio, acostamentos, faixa preparada, drenagens, áreas de obra, bordas de pavimento e pontos de concentração de detritos.",
      logicaConformidade:
        "Avaliação qualitativa: CONFORME quando área estiver livre de FOD; NÃO CONFORME quando houver objetos ou detritos relevantes.",
      criticidade: "ALTA",
      origem: "RBAC 153 / segurança operacional",
    },
  
    sinalizacaoHorizontal: {
      id: "sinalizacaoHorizontal",
      assunto: "Sinalização horizontal",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A sinalização horizontal deve estar visível, padronizada, contrastante, coerente com a operação e sem conflito operacional.",
      criterioTecnico:
        "Marcas apagadas, conflitantes ou mal posicionadas podem causar erro de navegação em solo, incursão em pista ou perda de consciência situacional.",
      comoInspecionar:
        "Verificar eixo, bordas, cabeceira, designação de pista, zona de toque, ponto de visada, taxiways, posição de espera, pátio e áreas interditadas.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da sinalização.",
      criticidade: "ALTA",
      origem: "RBAC 154 / RBAC 153",
    },
  
    sinalizacaoLuminosa: {
      id: "sinalizacaoLuminosa",
      assunto: "Sinalização luminosa e balizamento",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Auxílios luminosos devem estar funcionais, alinhados, visíveis, com intensidade adequada e compatíveis com operação noturna ou IFR.",
      criterioTecnico:
        "Falhas em luzes de pista, taxiway, cabeceira, fim de pista ou PAPI podem comprometer orientação visual, aproximação, pouso, decolagem e taxiamento.",
      comoInspecionar:
        "Verificar lâmpadas apagadas, desalinhadas, obstruídas, intensidade inadequada, falha de circuitos, balizamento de taxiway e sinalização luminosa de cabeceira/fim de pista.",
      logicaConformidade:
        "Avaliação qualitativa/funcional dos auxílios luminosos.",
      criticidade: "ALTA",
      origem: "RBAC 154 / RBAC 153",
    },
  
    taxiwayPavimento: {
      id: "taxiwayPavimento",
      assunto: "Pavimento da taxiway",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A taxiway deve apresentar pavimento seguro, sem trincas críticas, buracos, deformações, FOD ou degradação que comprometa taxiamento.",
      criterioTecnico:
        "Defeitos em taxiway podem gerar FOD, danos a pneus, perda de controle direcional e restrições operacionais.",
      comoInspecionar:
        "Verificar juntas, trincas, buracos, remendos, desagregação, FOD, drenagem, acostamentos, bordas e transições.",
      logicaConformidade:
        "Avaliação qualitativa por inspeção visual da taxiway.",
      criticidade: "MÉDIA",
      origem: "RBAC 153 / RBAC 154",
    },
  
    cercaOperacional: {
      id: "cercaOperacional",
      assunto: "Cerca operacional / lado ar",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A cerca operacional deve proteger o lado ar e áreas de movimento, impedindo acesso não autorizado de pessoas, veículos e animais à área operacional.",
      criterioTecnico:
        "A cerca operacional está vinculada à proteção da área operacional, pista, taxiway, pátio, áreas restritas e controle de acesso do lado ar.",
      comoInspecionar:
        "Verificar continuidade da barreira, integridade, portões, cadeados, controle de acesso, brechas, pontos de invasão, sinais de passagem de animais, iluminação, vigilância e sinalização de área restrita.",
      logicaConformidade:
        "Avaliação qualitativa de integridade, continuidade e controle de acesso.",
      criticidade: "ALTA",
      origem: "RBAC 107 / RBAC 153 / apoio Manual ITA",
    },
  
    cercaPatrimonial: {
      id: "cercaPatrimonial",
      assunto: "Cerca patrimonial / sítio aeroportuário",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "A cerca patrimonial deve delimitar o sítio aeroportuário, proteger a área de propriedade do aeroporto e reduzir risco de invasões, acessos indevidos e interferências externas.",
      criterioTecnico:
        "A cerca patrimonial protege o perímetro do aeroporto como bem patrimonial, podendo estar afastada da área operacional. Não substitui necessariamente a cerca operacional do lado ar.",
      comoInspecionar:
        "Verificar continuidade do perímetro, estado físico, pontos vulneráveis, erosões sob a cerca, acesso irregular, portões, placas, iluminação, interface com vias públicas e ocupações vizinhas.",
      logicaConformidade:
        "Avaliação qualitativa de integridade patrimonial e vulnerabilidades externas.",
      criticidade: "MÉDIA",
      origem: "RBAC 107 / apoio Manual ITA",
    },
  
    controleAcesso: {
      id: "controleAcesso",
      assunto: "Controle de acesso ao lado ar",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "O acesso ao lado ar e áreas restritas deve ser controlado, autorizado, monitorado e compatível com os procedimentos AVSEC do operador aeroportuário.",
      criterioTecnico:
        "Falhas de controle de acesso podem permitir interferência ilícita, incursões, entrada de animais, veículos ou pessoas não autorizadas.",
      comoInspecionar:
        "Verificar portões, guaritas, credenciais, registros de acesso, barreiras físicas, câmeras, iluminação, rotinas de vigilância, integridade de cadeados e segregação entre lado terra e lado ar.",
      logicaConformidade:
        "Avaliação qualitativa de controle de acesso e proteção AVSEC.",
      criticidade: "ALTA",
      origem: "RBAC 107",
    },
  
    areaRestrita: {
      id: "areaRestrita",
      assunto: "Área restrita / área interditada",
      tipoComparacao: "QUALITATIVO",
      exigeValorNumerico: false,
      parametro:
        "Áreas restritas, interditadas ou fora de serviço devem estar sinalizadas, segregadas, controladas e coerentes com a condição operacional declarada.",
      criterioTecnico:
        "Áreas mal sinalizadas podem gerar incursões, uso indevido, risco a aeronaves, veículos e equipes operacionais.",
      comoInspecionar:
        "Verificar NOTAM, cones, barreiras, pintura, isolamento físico, placas, comunicação operacional, coerência documental e evidências em campo.",
      logicaConformidade:
        "Avaliação qualitativa de segregação, sinalização e coerência operacional.",
      criticidade: "ALTA",
      origem: "RBAC 153 / RBAC 107",
    },
  };
  
  export function buscarConhecimentoInfra(chave) {
    if (!chave) return null;
    return INFRA_KNOWLEDGE_BASE[chave] || null;
  }
  
  export default INFRA_KNOWLEDGE_BASE;