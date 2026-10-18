const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const htmlPath = path.resolve(__dirname, "../doc/etapa-02-grafos.html");
const cssPath = path.resolve(__dirname, "../doc/css/etapa-02.css");
const jsPath = path.resolve(__dirname, "../doc/js/etapa-02-deck-fullscreen.js");

test("doc/etapa-02-grafos.html inclui botão acessível de tela cheia no deck de slides", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.ok(html.includes("data-e02-fullscreen"), "HTML deve conter atributo data-e02-fullscreen");
  assert.ok(html.includes("e02-fullscreen-btn"), "HTML deve conter classe e02-fullscreen-btn");
  assert.ok(html.includes("Apresentar em tela cheia"), "HTML deve conter label acessível para tela cheia");
  assert.ok(html.includes("js/etapa-02-deck-fullscreen.js"), "HTML deve carregar o script dedicado de tela cheia");
});

test("doc/css/etapa-02.css contém regras escopadas para o modo tela cheia e botão", () => {
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes(".e02-fullscreen-btn"), "CSS deve estilizar .e02-fullscreen-btn");
  assert.ok(css.includes(".e02-deck:fullscreen"), "CSS deve conter pseudo-classe :fullscreen");
  assert.ok(css.includes(".e02-deck.is-fullscreen"), "CSS deve conter classe de fallback .is-fullscreen");
  assert.ok(css.includes("100vw"), "CSS de tela cheia deve cobrir 100vw");
  assert.ok(css.includes("100vh"), "CSS de tela cheia deve cobrir 100vh");
});

function createMockEnvironment(options = {}) {
  const listeners = {};
  const deckListeners = {};
  const btnListeners = {};
  const classListSet = new Set();

  let requestFullscreenCalls = 0;
  let exitFullscreenCalls = 0;

  const deck = {
    tagName: "DIV",
    classList: {
      add: (cls) => classListSet.add(cls),
      remove: (cls) => classListSet.delete(cls),
      contains: (cls) => classListSet.has(cls)
    },
    focus: () => { deck.focused = true; },
    focused: false,
    addEventListener: (type, fn) => {
      deckListeners[type] = deckListeners[type] || [];
      deckListeners[type].push(fn);
    },
    dispatchKeydown: (key, extra = {}) => {
      const evt = {
        key,
        target: deck,
        ctrlKey: !!extra.ctrlKey,
        metaKey: !!extra.metaKey,
        altKey: !!extra.altKey,
        preventDefault: () => {}
      };
      (deckListeners["keydown"] || []).forEach(fn => fn(evt));
    },
    requestFullscreen: options.hasNativeFullscreen
      ? () => {
          requestFullscreenCalls++;
          if (options.rejectFullscreen) {
            return Promise.reject(new Error("Erro simulado de permissão de tela cheia"));
          }
          return Promise.resolve();
        }
      : undefined
  };

  const btnAttrs = {};
  const btn = {
    tagName: "BUTTON",
    innerHTML: "",
    setAttribute: (k, v) => { btnAttrs[k] = v; },
    getAttribute: (k) => btnAttrs[k],
    addEventListener: (type, fn) => {
      btnListeners[type] = btnListeners[type] || [];
      btnListeners[type].push(fn);
    },
    click: () => {
      (btnListeners["click"] || []).forEach(fn => fn({ preventDefault: () => {} }));
    }
  };

  const document = {
    readyState: "complete",
    fullscreenEnabled: !!options.hasNativeFullscreen,
    fullscreenElement: null,
    exitFullscreen: options.hasNativeFullscreen
      ? () => {
          exitFullscreenCalls++;
          return Promise.resolve();
        }
      : undefined,
    querySelector: (sel) => {
      if (sel === "[data-etapa02-deck]") return deck;
      if (sel === "[data-e02-fullscreen]") return btn;
      return null;
    },
    addEventListener: (type, fn) => {
      listeners[type] = listeners[type] || [];
      listeners[type].push(fn);
    },
    dispatchFullscreenChange: (element) => {
      document.fullscreenElement = element;
      (listeners["fullscreenchange"] || []).forEach(fn => fn({}));
    }
  };

  const context = {
    document,
    window: { document },
    console: { warn: () => {}, log: () => {} }
  };

  return {
    context,
    document,
    deck,
    btn,
    btnAttrs,
    classListSet,
    listeners,
    deckListeners,
    btnListeners,
    getRequestCalls: () => requestFullscreenCalls,
    getExitCalls: () => exitFullscreenCalls
  };
}

const jsCode = fs.readFileSync(jsPath, "utf8");

