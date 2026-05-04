import fs from "fs";
import path from "path";

const CSV_PATH = path.resolve("public/data/anac-aerodromos-publicos.csv");

const texto = fs.readFileSync(CSV_PATH, "utf-8");

const primeiraLinha = texto.split(/\r?\n/)[0];

const separador = primeiraLinha.includes(";") ? ";" : ",";

const colunas = primeiraLinha.split(separador).map((c) => c.trim());

console.log("Separador detectado:", separador);
console.log("Colunas encontradas:");
console.log(colunas);