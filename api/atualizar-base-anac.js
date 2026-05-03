import base from "../src/data/aerodromosCompletos.json";

export default function handler(req, res) {
  try {
    res.status(200).json({
      sucesso: true,
      modo: "vercel-api",
      atualizadoEm: new Date().toISOString(),
      total: Object.keys(base).length,
      aerodromos: base,
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: error.message,
    });
  }
}