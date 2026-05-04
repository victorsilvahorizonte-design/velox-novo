import { buscarAerodromoPorICAO } from "../services/anacService";
import { CORRECOES_AERODROMOS } from "./correcoesAerodromos";

function limparTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extrairNumero(valor) {
  const texto = String(valor || "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  return Number(texto || 0);
}

/* =========================
   RBAC 153 — REGRA MASTER
========================= */
function classificarRBAC153(passageirosAno, usoPublico, possuiRegular) {
  if (!usoPublico) return "Não classificado";

  if (passageirosAno && passageirosAno > 0) {
    if (passageirosAno < 200000) {
      return possuiRegular ? "Classe I-B" : "Classe I";
    }
    if (passageirosAno < 1000000) return "Classe II";
    if (passageirosAno < 5000000) return "Classe III";
    return "Classe IV";
  }

  // 🔥 inferência inteligente
  return possuiRegular ? "Classe I-B" : "Classe I";
}

/* =========================
   RBAC 154 — REGRA MASTER
========================= */
function classificarRBAC154(pista, operacao, pavimento) {
  let numero = 1;

  if (pista >= 1800) numero = 4;
  else if (pista >= 1200) numero = 3;
  else if (pista >= 800) numero = 2;

  let letra = "B";

  if (numero >= 3 && (operacao === "IFR" || pavimento)) {
    letra = "C";
  }

  return {
    codigoNumero: numero,
    codigoLetra: letra,
    codigo: `${numero}${letra}`,
  };
}

/* =========================
   NORMALIZAÇÃO INTELIGENTE
========================= */
export function obterAerodromoInteligente(baseANAC, icao) {
  const codigo = limparTexto(icao);

  const bruto = buscarAerodromoPorICAO(baseANAC, codigo);

  if (!bruto) return null;

  const texto = JSON.stringify(bruto).toUpperCase();

  const nome =
    bruto.nome ||
    bruto.Nome ||
    bruto.aerodromo ||
    bruto.Aeródromo ||
    "Não informado";

  const municipio = bruto.municipio || bruto.Município || "";
  const uf = bruto.uf || bruto.UF || "";

  const pista =
    extrairNumero(texto.match(/\d{4}/)?.[0]) || 0;

  const passageiros =
    extrairNumero(texto.match(/PAX.*?(\d+)/)?.[1]) || 0;

  const usoPublico = !texto.includes("PRIV");

  const tipoOperacao = texto.includes("IFR") ? "IFR" : "VFR";

  const operacaoNoturna =
    texto.includes("NOTUR") ||
    texto.includes("BALIZ") ||
    texto.includes("LUZ");

  const pavimentado =
    texto.includes("ASF") ||
    texto.includes("CONC") ||
    texto.includes("PAV");

  const possuiRegular =
    texto.includes("REGULAR") ||
    texto.includes("LINHA") ||
    texto.includes("PASSAGEIROS");

  let resultado = {
    icao: codigo,
    nomeAerodromo: nome,
    municipio,
    uf,

    passageirosAno: passageiros,
    usoPublico,

    tipoOperacao,
    operacaoNoturna,
    pavimentado,

    comprimentoPista: pista,

    ...classificarRBAC154(pista, tipoOperacao, pavimentado),
  };

  resultado.classeRBAC153 = classificarRBAC153(
    passageiros,
    usoPublico,
    possuiRegular
  );

  /* =========================
     CORREÇÃO MANUAL (PRECISA)
  ========================= */
  const correcao = CORRECOES_AERODROMOS[codigo];

  if (correcao) {
    resultado = {
      ...resultado,
      ...correcao,
    };
  }

  return resultado;
}