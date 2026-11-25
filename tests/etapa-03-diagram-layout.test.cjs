const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "doc/js/etapa-03-simulator.js"), "utf8");
const css = fs.readFileSync(path.join(root, "doc/css/etapa-03.css"), "utf8");
const modes = ["integrated", "mst", "huffman", "binary", "rrt", "rstp", "petri", "bt", "kdtree", "dtree"];

// Executa a camada DOM real sem navegador. Verifica geometria SVG e eventos;
// não substitui inspeção de pixels, CSS computado ou Fullscreen API real.
class Element {
  constructor(tag = "div", attrs = {}) {
    this.tag = tag;
    this.attrs = { ...attrs };
    this.children = [];
    this.listeners = {};
    this.dataset = {};
    this.style = {};
    this.classList = { toggle() {} };
    this.textContent = "";
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k]; }
  append(el) { this.children.push(el); }
  replaceChildren() { this.children = []; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  fire(type = "click") { this.listeners[type]?.({ preventDefault() {} }); }
  focus() {}
}

function descendants(el) { return el.children.flatMap(c => [c, ...descendants(c)]); }

function simulator() {
  const svg = new Element("svg");
  const controls = new Element();
  const buttons = modes.map(mode => {
    const b = new Element("button");
    b.dataset.e03Mode = mode;
    return b;
  });
  const box = {
    querySelector: sel => ({ "[data-e03-svg]": svg, "[data-e03-controls]": controls })[sel] || null,
    querySelectorAll: sel => sel === "[data-e03-mode]" ? buttons : []
  };
  const document = {
    readyState: "complete",
    querySelector: sel => sel === "[data-etapa03-simulator]" ? box : null,
    createElement: tag => new Element(tag),
    createElementNS: (_ns, tag) => new Element(tag)
  };
  vm.runInNewContext(source, { document, console });
  return {
    svg, controls,
    mode: id => buttons[modes.indexOf(id)].fire(),
    control: attr => descendants(controls).find(el => attr in el.attrs)
  };
}

function rects(svg, predicate = () => true) {
  return descendants(svg).filter(el => el.tag === "rect" && predicate(el)).map(el => ({
    x: +el.attrs.x, y: +el.attrs.y, w: +el.attrs.width, h: +el.attrs.height
  }));
}

function assertSeparated(rectangles) {
  for (let i = 0; i < rectangles.length; i++) {
    for (const b of rectangles.slice(i + 1)) {
      const a = rectangles[i];
      assert.ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y,
        `Sobreposição: ${JSON.stringify(a)} / ${JSON.stringify(b)}`);
    }
  }
}

test("Todos os modos geram SVG e mantêm dimensões intrínsecas iguais ao viewBox", () => {
  const ui = simulator();
  for (const mode of modes) {
    ui.mode(mode);
    const [, , w, h] = ui.svg.attrs.viewBox.split(" ").map(Number);
    assert.equal(+ui.svg.attrs.width, w, mode);
    assert.equal(+ui.svg.attrs.height, h, mode);
    assert.equal(ui.svg.attrs["data-e03-view"], mode);
    assert.ok(ui.svg.children.length > 1, mode);
  }
});

test("Behavior Tree: 12 nós sem sobreposição, com nomes completos em linhas", () => {
  const ui = simulator();
  ui.mode("bt");
  const nodes = rects(ui.svg);
  assert.equal(nodes.length, 12);
  assertSeparated(nodes);
  for (const node of nodes) assert.ok(node.x >= 0 && node.x + node.w <= 960);
  const wrapped = descendants(ui.svg).filter(el => el.tag === "text" && el.children.some(c => c.tag === "tspan"));
  assert.equal(wrapped.length, 12);
  for (const el of wrapped) {
    const title = el.children.find(c => c.tag === "title").textContent;
    const lines = el.children.filter(c => c.tag === "tspan").map(c => c.textContent);
    assert.equal(lines.join("").replace(/\s/g, ""), title.replace(/\s/g, ""));
    assert.ok(lines.every(line => line.length <= 18));
  }
});

test("CART e entropia: nós e matriz separados em todas as profundidades selecionáveis", () => {
  const ui = simulator();
  ui.mode("dtree");
  for (const criterion of ["gini", "entropy"]) {
    const input = ui.control("data-e03-dt-criterion");
    input.value = criterion;
    input.fire("change");
    const depthInput = descendants(ui.controls).find(el => el.tag === "input" && el.attrs.max === "5");
    assert.ok(depthInput, "Controle de profundidade deve existir");
    for (let depth = 1; depth <= 5; depth++) {
      depthInput.value = depth;
      depthInput.fire("change");
      const boxes = rects(ui.svg, el => +el.attrs.width === 156 || +el.attrs.width === 270);
      assertSeparated(boxes);
      const [, , width, height] = ui.svg.attrs.viewBox.split(" ").map(Number);
      assert.equal(ui.svg.style.minWidth, `${width}px`);
      for (const b of boxes) assert.ok(b.x >= 0 && b.y >= 0 && b.x + b.w <= width && b.y + b.h <= height);
    }
  }
  ui.mode("mst");
  assert.equal(ui.svg.style.minWidth, "", "Largura da árvore não deve vazar para outro modo");
});

test("Todos os tokens de cor utilizados pelo renderizador estão definidos no CSS", () => {
  const defined = new Set([...css.matchAll(/(--e03-[\w-]+)\s*:/g)].map(m => m[1]));
  for (const [, name] of source.matchAll(/var\((--e03-[\w-]+)/g)) {
    assert.ok(defined.has(name), `Token ausente: ${name}`);
  }
});

test("Cores de texto sobre estados têm contraste mínimo 4,5:1 nos dois temas", () => {
  const tokenSets = [...css.matchAll(/--e03-paper:[\s\S]*?--e03-stage-bg:[^;]+;/g)];
  assert.equal(tokenSets.length, 2);
  function luminance(hex) {
    const rgb = hex.match(/\w\w/g).map(c => parseInt(c, 16) / 255)
      .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  }
  for (const set of tokenSets) {
    const tokens = Object.fromEntries([...set[0].matchAll(/--e03-([\w-]+):\s*(#[\da-f]{6})/g)].map(m => [m[1], m[2]]));
    for (const state of ["accent", "ok", "warn", "danger"]) {
      const a = luminance(tokens[state]);
      const b = luminance(tokens[`${state}-ink`]);
      assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${state}: ${tokens[state]}`);
    }
  }
});
