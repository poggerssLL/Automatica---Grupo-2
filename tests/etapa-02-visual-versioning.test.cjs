const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const htmlPath = path.resolve(__dirname, "../doc/etapa-02-grafos.html");
const cssPath = path.resolve(__dirname, "../doc/css/etapa-02.css");

test("doc/etapa-02-grafos.html referencia css/etapa-02.css com URL versionada ligada ao SHA-256", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8").replace(/\r\n/g, "\n");
  const expectedHash = crypto.createHash("sha256").update(css).digest("hex");

  const match = html.match(/href="css\/etapa-02\.css\?v=([a-f0-9]+)"/);
  assert.ok(match, "Tag <link> deve conter href com css/etapa-02.css?v=<hash>");
  assert.equal(match[1], expectedHash, "Parâmetro ?v deve corresponder ao hash SHA-256 do CSS");
});

test("doc/css/etapa-02.css contém regras escopadas para layout e SVG da apresentação", () => {
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes(".e02-lesson-layout"), "CSS deve conter .e02-lesson-layout");
  assert.ok(css.includes(".e02-lesson-figure"), "CSS deve conter .e02-lesson-figure");
  assert.ok(css.includes(".e02-lesson-figure rect"), "CSS deve conter regra para rect dentro de .e02-lesson-figure");
  assert.ok(css.includes(".e02-lesson-figure text"), "CSS deve conter regra para text dentro de .e02-lesson-figure");
  assert.ok(css.includes(".e02-lesson-edge"), "CSS deve conter .e02-lesson-edge");
  assert.ok(css.includes("var(--paper)"), "CSS deve referenciar token --paper");
  assert.ok(css.includes("var(--blue-deep)"), "CSS deve referenciar token --blue-deep");
  assert.ok(css.includes("var(--ink)"), "CSS deve referenciar token --ink");
  assert.ok(css.includes("@media(max-width:900px)"), "CSS deve conter breakpoint responsivo de 900px");
});

test("doc/etapa-02-grafos.html preserva 10 slides, figuras com SVG e acessibilidade", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  const slideMatches = html.match(/<article class="e02-slide/g);
  assert.equal(slideMatches ? slideMatches.length : 0, 10, "Devem existir 10 slides");

  const layoutMatches = html.match(/class="e02-lesson-layout"/g);
  assert.equal(layoutMatches ? layoutMatches.length : 0, 10, "Cada slide deve possuir .e02-lesson-layout");

  const figureMatches = html.match(/class="e02-lesson-figure"/g);
  assert.equal(figureMatches ? figureMatches.length : 0, 10, "Cada slide deve possuir .e02-lesson-figure");

  const svgMatches = html.match(/<svg viewBox="0 0 560 300" role="img"/g);
  assert.equal(svgMatches ? svgMatches.length : 0, 10, "Cada figura deve possuir SVG acessível com role=img");

  const figcaptionMatches = html.match(/<figcaption>/g);
  assert.equal(figcaptionMatches ? figcaptionMatches.length : 0, 10, "Cada figura deve possuir figcaption");
});
