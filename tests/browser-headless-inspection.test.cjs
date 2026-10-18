const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function findBrowserPath() {
  const envPath = process.env.EDGE_PATH || process.env.CHROME_PATH || process.env.BROWSER_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/microsoft-edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const pages = [
  { file: "index.html", name: "Visão Geral" },
  { file: "doc/planta-envasadora.html", name: "A Envasadora" },
  { file: "doc/diretrizes-github.html", name: "Diretrizes GitHub" },
  { file: "doc/etapa-01-logica.html", name: "Etapa 01 Lógica" },
  { file: "doc/etapa-02-grafos.html", name: "Etapa 02 Grafos" }
];

test("Inspeção em navegador programático Edge/Chromium (Desktop 1440x900 e Mobile 390x844)", (t) => {
  const browserPath = findBrowserPath();
  if (!browserPath) {
    t.skip("Navegador Chromium/Edge não disponível no ambiente de execução. Teste opcional ignorado em CI.");
    return;
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aqua-browser-inspection-"));

  try {
    for (const page of pages) {
      const pagePath = path.join(root, page.file);
      assert.ok(fs.existsSync(pagePath), `Arquivo ${page.file} deve existir`);
      const pageUrl = "file:///" + pagePath.replace(/\\/g, "/");

      // 1. Renderização Desktop (1440x900)
      const desktopPng = path.join(tempDir, `${path.basename(page.file, ".html")}-desktop.png`);
      execFileSync(browserPath, [
        "--headless=new",
        "--allow-file-access-from-files",
        "--screenshot=" + desktopPng,
        "--window-size=1440,900",
        "--hide-scrollbars",
        pageUrl
      ], { stdio: ["ignore", "ignore", "ignore"] });

      assert.ok(fs.existsSync(desktopPng), `Screenshot desktop de ${page.file} deve existir`);
      const desktopStat = fs.statSync(desktopPng);
      // Limite declarado: o tamanho de arquivo confirma a compilação do raster sem colapso,
      // mas não substitui auditoria visual de overflow/clipping em layout real.
      assert.ok(desktopStat.size > 10000, `Raster desktop de ${page.file} gerado pelo motor gráfico (>10KB)`);

      // 2. Renderização Mobile (390x844)
      const mobilePng = path.join(tempDir, `${path.basename(page.file, ".html")}-mobile.png`);
      execFileSync(browserPath, [
        "--headless=new",
        "--allow-file-access-from-files",
        "--screenshot=" + mobilePng,
        "--window-size=390,844",
        "--hide-scrollbars",
        pageUrl
      ], { stdio: ["ignore", "ignore", "ignore"] });

      assert.ok(fs.existsSync(mobilePng), `Screenshot mobile de ${page.file} deve existir`);
      const mobileStat = fs.statSync(mobilePng);
      assert.ok(mobileStat.size > 10000, `Raster mobile de ${page.file} gerado pelo motor gráfico (>10KB)`);

      // 3. Inspeção do DOM renderizado no navegador
      const domOut = execFileSync(browserPath, [
        "--headless=new",
        "--allow-file-access-from-files",
        "--dump-dom",
        pageUrl
      ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

      assert.ok(domOut.includes("<body"), `${page.file} DOM deve possuir <body>`);
      assert.ok(domOut.includes("portal-ui"), `${page.file} DOM deve possuir elementos portal-ui`);
      assert.ok(domOut.includes("site-header"), `${page.file} DOM deve renderizar cabeçalho`);
      assert.ok(domOut.includes("site-footer"), `${page.file} DOM deve renderizar rodapé`);

      if (page.file === "doc/etapa-02-grafos.html") {
        assert.ok(domOut.includes("data-e02-fullscreen"), "DOM do deck deve conter botão de tela cheia");
        assert.ok(domOut.includes("e02-slide"), "DOM do deck deve conter slides");
      }

      if (page.file === "doc/etapa-01-logica.html") {
        assert.ok(domOut.includes('id="simulador"'), "DOM da Etapa 01 deve conter seção simulador");
        assert.ok(domOut.includes('data-simulator'), "DOM da Etapa 01 deve conter atributo data-simulator");
        assert.ok(domOut.includes('class="classic-scada"'), "DOM da Etapa 01 deve conter sinótico SCADA");
      }
    }

    // 4. Teste funcional de alternância de Tema (Light vs Dark) com carregamento real de assets
    const rootBaseUrl = "file:///" + root.replace(/\\/g, "/") + "/";
    const computedStyleScript = `
      <script>
        const rootComputed = getComputedStyle(document.documentElement);
        const bodyComputed = getComputedStyle(document.body);
        document.documentElement.setAttribute('data-computed-paper', rootComputed.getPropertyValue('--paper').trim());
        document.documentElement.setAttribute('data-computed-bg', bodyComputed.backgroundColor);
      </script>
    `;

    function buildThemePage(theme) {
      const htmlIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
      // Substitui data-theme no <html>, injeta <base href> para carregar os assets reais do repositório,
      // e injeta script que avalia estilos computados diretamente no DOM renderizado
      const themeHtml = htmlIndex
        .replace(/<html([^>]*)data-theme="[^"]*"/, `<html$1data-theme="${theme}"`)
        .replace("<head>", `<head><base href="${rootBaseUrl}">`)
        .replace("</body>", `${computedStyleScript}</body>`);

      const tempFile = path.join(tempDir, `theme-${theme}-test.html`);
      fs.writeFileSync(tempFile, themeHtml, "utf8");
      return "file:///" + tempFile.replace(/\\/g, "/");
    }

    const lightUrl = buildThemePage("light");
    const darkUrl = buildThemePage("dark");

    const lightDomOut = execFileSync(browserPath, [
      "--headless=new",
      "--allow-file-access-from-files",
      "--dump-dom",
      lightUrl
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

    const darkDomOut = execFileSync(browserPath, [
      "--headless=new",
      "--allow-file-access-from-files",
      "--dump-dom",
      darkUrl
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

    const lightPaperMatch = lightDomOut.match(/data-computed-paper="([^"]*)"/);
    const darkPaperMatch = darkDomOut.match(/data-computed-paper="([^"]*)"/);
    const lightBgMatch = lightDomOut.match(/data-computed-bg="([^"]*)"/);
    const darkBgMatch = darkDomOut.match(/data-computed-bg="([^"]*)"/);

    const lightPaper = lightPaperMatch ? lightPaperMatch[1] : null;
    const darkPaper = darkPaperMatch ? darkPaperMatch[1] : null;
    const lightBg = lightBgMatch ? lightBgMatch[1] : null;
    const darkBg = darkBgMatch ? darkBgMatch[1] : null;

    // Verificação de que os assets realmente carregaram e aplicaram tokens distintos
    assert.ok(lightPaper, "Estilo computado --paper no tema light deve ser capturado");
    assert.ok(darkPaper, "Estilo computado --paper no tema dark deve ser capturado");
    assert.equal(lightPaper, "#f4f1e8", "Variável --paper no tema light deve ser #f4f1e8");
    assert.equal(darkPaper, "#101820", "Variável --paper no tema dark deve ser #101820");
    assert.notEqual(lightPaper, darkPaper, "Variáveis --paper devem alternar entre light (#f4f1e8) e dark (#101820)");

    assert.equal(lightBg, "rgb(244, 241, 232)", "Cor de fundo computada do body no light deve ser rgb(244, 241, 232)");
    assert.equal(darkBg, "rgb(16, 24, 32)", "Cor de fundo computada do body no dark deve ser rgb(16, 24, 32)");
    assert.notEqual(lightBg, darkBg, "Cor de fundo do body deve divergir entre tema claro e escuro");

    assert.ok(darkDomOut.includes('data-theme="dark"'), "DOM deve respeitar atributo data-theme='dark'");
    assert.ok(darkDomOut.includes("portal-ui"), "DOM no tema escuro deve carregar casca portal-ui");

    const darkPng = path.join(tempDir, "index-theme-dark.png");
    execFileSync(browserPath, [
      "--headless=new",
      "--allow-file-access-from-files",
      "--screenshot=" + darkPng,
      "--window-size=1440,900",
      "--hide-scrollbars",
      darkUrl
    ], { stdio: ["ignore", "ignore", "ignore"] });

    // Limite declarado: o tamanho de arquivo (>10KB) confirma que o motor gráfico gerou o raster sem falha de processo,
    // enquanto a alternância real de estilos foi atestada pelos estilos computados acima.
    // O raster não substitui auditoria visual humana de clipping ou overflow de layout.
    assert.ok(fs.existsSync(darkPng) && fs.statSync(darkPng).size > 10000, "Raster do tema escuro gerado pelo motor gráfico (>10KB)");

  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
