const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

test("Etapa 3: todos os diagramas cabem no palco em desktop e celular", t => {
  const browser = [process.env.BROWSER_PATH, process.env.EDGE_PATH, process.env.CHROME_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"]
    .find(p => p && fs.existsSync(p));
  if (!browser) return t.skip("Navegador Chromium indisponível");
  const root = path.resolve(__dirname, "..");
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aqua-e03-responsive-"));
  try {
    const html = fs.readFileSync(path.join(root, "doc/etapa-03-arvores.html"), "utf8")
      .replace("<head>", `<head><base href="${pathToFileURL(path.join(root, "doc")).href}/">`)
      .replace("</body>", `<script>
      window.addEventListener('load', () => {
        document.querySelector('[data-e03-tab="simulador"]').click();
        const measurements = [];
        for (const button of document.querySelectorAll('[data-e03-mode]')) {
          button.click();
          const svg = document.querySelector('[data-e03-svg]');
          const stage = document.querySelector('.e03-stage-wrap');
          const rect = svg.getBoundingClientRect();
          measurements.push({ mode: button.dataset.e03Mode, width: rect.width, height: rect.height,
            client: stage.clientWidth, scroll: stage.scrollWidth,
            intrinsic: svg.getAttribute('viewBox').split(' ').map(Number).slice(2) });
        }
        const report = document.createElement('pre');
        report.id = 'e03-viewport-result';
        report.textContent = JSON.stringify(measurements);
        document.body.append(report);
      });
      </script></body>`);
    const file = path.join(temp, "responsive.html");
    for (const size of ["1440,900", "1024,768", "390,844"]) {
      // Alguns Chromium impõem uma largura mínima à janela headless.
      // Limita também o documento para exercitar de fato o espaço solicitado.
      const requestedWidth = Number(size.split(",")[0]);
      fs.writeFileSync(file, html.replace("</head>",
        `<style>body { width: ${requestedWidth}px; max-width: 100%; }</style></head>`));
      const dom = execFileSync(browser, ["--headless=new", "--allow-file-access-from-files",
        `--window-size=${size}`, "--dump-dom", `${pathToFileURL(file).href}#simulador`],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 30000, maxBuffer: 5e6 });
      const match = dom.match(/<pre id="e03-viewport-result">([^<]+)<\/pre>/);
      assert.ok(match, `Medições devem ser produzidas em ${size}`);
      const measurements = JSON.parse(match[1]);
      assert.equal(measurements.length, 10);
      for (const m of measurements) {
        assert.ok(m.width > 0 && m.height > 0, `${size}: ${m.mode} deve estar visível`);
        assert.ok(m.client <= requestedWidth, `${size}: palco deve respeitar a largura solicitada`);
        assert.ok(m.width <= m.client + 1, `${size}: ${m.mode} excede a largura do palco`);
        assert.ok(m.scroll <= m.client + 1, `${size}: ${m.mode} exige rolagem horizontal`);
        assert.ok(Math.abs(m.width / m.height - m.intrinsic[0] / m.intrinsic[1]) < .01,
          `${size}: ${m.mode} deve preservar a proporção do desenho`);
      }
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
