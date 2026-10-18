const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const stylesPath = path.join(root, "doc/css/styles.css");
const mainJsPath = path.join(root, "doc/js/main.js");

const BASELINE_STYLES_NORMALIZED_HASH = "3023460e354755f92b939609a1fc432d29a8c1cc227ad18225a26844a5404270";
const BASELINE_MAIN_JS_NORMALIZED_HASH = "a4bd7dfa7427a5f5f4845897dabdc0d20e574671b2414f90617c63df07810921";

function normalizedFileHash(filePath) {
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(content).digest("hex");
}

test("Hashes de doc/css/styles.css e doc/js/main.js preservados contra o baseline de forma portável", () => {
  const stylesHash = normalizedFileHash(stylesPath).toLowerCase();
  const mainJsHash = normalizedFileHash(mainJsPath).toLowerCase();

  assert.equal(stylesHash, BASELINE_STYLES_NORMALIZED_HASH, "doc/css/styles.css não pode ser alterado");
  assert.equal(mainJsHash, BASELINE_MAIN_JS_NORMALIZED_HASH, "doc/js/main.js não pode ser alterado");

  // Verificação direta com git quando disponível no ambiente (falhas de execução são capturadas, asserts ficam fora)
  const { spawnSync } = require("node:child_process");
  const gitStylesResult = spawnSync("git", ["show", "HEAD:doc/css/styles.css"], { encoding: "utf8" });
  const gitMainResult = spawnSync("git", ["show", "HEAD:doc/js/main.js"], { encoding: "utf8" });

  if (gitStylesResult.status === 0 && !gitStylesResult.error && gitMainResult.status === 0 && !gitMainResult.error) {
    const gitStyles = gitStylesResult.stdout.replace(/\r\n/g, "\n");
    const localStyles = fs.readFileSync(stylesPath, "utf8").replace(/\r\n/g, "\n");
    assert.equal(localStyles, gitStyles, "doc/css/styles.css deve ser idêntico ao HEAD do git");

    const gitMain = gitMainResult.stdout.replace(/\r\n/g, "\n");
    const localMain = fs.readFileSync(mainJsPath, "utf8").replace(/\r\n/g, "\n");
    assert.equal(localMain, gitMain, "doc/js/main.js deve ser idêntico ao HEAD do git");
  }
});

test("Simulador da Etapa 01 estritamente protegido sem classes portal-ui", () => {
  const html = fs.readFileSync(path.join(root, "doc/etapa-01-logica.html"), "utf8");

  // Localiza a seção do simulador
  const simStart = html.indexOf('id="simulador"');
  assert.ok(simStart !== -1, "Seção #simulador deve existir");

  const nextSectionTag = '<section class="section portal-ui" id="regras">';
  const nextSectionIndex = html.indexOf(nextSectionTag);
  assert.ok(nextSectionIndex !== -1, "Seção seguinte #regras deve existir");
  const simSection = html.slice(simStart, nextSectionIndex);
  assert.ok(!simSection.includes("portal-ui"), "A seção #simulador não deve conter a classe portal-ui");
  assert.ok(simSection.includes('class="sim-shell'), "DOM da casca do simulador deve estar preservado");
  assert.ok(simSection.includes('data-simulator'), "Atributo data-simulator deve estar preservado");
  assert.ok(simSection.includes('class="classic-scada"'), "Sinótico SCADA clássico deve estar preservado");
  assert.ok(simSection.includes('data-auto-controller'), "Controlador automático do simulador deve estar preservado");
});

test("Todas as cinco páginas do portal contêm navegação íntegra e recursos essenciais", () => {
  const pages = [
    "index.html",
    "doc/etapa-01-logica.html",
    "doc/etapa-02-grafos.html",
    "doc/planta-envasadora.html",
    "doc/diretrizes-github.html"
  ];

  for (const page of pages) {
    const fullPath = path.join(root, page);
    assert.ok(fs.existsSync(fullPath), `Página ${page} deve existir`);
    const content = fs.readFileSync(fullPath, "utf8");

    // Verifica links de navegação essenciais
    assert.ok(content.includes("index.html"), `${page} deve referenciar index.html`);
    assert.ok(content.includes("etapa-01-logica.html"), `${page} deve referenciar Etapa 01`);
    assert.ok(content.includes("etapa-02-grafos.html"), `${page} deve referenciar Etapa 02`);
    assert.ok(content.includes("planta-envasadora.html"), `${page} deve referenciar Planta`);
    assert.ok(content.includes("diretrizes-github.html"), `${page} deve referenciar Diretrizes`);
  }
});

test("Páginas editoriais contêm diagramas SVG acessíveis com legendas", () => {
  const planta = fs.readFileSync(path.join(root, "doc/planta-envasadora.html"), "utf8");
  assert.ok(planta.includes("portal-figure"), "Planta deve possuir figura SVG portal-figure");
  assert.ok(planta.includes("<figcaption>"), "Planta deve possuir figcaption");

  const diretrizes = fs.readFileSync(path.join(root, "doc/diretrizes-github.html"), "utf8");
  assert.ok(diretrizes.includes("portal-figure"), "Diretrizes deve possuir figura SVG portal-figure");
  assert.ok(diretrizes.includes("<figcaption>"), "Diretrizes deve possuir figcaption");

  const etapa01 = fs.readFileSync(path.join(root, "doc/etapa-01-logica.html"), "utf8");
  assert.ok(etapa01.includes("portal-figure"), "Etapa 01 deve possuir figura SVG portal-figure");
  assert.ok(etapa01.includes("<figcaption>"), "Etapa 01 deve possuir figcaption");
});

test("Todas as páginas que carregam doc/css/portal.css possuem URL versionada ligada ao SHA-256", () => {
  const portalCssPath = path.join(root, "doc/css/portal.css");
  const portalCss = fs.readFileSync(portalCssPath, "utf8").replace(/\r\n/g, "\n");
  const expectedHash = crypto.createHash("sha256").update(portalCss).digest("hex");

  const pages = [
    { file: "index.html", regex: /href="doc\/css\/portal\.css\?v=([a-f0-9]+)"/ },
    { file: "doc/etapa-01-logica.html", regex: /href="css\/portal\.css\?v=([a-f0-9]+)"/ },
    { file: "doc/etapa-02-grafos.html", regex: /href="css\/portal\.css\?v=([a-f0-9]+)"/ },
    { file: "doc/planta-envasadora.html", regex: /href="css\/portal\.css\?v=([a-f0-9]+)"/ },
    { file: "doc/diretrizes-github.html", regex: /href="css\/portal\.css\?v=([a-f0-9]+)"/ }
  ];

  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page.file), "utf8");
    const match = html.match(page.regex);
    assert.ok(match, `Página ${page.file} deve conter link para portal.css com ?v=<hash>`);
    assert.equal(match[1], expectedHash, `Hash em ${page.file} deve bater exatamente com SHA-256 de doc/css/portal.css`);
  }
});
