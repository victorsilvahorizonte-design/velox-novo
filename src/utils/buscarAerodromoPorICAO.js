import { AERODROMOS_BRASIL } from "../data/aerodromosBrasil";

function normalizarICAO(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function buscarAerodromoPorICAO(icao) {
  const codigo = normalizarICAO(icao);

  if (codigo.length !== 4) return null;

  // 🔹 1. Busca direta (mais rápida)
  if (AERODROMOS_BRASIL[codigo]) {
    return AERODROMOS_BRASIL[codigo];
  }

  // 🔹 2. Fallback (caso estrutura não esteja indexada)
  const lista = Object.values(AERODROMOS_BRASIL);

  const encontrado = lista.find((a) => {
    const valor =
      a.icao ||
      a.codigoIcao ||
      a.CIAD ||
      "";

    return normalizarICAO(valor) === codigo;
  });

  return encontrado || null;
}

export function existeAerodromoICAO(icao) {
  return Boolean(buscarAerodromoPorICAO(icao));
}

export function listarAerodromosBrasil() {
  return Object.values(AERODROMOS_BRASIL);
}