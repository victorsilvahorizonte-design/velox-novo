import fs from "fs";
import path from "path";

const CSV_PATH = path.resolve("public/data/anac-aerodromos-publicos.csv");
const JSON_PATH = path.resolve("public/data/aerodromosCompletos.json");

function limparTexto(valor) {
  return String(valor || "").trim().replace(/^"|"$/g, "");
}

function normalizarICAO(valor) {
  return limparTexto(valor).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function numero(valor) {
  const n = Number(String(valor || "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function separarCSVAnac(texto) {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim());

  const indiceCabecalho = linhas.findIndex((linha) =>
    linha.toUpperCase().includes("CÓDIGO OACI;CIAD;NOME")
  );

  if (indiceCabecalho === -1) {
    throw new Error("Cabeçalho real da ANAC não encontrado.");
  }

  const cabecalho = linhas[indiceCabecalho].split(";").map(limparTexto);

  return linhas.slice(indiceCabecalho + 1).map((linha) => {
    const colunas = linha.split(";");
    const obj = {};

    cabecalho.forEach((campo, i) => {
      obj[campo] = limparTexto(colunas[i]);
    });

    return obj;
  });
}

function pegarCampo(obj, nomes) {
  for (const nome of nomes) {
    const chave = Object.keys(obj).find(
      (k) =>
        k
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() ===
        nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
    );

    if (chave) return obj[chave];
  }

  return "";
}

function converterParaBase(csv) {
  const linhas = separarCSVAnac(csv);

  const base = linhas
    .map((a) => {
      const icao = normalizarICAO(pegarCampo(a, ["CÓDIGO OACI", "CODIGO OACI"]));

      if (!icao || icao.length !== 4) return null;

      const nome = pegarCampo(a, ["NOME"]) || "Aeródromo não informado";
      const cidade = pegarCampo(a, ["MUNICÍPIO ATENDIDO", "MUNICIPIO ATENDIDO"]);
      const uf = pegarCampo(a, ["UF"]);
      const operacaoBruta = pegarCampo(a, ["OPERAÇÃO", "OPERACAO"]);
      const internacionalizacao = pegarCampo(a, [
        "INTERNACIONALIZAÇÃO",
        "INTERNACIONALIZACAO",
      ]);

      const comprimentoPista = numero(pegarCampo(a, ["COMPRIMENTO"]));
      const larguraPista = numero(pegarCampo(a, ["LARGURA"]));

      const ehIFR = operacaoBruta.toUpperCase().includes("IFR");
      const ehInternacional = internacionalizacao
        .toUpperCase()
        .includes("INTERNACIONAL");

      return {
        icao,
        nome,
        cidade,
        uf,
        uso: "Público",

        passageirosAno: 0,
        comprimentoPista,
        larguraPista,
        envergaduraMaxima: 0,
        tipoAeronave: "médias",

        tipoOperacaoAVSEC: ehInternacional
          ? ["internacional", "passageiros"]
          : ["doméstica", "passageiros"],

        operacao: ehIFR ? "IFR" : "VFR",

        pavimentado: true,
        taxiway: false,
        patio: true,
        sistemaEletrico: ehIFR,
        operacaoNoturna: operacaoBruta.toUpperCase().includes("NOTURNA"),
      };
    })
    .filter(Boolean);

  const unicos = {};
  base.forEach((a) => {
    unicos[a.icao] = a;
  });

  return Object.values(unicos).sort((a, b) => a.icao.localeCompare(b.icao));
}

function executarImportacao() {
  console.log("Lendo CSV oficial da ANAC...");

  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV não encontrado:", CSV_PATH);
    return;
  }

  const csv = fs.readFileSync(CSV_PATH, "utf-8");
  const base = converterParaBase(csv);

  if (!base.length) {
    console.error("Nenhum aeródromo encontrado.");
    return;
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(base, null, 2), "utf-8");

  console.log(`Base gerada com sucesso: ${base.length} aeródromos`);
  console.log("Arquivo atualizado:", JSON_PATH);
}

executarImportacao();