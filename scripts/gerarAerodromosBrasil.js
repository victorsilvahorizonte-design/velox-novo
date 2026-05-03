import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caminhoAerodromos = path.resolve(__dirname, "../src/imports/aerodromos.csv");
const caminhoMovimentacao = path.resolve(__dirname, "../src/imports/movimentacao.csv");
const caminhoSaida = path.resolve(__dirname, "../src/data/aerodromosBrasil.js");

function detectarSeparador(linha) {
  if (linha.includes(";")) return ";";
  if (linha.includes(",")) return ",";
  return ";";
}

function lerCSV(caminho) {
  if (!fs.existsSync(caminho)) {
    console.error("Arquivo não encontrado:", caminho);
    return [];
  }

  const texto = fs.readFileSync(caminho, "utf-8");

  const linhas = texto
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (linhas.length === 0) {
    console.error("CSV vazio:", caminho);
    return [];
  }

  const separador = detectarSeparador(linhas[0]);
  const cabecalho = linhas[0].split(separador).map((c) => c.trim());

  return linhas.slice(1).map((linha) => {
    const valores = linha.split(separador);
    const obj = {};

    cabecalho.forEach((col, i) => {
      obj[col] = (valores[i] || "").trim();
    });

    return obj;
  });
}

function numero(valor) {
  if (!valor) return 0;
  return Number(
    String(valor)
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  ) || 0;
}

function pegar(obj, nomes) {
  for (const nome of nomes) {
    if (obj[nome] !== undefined && obj[nome] !== "") return obj[nome];
  }
  return "";
}

const aerodromos = lerCSV(caminhoAerodromos);
const movimentacao = lerCSV(caminhoMovimentacao);

const mapaPassageiros = {};

movimentacao.forEach((m) => {
  const icao = String(
    pegar(m, ["ICAO", "CODIGO_ICAO", "CÓDIGO ICAO", "Codigo ICAO", "Código ICAO"])
  )
    .trim()
    .toUpperCase();

  if (!icao || icao.length !== 4) return;

  const passageiros = numero(
    pegar(m, [
      "PASSAGEIROS",
      "PASSAGEIROS_ANO",
      "PASSAGEIROS PAGOS",
      "PASSAGEIROS TOTAIS",
      "PAX",
      "TOTAL_PASSAGEIROS",
    ])
  );

  mapaPassageiros[icao] = (mapaPassageiros[icao] || 0) + passageiros;
});

const resultado = {};

aerodromos.forEach((a) => {
  const icao = String(
    pegar(a, ["ICAO", "CODIGO_ICAO", "CÓDIGO ICAO", "Codigo ICAO", "Código ICAO"])
  )
    .trim()
    .toUpperCase();

  if (!icao || icao.length !== 4) return;

  const uso = pegar(a, ["USO", "TIPO_USO", "Tipo de Uso", "TIPO"]) || "Público";
  const operacao = pegar(a, ["OPERACAO", "OPERAÇÃO", "Tipo Operação", "OPERACAO_DIURNA_NOTURNA"]) || "VFR";

  const comprimentoPista = numero(
    pegar(a, [
      "COMPRIMENTO_PISTA",
      "COMPRIMENTO",
      "Comprimento da pista",
      "PISTA_COMPRIMENTO",
      "DIMENSAO_PISTA",
    ])
  );

  const pavimento = String(
    pegar(a, ["PAVIMENTO", "SUPERFICIE", "SUPERFÍCIE", "REVESTIMENTO"])
  ).toLowerCase();

  const pavimentado =
    pavimento.includes("asf") ||
    pavimento.includes("concreto") ||
    pavimento.includes("pav") ||
    pavimento.includes("betum");

  const passageirosAno = mapaPassageiros[icao] || 0;

  resultado[icao] = {
    icao,
    nome: pegar(a, ["NOME", "NOME_AERODROMO", "Nome", "DENOMINACAO", "DENOMINAÇÃO"]) || "Desconhecido",
    cidade: pegar(a, ["MUNICIPIO", "MUNICÍPIO", "Cidade", "CIDADE"]) || "",
    uf: pegar(a, ["UF", "ESTADO"]) || "",
    uso,
    operacao: String(operacao).toUpperCase().includes("IFR") ? "IFR" : "VFR",
    passageirosAno,
    comprimentoPista,
    envergaduraMaxima: numero(pegar(a, ["ENVERGADURA", "ENVERGADURA_MAXIMA"])) || 36,
    tipoAeronave: comprimentoPista >= 1800 ? "grandes" : comprimentoPista >= 1200 ? "médias" : "pequenas",
    tipoOperacaoAVSEC: passageirosAno > 0 ? ["doméstica", "passageiros"] : [],
    taxiway: true,
    patio: true,
    pavimentado,
    sistemaEletrico: String(operacao).toUpperCase().includes("NOT") || String(operacao).toUpperCase().includes("IFR"),
    operacaoNoturna: String(operacao).toUpperCase().includes("NOT") || String(operacao).toUpperCase().includes("IFR"),
  };
});

const conteudo = `export const AERODROMOS_BRASIL = ${JSON.stringify(resultado, null, 2)};\n`;

fs.writeFileSync(caminhoSaida, conteudo, "utf-8");

console.log(`✅ Base gerada com sucesso: ${Object.keys(resultado).length} aeródromos.`);
console.log("📁 Arquivo atualizado: src/data/aerodromosBrasil.js");