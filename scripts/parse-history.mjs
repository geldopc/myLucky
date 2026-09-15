import { readFileSync, writeFileSync } from "node:fs";

const [, , input = process.env.HOME + "/Downloads/lotofacil-download-resultados.txt"] = process.argv;
const OUT = "public/data/history.json";
const LINE = /Concurso:\s*(\d+)\s*\|\s*Data:\s*(\d{2})\/(\d{2})\/(\d{4})\s*\|\s*N[úu]meros:\s*(.+)/;

const rows = [];
for (const line of readFileSync(input, "utf8").split("\n")) {
  const m = LINE.exec(line);
  if (!m) continue;
  const numbers = m[5].trim().split(/\s+/).map(Number);
  if (numbers.length !== 15 || new Set(numbers).size !== 15) {
    throw new Error(`Concurso ${m[1]}: esperava 15 dezenas únicas, recebeu ${numbers.length}`);
  }
  rows.push({ contest: Number(m[1]), date: `${m[4]}-${m[3]}-${m[2]}`, numbers: numbers.sort((a, b) => a - b) });
}

rows.sort((a, b) => a.contest - b.contest);
for (let i = 1; i < rows.length; i++) {
  if (rows[i].contest !== rows[i - 1].contest + 1) {
    throw new Error(`Buraco na sequência entre ${rows[i - 1].contest} e ${rows[i].contest}`);
  }
}

writeFileSync(
  OUT,
  JSON.stringify({
    first: rows[0].contest,
    last: rows.at(-1).contest,
    updatedAt: new Date().toISOString(),
    dates: rows.map((r) => r.date),
    draws: rows.map((r) => r.numbers),
  })
);
console.log(`${OUT}: ${rows.length} concursos (${rows[0].contest}..${rows.at(-1).contest}), ${rows[0].date} a ${rows.at(-1).date}`);
