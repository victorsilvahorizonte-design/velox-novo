import { AERODROMOS_BRASIL } from "../data/aerodromosBrasil";

export function buscarAerodromoPorICAO(icao) {
  if (!icao) return null;

  const codigo = String(icao)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  if (codigo.length !== 4) return null;

  return AERODROMOS_BRASIL[codigo] || null;
}

export function existeAerodromoICAO(icao) {
  return Boolean(buscarAerodromoPorICAO(icao));
}

export function listarAerodromosBrasil() {
  return Object.values(AERODROMOS_BRASIL);
}