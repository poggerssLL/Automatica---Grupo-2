const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const etapa03HtmlPath = path.join(root, "doc/etapa-03-arvores.html");
const etapa03CssPath = path.join(root, "doc/css/etapa-03.css");
const portalCssPath = path.join(root, "doc/css/portal.css");
const indexHtmlPath = path.join(root, "index.html");
const surfacePath = path.join(root, ".impeccable/surfaces/etapa-03-arvores.md");

function sha256LF(filePath) {
  const normalized = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

test("Arquivos principais da Etapa 03 e superfície Impeccable existem", () => {
  assert.ok(fs.existsSync(etapa03HtmlPath), "doc/etapa-03-arvores.html deve existir");
  assert.ok(fs.existsSync(etapa03CssPath), "doc/css/etapa-03.css deve existir");
  assert.ok(fs.existsSync(surfacePath), ".impeccable/surfaces/etapa-03-arvores.md deve existir");
});

test("doc/etapa-03-arvores.html versiona css/etapa-03.css e css/portal.css com SHA-256 exato (LF)", () => {
  const html = fs.readFileSync(etapa03HtmlPath, "utf8");
  const expectedE03Hash = sha256LF(etapa03CssPath);
  const expectedPortalHash = sha256LF(portalCssPath);

  const e03Match = html.match(/href="css\/etapa-03\.css\?v=([a-f0-9]{64})"/);
  assert.ok(e03Match, "doc/etapa-03-arvores.html deve carregar css/etapa-03.css?v=<sha256>");
  assert.equal(e03Match[1], expectedE03Hash, "Hash SHA-256 de css/etapa-03.css deve bater exatamente");

  const portalMatch = html.match(/href="css\/portal\.css\?v=([a-f0-9]{64})"/);
  assert.ok(portalMatch, "doc/etapa-03-arvores.html deve carregar css/portal.css?v=<sha256>");
  assert.equal(portalMatch[1], expectedPortalHash, "Hash SHA-256 de css/portal.css deve bater exatamente");

  assert.ok(html.indexOf("css/styles.css") < html.indexOf("css/vendor/daisyui-5.7.50-portal.css"), "styles.css deve carregar antes de daisyUI");
  assert.ok(html.indexOf("css/vendor/daisyui-5.7.50-portal.css") < html.indexOf("css/portal.css"), "daisyUI deve carregar antes de portal.css");
  assert.ok(html.indexOf("css/portal.css") < html.indexOf("css/etapa-03.css"), "portal.css deve carregar antes de etapa-03.css");
});

test("doc/css/etapa-03.css é 100% escopado em @scope (.etapa03-page) com suporte claro/escuro e redução de movimento", () => {
  const css = fs.readFileSync(etapa03CssPath, "utf8");
  assert.ok(css.includes("@scope (.etapa03-page)"), "CSS deve declarar @scope (.etapa03-page)");
  assert.ok(css.includes('[data-theme="dark"] :scope'), "CSS deve suportar tema escuro");
  assert.ok(css.includes("prefers-reduced-motion"), "CSS deve respeitar prefers-reduced-motion");
  assert.ok(css.includes("#f8f9f7") && css.includes("#142534") && css.includes("#c62f24"), "CSS deve preservar paleta clara do DESIGN.md");
  assert.ok(css.includes("#101a21") && css.includes("#f1f4f2") && css.includes("#ff7666"), "CSS deve preservar paleta escura do DESIGN.md");
});

test("doc/etapa-03-arvores.html cumpre integralmente o contrato DOM (6 slides, 9 arquivos, 4 modos e palco SVG)", () => {
  const html = fs.readFileSync(etapa03HtmlPath, "utf8");

  assert.ok(html.includes('<body class="portal-ui etapa03-page">'), "Body deve conter portal-ui e etapa03-page");
  assert.ok(html.includes('src="js/main.js"'), "Deve carregar js/main.js");
  assert.ok(html.includes('src="js/etapa-03-simulator.js"'), "Deve carregar js/etapa-03-simulator.js");

  // 3 abas
  for (const tab of ["apresentacao", "arquivos", "simulador"]) {
    assert.ok(html.includes(`data-e03-tab="${tab}"`), `Aba ${tab} deve existir`);
    assert.ok(html.includes(`data-e03-panel="${tab}"`), `Painel ${tab} deve existir`);
  }
  assert.ok(html.includes('id="simulador"'), "Painel do simulador deve possuir id=\"simulador\"");

  // 6 slides + figuras SVG + controles do deck
  const slides = html.match(/<article\b[^>]*\bdata-e03-slide(?=\s|>)/g) || [];
  assert.equal(slides.length, 6, "Apresentação deve conter exatamente 6 slides");
  const figures = html.match(/class="e03-lesson-figure"/g) || [];
  assert.equal(figures.length, 6, "Cada um dos 6 slides deve conter um diagrama e03-lesson-figure");
  for (let i = 0; i < 6; i++) {
    assert.ok(html.includes(`data-e03-go-slide="${i}"`), `Botão de índice do slide ${i} deve existir`);
  }
  for (const attr of ["data-etapa03-deck", "data-e03-slide-count", "data-e03-slide-title", "data-e03-prev", "data-e03-next", "data-e03-progress"]) {
    assert.ok(html.includes(attr), `Controle do deck ${attr} deve existir`);
  }

  // 9 arquivos no trilho e nos painéis
  const fileIds = ["readme", "19-md", "19-ipynb", "20-md", "20-ipynb", "21-md", "21-ipynb", "22-md", "22-ipynb"];
  assert.ok(html.includes("data-e03-file-rail"), "Trilho data-e03-file-rail deve existir");
  for (const id of fileIds) {
    assert.ok(html.includes(`data-e03-file="${id}"`), `Botão de arquivo ${id} deve existir`);
    assert.ok(html.includes(`data-e03-file-panel="${id}"`), `Painel de arquivo ${id} deve existir`);
  }

  // 4 modos do simulador e ganchos de contrato
  for (const mode of ["mst", "huffman", "binary", "rrt"]) {
    assert.ok(html.includes(`data-e03-mode="${mode}"`), `Botão de modo ${mode} deve existir`);
  }
  for (const hook of [
    "data-etapa03-simulator",
    "data-e03-mode-bar",
    "data-e03-mode-code",
    "data-e03-mode-title",
    "data-e03-mode-desc",
    "data-e03-mode-limit",
    "data-e03-svg",
    "data-e03-controls",
    "data-e03-run",
    "data-e03-reset",
    "data-e03-metrics",
    "data-e03-output",
    "data-e03-log"
  ]) {
    assert.ok(html.includes(hook), `Gancho do simulador ${hook} deve existir`);
  }
  assert.ok(html.includes('viewBox="0 0 960 540"'), "Palco SVG deve declarar viewBox=\"0 0 960 540\"");
});

test("index.html ativa Etapa 03 preservando portal.css e links existentes", () => {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  const expectedPortalHash = sha256LF(portalCssPath);

  assert.ok(indexHtml.includes(`href="doc/css/portal.css?v=${expectedPortalHash}"`), "index.html deve manter hash intacto de portal.css");
  assert.ok(indexHtml.includes('<a href="doc/etapa-03-arvores.html">Etapa 03</a>'), "Navegação principal deve incluir Etapa 03");
  assert.ok(indexHtml.includes('<a class="atlas-stage atlas-stage-live" href="doc/etapa-03-arvores.html">'), "Card da Etapa 03 deve estar ativo como link");
  assert.ok(indexHtml.includes('href="doc/etapa-03-arvores.html#simulador"'), "Lista de links deve incluir acesso ao simulador da Etapa 03");
  assert.ok(indexHtml.includes("Aulas 19–22"), "Card da Etapa 03 deve indicar Aulas 19–22");
});
