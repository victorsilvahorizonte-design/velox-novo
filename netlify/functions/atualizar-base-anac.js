const URLS_ANAC = {
  aerodromosPublicos:
    "https://www.gov.br/anac/pt-br/acesso-a-informacao/dados-abertos/areas-de-atuacao/aerodromos/aerodromos-publicos/lista-de-aerodromos-publicos/@@download/file",
  movimentacao:
    "https://www.gov.br/anac/pt-br/acesso-a-informacao/dados-abertos/areas-de-atuacao/operador-aeroportuario/dados-de-movimentacao-aeroportuaria/@@download/file",
};

const BASE_FALLBACK = {
  SBGO: {
    icao: "SBGO",
    nome: "Aeroporto Internacional de Goiânia - Santa Genoveva",
    cidade: "Goiânia",
    uf: "GO",
    uso: "Público",
    operacao: "IFR",
    passageirosAno: 3500000,
    comprimentoPista: 2500,
    envergaduraMaxima: 52,
    tipoAeronave: "grandes",
    tipoOperacaoAVSEC: ["doméstica", "internacional", "passageiros", "carga"],
    taxiway: true,
    patio: true,
    pavimentado: true,
    sistemaEletrico: true,
    operacaoNoturna: true,
  },
  SBBR: {
    icao: "SBBR",
    nome: "Aeroporto Internacional de Brasília",
    cidade: "Brasília",
    uf: "DF",
    uso: "Público",
    operacao: "IFR",
    passageirosAno: 15000000,
    comprimentoPista: 3300,
    envergaduraMaxima: 65,
    tipoAeronave: "grandes",
    tipoOperacaoAVSEC: ["doméstica", "internacional", "passageiros", "carga"],
    taxiway: true,
    patio: true,
    pavimentado: true,
    sistemaEletrico: true,
    operacaoNoturna: true,
  },
  SBGR: {
    icao: "SBGR",
    nome: "Aeroporto Internacional de São Paulo - Guarulhos",
    cidade: "Guarulhos",
    uf: "SP",
    uso: "Público",
    operacao: "IFR",
    passageirosAno: 43000000,
    comprimentoPista: 3700,
    envergaduraMaxima: 65,
    tipoAeronave: "grandes",
    tipoOperacaoAVSEC: ["doméstica", "internacional", "passageiros", "carga"],
    taxiway: true,
    patio: true,
    pavimentado: true,
    sistemaEletrico: true,
    operacaoNoturna: true,
  },
};

function detectarSeparador(linha) {
  if (linha.includes(";")) return ";";
  if (linha.includes(",")) return ",";
  return ";";
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

function numero(valor) {
  if (!valor) return 0;

  return (
    Number(
      String(valor)
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "")
    ) || 0
  );
}

function lerCSV(texto) {
  const linhas = String(texto || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!linhas.length) return [];

  const separador = detectarSeparador(linhas[0]);
  const cabecalho = linhas[0].split(separador).map((c) => normalizarTexto(c));

  return linhas.slice(1).map((linha) => {
    const valores = linha.split(separador);
    const obj = {};

    cabecalho.forEach((col, i) => {
      obj[col] = (valores[i] || "").trim();
    });

    return obj;
  });
}

function pegar(obj, nomes) {
  const nomesNormalizados = nomes.map(normalizarTexto);

  for (const chave of Object.keys(obj || {})) {
    if (nomesNormalizados.includes(normalizarTexto(chave))) {
      return obj[chave];
    }
  }

  return "";
}

