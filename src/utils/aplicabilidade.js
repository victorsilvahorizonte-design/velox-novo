// src/utils/aplicabilidade.js
// Motor definitivo de aplicabilidade por RBAC 153, RBAC 154 e RBAC 107
// Versão híbrida corrigida para ler campos diretos e também item.aplicabilidade

const ORDEM_LETRAS = ["A", "B", "C", "D", "E", "F"];

function normalizar(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function booleano(valor) {
  return (
    valor === true ||
    valor === 1 ||
    valor === "1" ||
    normalizar(valor) === "SIM" ||
    normalizar(valor) === "TRUE"
  );
}

function textoItem(item) {
  return normalizar(
    [
      item?.id,
      item?.ref,
      item?.norma,
      item?.rbac,
      item?.subparte,
      item?.titulo,
      item?.item,
      item?.descricao,
      item?.criterio,
      item?.evidencias,
      item?.risco,
      JSON.stringify(item?.aplicabilidade || {}),
      JSON.stringify(item?.condicoes || {}),
    ].join(" ")
  );
}

function obter(item, nomes) {
  const aplicabilidade = item?.aplicabilidade || {};

  for (const nome of nomes) {
    if (
      item?.[nome] !== undefined &&
      item?.[nome] !== null &&
      item?.[nome] !== ""
    ) {
      return item[nome];
    }

    if (
      aplicabilidade?.[nome] !== undefined &&
      aplicabilidade?.[nome] !== null &&
      aplicabilidade?.[nome] !== ""
    ) {
      return aplicabilidade[nome];
    }
  }

  return "";
}

function lista(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor.map(String);

  return String(valor)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function contemAlgum(texto, palavras) {
  return palavras.some((p) => texto.includes(normalizar(p)));
}

function detectarNorma(item) {
  const t = textoItem(item);
  const ref = normalizar(item?.ref || item?.id || "");

  if (t.includes("RBAC107") || ref.startsWith("107")) return "RBAC107";
  if (t.includes("RBAC154") || ref.startsWith("154")) return "RBAC154";
  if (t.includes("RBAC153") || ref.startsWith("153")) return "RBAC153";

  return "";
}

function nivelClasse153(valor) {
  const t = normalizar(valor);

  if (t.includes("IV")) return 4;
  if (t.includes("III")) return 3;
  if (t.includes("II")) return 2;
  if (t.includes("I")) return 1;

  return 1;
}

function nivelRBAC107(valor) {
  const t = normalizar(valor);

  if (t.includes("AP-3")) return 3;
  if (t.includes("AP-2")) return 2;
  if (t.includes("AP-1")) return 1;

  return 0;
}

function nivelClasseDoItem(classe) {
  const c = normalizar(classe);

  if (c === "TODAS" || c === "TODOS") return 0;
  if (c === "I" || c === "IA" || c === "IB" || c === "I-A" || c === "I-B") return 1;
  if (c === "II") return 2;
  if (c === "III") return 3;
  if (c === "IV") return 4;

  if (c.includes("CLASSE IV")) return 4;
  if (c.includes("CLASSE III")) return 3;
  if (c.includes("CLASSE II")) return 2;
  if (c.includes("CLASSE I")) return 1;

  return 0;
}

function numeroAtende(atual, minimo) {
  return Number(atual || 1) >= Number(minimo || 1);
}

function letraAtende(atual, minima) {
  const a = ORDEM_LETRAS.indexOf(normalizar(atual || "B"));
  const m = ORDEM_LETRAS.indexOf(normalizar(minima || "A"));

  if (a < 0 || m < 0) return true;

  return a >= m;
}

function perfilClasseIAtende(item, config) {
  const perfis = lista(
    obter(item, [
      "perfilClasseI",
      "perfisClasseI",
      "perfilAplicavel",
      "perfisAplicaveis",
    ])
  );

  if (perfis.length === 0) return true;

  const classificacao = normalizar(
    config.classificacaoRBAC153 ||
      config.classeRBAC153 ||
      config.perfilClasseI ||
      ""
  );

  const perfilConfig = normalizar(config.perfilClasseI || classificacao);

  return perfis.some((perfil) => {
    const p = normalizar(perfil);

    if (p === "TODOS" || p === "TODAS") return true;

    if (p === "A" || p === "I-A" || p === "CLASSE I-A") {
      return perfilConfig.includes("A") || classificacao.includes("I-A");
    }

    if (p === "B" || p === "I-B" || p === "CLASSE I-B") {
      return perfilConfig.includes("B") || classificacao.includes("I-B");
    }

    return classificacao.includes(p);
  });
}

function apTexto(texto) {
  if (texto.includes("AP-3")) return 3;
  if (texto.includes("AP-2")) return 2;
  if (texto.includes("AP-1")) return 1;
  return 0;
}

export function verificarAplicabilidade(item, configAerodromo = {}) {
  if (!item) return false;

  const texto = textoItem(item);
  const norma = detectarNorma(item);
  const ap = item.aplicabilidade || {};

  const config = {
    usoPublico: true,

    classeRBAC153: "Classe I",
    classificacaoRBAC153: "Classe I",
    perfilClasseI: "",

    categoriaRBAC107: "AP-0",

    codigoNumero: 1,
    codigoLetra: "B",
    codigoReferenciaRBAC154: "1B",

    tipoOperacao: "VFR",
    operacaoNoturna: false,
    internacional: false,

    pavimentado: false,
    sistemaEletrico: false,
    baixaVisibilidade: false,

    possuiPista: true,
    possuiTaxiway: true,
    possuiPatio: true,

    possuiAVSEC: true,
    possuiOperacaoPassageiros: true,
    possuiOperacaoCarga: false,

    possuiAreaInterditada: false,
    possuiObstaculos: false,
    possuiAreaForaServico: false,
    possuiAreaAntesCabeceira: false,
    possuiAreaSemSuporte: false,
    possuiPontoTesteAltimetro: false,

    ...configAerodromo,
  };

  if (item.aplicavel === false || item.naoAplicavel === true) return false;

  if (ap.usoPublico === true && !booleano(config.usoPublico)) return false;

  const nivel153 = nivelClasse153(
    config.classificacaoRBAC153 || config.classeRBAC153
  );

  const nivel107 = nivelRBAC107(config.categoriaRBAC107);

  const codigoNumeroAtual = Number(config.codigoNumero || 1);
  const codigoLetraAtual = config.codigoLetra || "B";

  const aeroportoGrande =
    nivel153 >= 4 ||
    nivel107 >= 3 ||
    (codigoNumeroAtual >= 4 &&
      ["D", "E", "F"].includes(normalizar(codigoLetraAtual)));

  // RBAC 153 — classes aplicáveis
  const classesAplicaveis = lista(
    obter(item, [
      "classesAplicaveis",
      "classesRBAC153",
      "classes153",
      "classeRBAC153",
      "classeAplicavel",
      "classes",
    ])
  );

  if (classesAplicaveis.length > 0) {
    const permitido = classesAplicaveis.some((classe) => {
      const c = normalizar(classe);
      const nivelItem = nivelClasseDoItem(classe);

      if (c === "TODAS" || c === "TODOS") return true;

      return nivelItem > 0 && nivel153 >= nivelItem;
    });

    if (!permitido) return false;
  }

  if (!perfilClasseIAtende(item, config)) return false;

  const classeMinima = obter(item, [
    "classeMinimaRBAC153",
    "classeMinima153",
    "classeMinima",
  ]);

  if (classeMinima && nivel153 < nivelClasseDoItem(classeMinima)) {
    return false;
  }

  // RBAC 107 — categoria AVSEC
  const categoriaMinima107 = obter(item, [
    "categoriaMinimaRBAC107",
    "classeMinimaRBAC107",
    "avsecMinimo",
  ]);

  if (categoriaMinima107 && nivel107 < nivelRBAC107(categoriaMinima107)) {
    return false;
  }

  const categorias107 = lista(
    obter(item, [
      "categoriasRBAC107",
      "classesRBAC107",
      "categoriaRBAC107",
      "classeRBAC107",
      "categoriasAplicaveis",
      "categorias",
    ])
  );

  if (categorias107.length > 0) {
    const permitido107 = categorias107.some((cat) => {
      const c = normalizar(cat);

      if (c === "TODAS" || c === "TODOS") return true;
      if (c === "AP-0") return nivel107 >= 0;
      if (c === "AP-1") return nivel107 >= 1;
      if (c === "AP-2") return nivel107 >= 2;
      if (c === "AP-3") return nivel107 >= 3;

      return false;
    });

    if (!permitido107) return false;
  }

  const apExigidoNoTexto = apTexto(texto);

  if (norma === "RBAC107" && apExigidoNoTexto > nivel107) {
    return false;
  }

  // RBAC 154 — código de referência
  const codigoNumeroMinimo = obter(item, [
    "codigoMin",
    "codigoNumeroMinimo",
    "codigoMinimo",
    "codigoNumeroMinimoRBAC154",
  ]);

  if (
    codigoNumeroMinimo &&
    !numeroAtende(codigoNumeroAtual, codigoNumeroMinimo)
  ) {
    return false;
  }

  const codigoLetraMinima = obter(item, [
    "letraMin",
    "codigoLetraMinima",
    "letraMinima",
    "codigoLetraMinimaRBAC154",
  ]);

  if (codigoLetraMinima && !letraAtende(codigoLetraAtual, codigoLetraMinima)) {
    return false;
  }

  const codigos154 = lista(
    obter(item, [
      "codigosRBAC154",
      "codigoReferenciaRBAC154",
      "codigosReferencia",
      "codigoAplicavel",
      "codigosAplicaveis",
    ])
  );

  if (codigos154.length > 0) {
    const codigoAtual = normalizar(
      config.codigoReferenciaRBAC154 ||
        `${config.codigoNumero}${config.codigoLetra}`
    );

    const permitido154 = codigos154.some((codigo) => {
      const c = normalizar(codigo);
      return c === "TODOS" || c === "TODAS" || c === codigoAtual;
    });

    if (!permitido154) return false;
  }

  // Regra especial RBAC 154 aeroporto grande
  if (norma === "RBAC154" && aeroportoGrande) {
    return true;
  }

  // Regras explícitas — agora lê direto e dentro de aplicabilidade
  if ((item.requerPista || ap.requerPista) && !booleano(config.possuiPista)) {
    return false;
  }

  if ((item.requerTaxiway || ap.requerTaxiway) && !booleano(config.possuiTaxiway)) {
    return false;
  }

  if ((item.requerPatio || ap.requerPatio) && !booleano(config.possuiPatio)) {
    return false;
  }

  if (
    (item.requerOperacaoNoturna || item.exigeOperacaoNoturna || ap.requerOperacaoNoturna) &&
    !booleano(config.operacaoNoturna)
  ) {
    return false;
  }

  if (
    (item.requerSistemaEletrico || item.exigeSistemaEletrico || ap.requerSistemaEletrico) &&
    !booleano(config.sistemaEletrico)
  ) {
    return false;
  }

  if (
    (item.requerSinalizacaoLuminosa || ap.requerSinalizacaoLuminosa) &&
    !booleano(config.possuiSinalizacaoLuminosa)
  ) {
    return false;
  }

  if (
    (item.requerBalizas || ap.requerBalizas) &&
    !booleano(config.possuiBalizas)
  ) {
    return false;
  }

  if (
    (item.requerPavimento || item.exigePavimento || ap.requerPavimento) &&
    !booleano(config.pavimentado)
  ) {
    return false;
  }

  if (
    (item.requerIFR || item.exigeIFR || ap.requerIFR) &&
    normalizar(config.tipoOperacao) !== "IFR"
  ) {
    return false;
  }

  if (
    (item.requerBaixaVisibilidade ||
      item.exigeBaixaVisibilidade ||
      ap.requerBaixaVisibilidade) &&
    !booleano(config.baixaVisibilidade)
  ) {
    return false;
  }

  if (
    (item.requerInternacional || ap.requerInternacional) &&
    !booleano(config.internacional)
  ) {
    return false;
  }

  if (
    (item.requerAVSEC || ap.requerAVSEC) &&
    !booleano(config.possuiAVSEC)
  ) {
    return false;
  }

  if (
    (item.requerOperacaoPassageiros || ap.requerOperacaoPassageiros) &&
    !booleano(config.possuiOperacaoPassageiros)
  ) {
    return false;
  }

  if (
    (item.requerOperacaoCarga || ap.requerOperacaoCarga) &&
    !booleano(config.possuiOperacaoCarga)
  ) {
    return false;
  }

  // Campos de inspeção: não esconder no RBAC 154, mas filtrar nos demais quando exigidos
  if (
    (item.requerAreaInterditada || ap.requerAreaInterditada) &&
    config.possuiAreaInterditada === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    (item.requerAreaForaServico || ap.requerAreaForaServico) &&
    config.possuiAreaForaServico === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    (item.requerAreaAntesCabeceira || ap.requerAreaAntesCabeceira) &&
    config.possuiAreaAntesCabeceira === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    (item.requerAreaSemSuporte || ap.requerAreaSemSuporte) &&
    config.possuiAreaSemSuporte === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    (item.requerObstaculos || ap.requerObstaculos) &&
    config.possuiObstaculos === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    (item.requerPontoTesteAltimetro || ap.requerPontoTesteAltimetro) &&
    config.possuiPontoTesteAltimetro === false &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  // Regras inferidas pelo texto
  if (
    contemAlgum(texto, ["BAIXA VISIBILIDADE", "LVP", "CAT II", "CAT III"]) &&
    !booleano(config.baixaVisibilidade) &&
    norma !== "RBAC154"
  ) {
    return false;
  }

  if (
    contemAlgum(texto, [
      "IFR",
      "INSTRUMENTOS",
      "APROXIMACAO POR INSTRUMENTOS",
      "APROXIMAÇÃO POR INSTRUMENTOS",
      "CAT I",
      "CAT II",
      "CAT III",
      "ILS",
    ]) &&
    normalizar(config.tipoOperacao) !== "IFR"
  ) {
    return false;
  }

  if (
    contemAlgum(texto, [
      "OPERACAO NOTURNA",
      "OPERAÇÃO NOTURNA",
      "BALIZAMENTO",
      "LUZES",
      "SINALIZACAO LUMINOSA",
      "SINALIZAÇÃO LUMINOSA",
      "AUXILIOS LUMINOSOS",
      "AUXÍLIOS LUMINOSOS",
      "LUZ DE BORDA",
      "LUZ DE EIXO",
      "PAPI",
    ]) &&
    !booleano(config.operacaoNoturna)
  ) {
    return false;
  }

  if (
    contemAlgum(texto, [
      "PAVIMENTO",
      "PAVIMENTADA",
      "ASFALTO",
      "CONCRETO",
      "PCN",
      "ACR",
      "PCR",
    ]) &&
    !booleano(config.pavimentado)
  ) {
    return false;
  }

  if (
    contemAlgum(texto, ["TAXIWAY", "PISTA DE TAXI", "PISTA DE TÁXI", "PISTA DE TAXIAMENTO"]) &&
    !booleano(config.possuiTaxiway)
  ) {
    return false;
  }

  if (
    contemAlgum(texto, ["PATIO", "PÁTIO", "ESTACIONAMENTO DE AERONAVES"]) &&
    !booleano(config.possuiPatio)
  ) {
    return false;
  }

  if (
    contemAlgum(texto, ["INTERNACIONAL"]) &&
    !booleano(config.internacional) &&
    nivel153 < 3 &&
    nivel107 < 3
  ) {
    return false;
  }

  if (
    contemAlgum(texto, ["CARGA AEREA", "CARGA AÉREA", "TERMINAL DE CARGA", "TECA"]) &&
    !booleano(config.possuiOperacaoCarga)
  ) {
    return false;
  }

  if (
    contemAlgum(texto, ["PASSAGEIROS", "EMBARQUE", "DESEMBARQUE"]) &&
    !booleano(config.possuiOperacaoPassageiros)
  ) {
    return false;
  }

  // Regras de porte/complexidade
  if (
    nivel153 === 1 &&
    contemAlgum(texto, [
      "CLASSE II",
      "CLASSE III",
      "CLASSE IV",
      "GRANDE PORTE",
      "ALTA COMPLEXIDADE",
      "ELEVADO MOVIMENTO",
      "MOVIMENTO INTENSO",
      "AEROPORTO INTERNACIONAL DE GRANDE PORTE",
    ])
  ) {
    return false;
  }

  if (
    nivel153 <= 2 &&
    contemAlgum(texto, [
      "CLASSE III",
      "CLASSE IV",
      "GRANDE COMPLEXIDADE",
      "GRANDE INFRAESTRUTURA",
    ])
  ) {
    return false;
  }

  if (
    nivel153 <= 3 &&
    contemAlgum(texto, ["CLASSE IV", "ALTISSIMA COMPLEXIDADE", "ALTÍSSIMA COMPLEXIDADE"])
  ) {
    return false;
  }

  return true;
}

export default verificarAplicabilidade;