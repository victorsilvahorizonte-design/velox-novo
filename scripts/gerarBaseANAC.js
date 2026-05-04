import fs from "fs";
import path from "path";

const DESTINO = path.resolve("public/data/aerodromosCompletos.json");

// Página oficial ANAC. Primeiro vamos buscar a página, depois extrair o link CSV.
const PAGINA_ANAC =
  "https://www.gov.br/anac/pt-br/assuntos/regulados/aeroportos-e-aerodromos/cadastro-publico/cadastro-de-aerodromos-de-uso-publico";

function lerBaseAtual() {
  try {
    if (!fs.existsSync(DESTINO)) return [];
    const texto = fs.readFileSync(DESTINO, "utf-8");
    const dados = JSON.parse(texto);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarBase(base) {
  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, JSON.stringify(base, null, 2), "utf-8");
}

function limparTexto(v) {
  return String(v || "").trim();
}

function normalizarICAO(v) {
  return limparTexto(v).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function baseValida(base) {
  return Array.isArray(base) && base.length > 0 && base.some((a) => a.icao);
}

function separarCSV(texto) {
  const linhas = texto.split(/\r?\n/).filter(Boolean);
  const separador = linhas[0]?.includes(";") ? ";" : ",";
  const cabecalho = linhas[0].split(separador).map(limparTexto);

  return linhas.slice(1).map((linha) => {
    const colunas = linha.split(separador);
    const obj = {};
    cabecalho.forEach((campo, i) => {
      obj[campo] = limparTexto(colunas[i]);
    });
    return obj;
  });
}

function pegarCampo(obj, nomes) {
  for (const nome of nomes) {
    const achou = Object.keys(obj).find(
      (k) => k.toLowerCase() === nome.toLowerCase()
    );
    if (achou) return obj[achou];
  }
  return "";
}

function extrairLinkCSV(html) {
  const match = html.match(/href="([^"]+\.csv[^"]*)"/i);
  if (!match) return null;

  const link = match[1];

  if (link.startsWith("http")) return link;
  if (link.startsWith("/")) return `https://www.gov.br${link}`;

  return new URL(link, PAGINA_ANAC).href;
}

async function baixarCSVAnac() {
  console.log("Acessando página oficial ANAC...");

  const pagina = await fetch(PAGINA_ANAC);
  const html = await pagina.text();

  const linkCSV = extrairLinkCSV(html);

  if (!linkCSV) {
    throw new Error("Não foi encontrado link CSV na página da ANAC.");
  }

  console.log("CSV encontrado:", linkCSV);

  const respostaCSV = await fetch(linkCSV);

  if (!respostaCSV.ok) {
    throw new Error(`Erro ao baixar CSV: ${respostaCSV.status}`);
  }

  return await respostaCSV.text();
}

function converterParaBase(csv) {
  const linhas = separarCSV(csv);

  const base = linhas
    .map((a) => {
      const icao = normalizarICAO(
        pegarCampo(a, [
          "Código OACI",
          "Codigo OACI",
          "OACI",
          "ICAO",
          "CÓDIGO OACI",
          "Código ICAO",
          "Codigo ICAO"
        ])
      );

      if (!icao || icao.length !== 4) return null;

      return {
        icao,
        nome:
          pegarCampo(a, ["Nome", "Nome do Aeródromo", "Aeródromo", "AERÓDROMO"]) ||
          "Aeródromo não informado",
        cidade:
          pegarCampo(a, ["Município", "Municipio", "Cidade", "MUNICÍPIO"]) || "",
        uf: pegarCampo(a, ["UF", "Estado"]) || "",
        uso: "Público",

        passageirosAno: 0,
        comprimentoPista: 0,
        larguraPista: 0,
        envergaduraMaxima: 0,
        tipoAeronave: "médias",
        tipoOperacaoAVSEC: [],
        operacao: "VFR",
        pavimentado: true,
        taxiway: false,
        patio: true,
        sistemaEletrico: false,
        operacaoNoturna: false
      };
    })
    .filter(Boolean);

  const unicos = {};
  base.forEach((a) => {
    unicos[a.icao] = a;
  });

  return Object.values(unicos).sort((a, b) => a.icao.localeCompare(b.icao));
}

async function gerarBaseANAC() {
  const baseAtual = lerBaseAtual();

  try {
    const csv = await baixarCSVAnac();
    const baseNova = converterParaBase(csv);

    if (!baseValida(baseNova)) {
      throw new Error("Base ANAC veio vazia ou inválida.");
    }

    salvarBase(baseNova);
    console.log(`Base ANAC oficial salva: ${baseNova.length} aeródromos.`);
  } catch (erro) {
    console.error("Falha ao gerar base oficial:", erro.message);

    if (baseValida(baseAtual)) {
      salvarBase(baseAtual);
      console.log(`Base atual preservada: ${baseAtual.length} aeródromo(s).`);
    } else {
      console.log("Base atual também está vazia. Nada foi sobrescrito.");
    }
  }
}

gerarBaseANAC();