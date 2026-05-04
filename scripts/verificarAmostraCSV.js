import fs from "fs";
import path from "path";

const CSV_PATH = path.resolve("public/data/anac-aerodromos-publicos.csv");

const texto = fs.readFileSync(CSV_PATH, "utf-8");
const linhas = texto.split(/\r?\n/).filter(Boolean);

console.log("Primeira linha:");
console.log(linhas[0]);

console.log("\nSegunda linha:");
console.log(linhas[1]);

console.log("\nTerceira linha:");
console.log(linhas[2]);

console.log("\nQuarta linha:");
console.log(linhas[3]);