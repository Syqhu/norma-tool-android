const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "mobile-www");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(source, target);
    else fs.copyFileSync(source, target);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

copyDir(path.join(root, "src"), outDir);
copyDir(path.join(root, "assets"), path.join(outDir, "assets"));

const htmlPath = path.join(outDir, "index.html");
const html = fs.readFileSync(htmlPath, "utf8")
  .replaceAll("../assets/", "./assets/");
fs.writeFileSync(htmlPath, html);

console.log(`mobile web assets built: ${outDir}`);
