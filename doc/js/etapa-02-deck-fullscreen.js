/* Aqua Index — Etapa 02: Apresentação em Tela Cheia para o Deck didático.
 * Utiliza Fullscreen API nativa com fallback gracioso, Escape nativo,
 * sincronização via evento fullscreenchange, atalhos de teclado e acessibilidade ARIA.
 */
(() => {
  "use strict";

  function initDeckFullscreen() {
    const deck = document.querySelector("[data-etapa02-deck]");
    const btn = document.querySelector("[data-e02-fullscreen]");
    if (!deck || !btn) return;

    const hasNativeFullscreen = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled
    );

    function isDeckFullscreen() {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      return fsElement === deck || deck.classList.contains("is-fullscreen");
    }

    function updateUiState(active) {
      if (active) {
        deck.classList.add("is-fullscreen");
        btn.setAttribute("aria-label", "Sair da tela cheia (Esc)");
        btn.setAttribute("title", "Sair da tela cheia (Esc ou Clique)");
        btn.innerHTML = `<span aria-hidden="true">✕</span> Sair`;
        // Garante foco no deck para navegação por setas durante a apresentação
        try { deck.focus(); } catch (_) {}
      } else {
        deck.classList.remove("is-fullscreen");
        btn.setAttribute("aria-label", "Apresentar em tela cheia");
        btn.setAttribute("title", "Apresentar em tela cheia (F ou Clique)");
        btn.innerHTML = `<span aria-hidden="true">⛶</span> Tela cheia`;
      }
    }

    function enterFullscreen() {
      if (deck.requestFullscreen) {
        deck.requestFullscreen().catch(err => {
          console.warn("Aqua Index: falha ao entrar em tela cheia nativa, aplicando modo projeção.", err);
          updateUiState(true);
        });
      } else if (deck.webkitRequestFullscreen) {
        try {
          deck.webkitRequestFullscreen();
        } catch (err) {
          console.warn("Aqua Index webkitFullscreen:", err);
          updateUiState(true);
        }
      } else {
        // Fallback para navegadores sem suporte a Fullscreen API
        updateUiState(true);
      }
    }

    function exitFullscreen() {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => updateUiState(false));
      } else if (fsElement && document.webkitExitFullscreen) {
        try {
          document.webkitExitFullscreen();
        } catch (_) {
          updateUiState(false);
        }
      } else {
        updateUiState(false);
      }
    }

    function toggleFullscreen() {
      if (isDeckFullscreen()) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    }

    // Clique do usuário no botão
    btn.addEventListener("click", event => {
      event.preventDefault();
      toggleFullscreen();
    });

    // Sincronização automática quando o estado de fullscreen muda (inclui Escape nativo)
    const onFullscreenChange = () => {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      updateUiState(fsElement === deck);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("fullscreenerror", () => {
      console.warn("Aqua Index: erro no evento de tela cheia");
    });

    // Navegação por teclado: 'f' ou 'F' ativa/desativa tela cheia; Escape desativa no fallback
    deck.addEventListener("keydown", event => {
      if ((event.key === "f" || event.key === "F") && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Evita acionar se o foco estiver num input
        if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
          event.preventDefault();
          toggleFullscreen();
        }
      } else if (event.key === "Escape" && deck.classList.contains("is-fullscreen")) {
        // Trata Escape no caso de fallback sem Fullscreen API nativa
        event.preventDefault();
        exitFullscreen();
      }
    });

    // Estado inicial
    updateUiState(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeckFullscreen, { once: true });
  } else {
    initDeckFullscreen();
  }
})();
