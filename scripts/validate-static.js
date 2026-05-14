const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const screens = Array.from({ length: 20 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  if (number === "01") return path.join(publicDir, "index.html");
  return path.join(publicDir, `tela${number}`, "index.html");
});

const blocks = Array.from({ length: 20 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return path.join(
    publicDir,
    "BLOCOS_UNICOS_PRISMA13",
    `TELA${number}_BLOCO_UNICO.html`,
  );
});

const missing = [...screens, ...blocks].filter((file) => !fs.existsSync(file));

if (missing.length) {
  console.error("Arquivos ausentes:");
  for (const file of missing) console.error(`- ${path.relative(root, file)}`);
  process.exit(1);
}

console.log("PRISMA13 static OK: 20 telas e 20 blocos unicos encontrados.");