async function baixarTexto(url) {
  const resposta = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 AppInspecaoAeroportuaria/1.0",
      Accept: "text/csv,application/json,text/plain,*/*",
    },
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao baixar: ${url}`);
  }

  return await resposta.text();
}

function montarBase(aerodromos, movimentacao) {
  const mapaPassageiros = {};

  movimentacao.forEach((m) => {
    const icao = normalizarTexto(
      pegar(m, [
        "ICAO",
        "CODIGO ICAO",
        "CÓDIGO ICAO",
        "CODIGO_ICAO",
        "AEROPORTO ICAO",
        "SIGLA ICAO",
      ])
    );

    if (!icao || icao.length !== 4) return;

    const passageiros =
      numero(
        pegar(m, [
          "PASSAGEIROS",
          "PASSAGEIROS PAGOS",
          "PASSAGEIROS TOTAIS",
          "PASSAGEIROS EMBARCADOS",
          "PAX",
          "TOTAL PASSAGEIROS",
        ])
      ) || 0;

    mapaPassageiros[icao] = (mapaPassageiros[icao] || 0) + passageiros;
  });

  const resultado = {};

  aerodromos.forEach((a) => {
    const icao = normalizarTexto(
      pegar(a, [
        "ICAO",
        "CODIGO ICAO",
        "CÓDIGO ICAO",
        "CODIGO_ICAO",
        "CIAD",
        "CÓDIGO",
      ])
    );

    if (!icao || icao.length !== 4) return;

    const operacao = normalizarTexto(
      pegar(a, ["OPERACAO", "OPERAÇÃO", "TIPO OPERACAO", "TIPO DE OPERAÇÃO"])
    );

    const comprimentoPista = numero(
      pegar(a, [
        "COMPRIMENTO PISTA",
        "COMPRIMENTO DA PISTA",
        "COMPRIMENTO_PISTA",
        "PISTA COMPRIMENTO",
        "DIMENSAO PISTA",
      ])
    );

    const superficie = normalizarTexto(
      pegar(a, ["SUPERFICIE", "SUPERFÍCIE", "PAVIMENTO", "REVESTIMENTO"])
    );

    const pavimentado =
      superficie.includes("ASF") ||
      superficie.includes("CONCRETO") ||
      superficie.includes("PAV");

    const passageirosAno = mapaPassageiros[icao] || 0;

    resultado[icao] = {
      icao,
      nome:
        pegar(a, ["NOME", "NOME AERODROMO", "NOME DO AERODROMO", "DENOMINACAO"]) ||
        "Não informado",
      cidade: pegar(a, ["MUNICIPIO", "MUNICÍPIO", "CIDADE"]) || "",
      uf: pegar(a, ["UF", "ESTADO"]) || "",
      uso: "Público",
      operacao: operacao.includes("IFR") ? "IFR" : "VFR",
      passageirosAno,
      comprimentoPista,
      envergaduraMaxima: 36,
      tipoAeronave:
        comprimentoPista >= 1800
          ? "grandes"
          : comprimentoPista >= 1200
          ? "médias"
          : "pequenas",
      tipoOperacaoAVSEC:
        passageirosAno > 0 ? ["doméstica", "passageiros"] : [],
      taxiway: true,
      patio: true,
      pavimentado,
      sistemaEletrico: operacao.includes("IFR") || operacao.includes("NOT"),
      operacaoNoturna: operacao.includes("NOT") || operacao.includes("IFR"),
    };
  });

  return resultado;
}

export async function handler() {
  try {
    let base = {};
    let modo = "fallback";
    let mensagem = "";

    try {
      const textoAerodromos = await baixarTexto(URLS_ANAC.aerodromosPublicos);
      const textoMovimentacao = await baixarTexto(URLS_ANAC.movimentacao);

      const aerodromos = lerCSV(textoAerodromos);
      const movimentacao = lerCSV(textoMovimentacao);

      base = montarBase(aerodromos, movimentacao);

      if (Object.keys(base).length === 0) {
        throw new Error("Arquivos baixados, mas nenhuma base válida foi montada.");
      }

      modo = "online-anac";
      mensagem = "Base ANAC online carregada e processada.";
    } catch (erroOnline) {
      base = BASE_FALLBACK;
      modo = "fallback-local";
      mensagem =
        "Não foi possível processar a base online da ANAC. Foi usada base reserva.";
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        sucesso: true,
        modo,
        mensagem,
        atualizadoEm: new Date().toISOString(),
        total: Object.keys(base).length,
        aerodromos: base,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        sucesso: false,
        erro: error.message,
      }),
    };
  }
}