test("Execução funcional do deck: clique entra e sai com Fullscreen API nativa", () => {
  const env = createMockEnvironment({ hasNativeFullscreen: true });
  vm.runInNewContext(jsCode, env.context);

  // Estado inicial
  assert.equal(env.deck.classList.contains("is-fullscreen"), false, "Deck não deve estar em tela cheia inicialmente");
  assert.equal(env.btn.getAttribute("aria-label"), "Apresentar em tela cheia");

  // Usuário clica no botão para entrar
  env.btn.click();
  assert.equal(env.getRequestCalls(), 1, "Deve solicitar requestFullscreen");

  // Navegador emite fullscreenchange
  env.document.dispatchFullscreenChange(env.deck);
  assert.equal(env.deck.classList.contains("is-fullscreen"), true, "Deck deve receber classe is-fullscreen");
  assert.equal(env.btn.getAttribute("aria-label"), "Sair da tela cheia (Esc)");
  assert.ok(env.btn.innerHTML.includes("Sair"), "Botão deve alternar para Sair");

  // Usuário clica no botão para sair
  env.btn.click();
  assert.equal(env.getExitCalls(), 1, "Deve solicitar exitFullscreen");

  // Navegador emite fullscreenchange de saída
  env.document.dispatchFullscreenChange(null);
  assert.equal(env.deck.classList.contains("is-fullscreen"), false, "Deck deve remover classe is-fullscreen");
  assert.equal(env.btn.getAttribute("aria-label"), "Apresentar em tela cheia");
  assert.ok(env.btn.innerHTML.includes("Tela cheia"), "Botão deve alternar para Tela cheia");
});

test("Execução funcional do deck: tecla 'f'/'F' e Escape sincronizam o estado", () => {
  const env = createMockEnvironment({ hasNativeFullscreen: true });
  vm.runInNewContext(jsCode, env.context);

  // Tecla 'f' para entrar
  env.deck.dispatchKeydown("f");
  assert.equal(env.getRequestCalls(), 1, "Pressionar 'f' deve acionar requestFullscreen");
  env.document.dispatchFullscreenChange(env.deck);
  assert.equal(env.deck.classList.contains("is-fullscreen"), true);

  // Escape nativo do navegador dispara fullscreenchange com fullscreenElement nulo
  env.document.dispatchFullscreenChange(null);
  assert.equal(env.deck.classList.contains("is-fullscreen"), false);
  assert.equal(env.btn.getAttribute("aria-label"), "Apresentar em tela cheia");

  // Tecla 'F' maiúscula para entrar novamente
  env.deck.dispatchKeydown("F");
  assert.equal(env.getRequestCalls(), 2, "Pressionar 'F' deve acionar requestFullscreen");
});

test("Execução funcional do deck: fallback gracioso em caso de rejeição de requestFullscreen", async () => {
  const env = createMockEnvironment({ hasNativeFullscreen: true, rejectFullscreen: true });
  vm.runInNewContext(jsCode, env.context);

  // Clica no botão; promise rejeita
  env.btn.click();

  // Aguarda resolução da promise rejeitada no event loop
  await new Promise(resolve => setTimeout(resolve, 10));

  // O catch deve ter aplicado o modo projeção de fallback
  assert.equal(env.deck.classList.contains("is-fullscreen"), true, "Deve ativar classe is-fullscreen como fallback");
  assert.equal(env.btn.getAttribute("aria-label"), "Sair da tela cheia (Esc)");

  // Pressionar Escape no deck deve sair do modo fallback
  env.deck.dispatchKeydown("Escape");
  assert.equal(env.deck.classList.contains("is-fullscreen"), false, "Escape deve desativar modo de projeção");
  assert.equal(env.btn.getAttribute("aria-label"), "Apresentar em tela cheia");
});

test("Execução funcional do deck: funcionamento robusto na ausência total da Fullscreen API", () => {
  const env = createMockEnvironment({ hasNativeFullscreen: false });
  vm.runInNewContext(jsCode, env.context);

  // Clica no botão; sem Fullscreen API nativa
  env.btn.click();
  assert.equal(env.deck.classList.contains("is-fullscreen"), true, "Deve ativar projeção CSS");
  assert.equal(env.btn.getAttribute("aria-label"), "Sair da tela cheia (Esc)");

  // Escape desativa
  env.deck.dispatchKeydown("Escape");
  assert.equal(env.deck.classList.contains("is-fullscreen"), false);
  assert.equal(env.btn.getAttribute("aria-label"), "Apresentar em tela cheia");
});
