---
version: 2
slug: "etapa-03-arvores"
primary_target: "doc/etapa-03-arvores.html"
related_targets:
  - "doc/css/etapa-03.css"
  - "index.html"
---

# Etapa 03 — Árvores da envasadora

Modo: Experience + Technical Atlas. Público: colegas e avaliadores de ECAA08 que percorrem as Aulas 19–28 (MST, Huffman, BDT/AVL, RRT, RSTP, prévia Petri A24 reservada, Behavior Trees, KD-Trees, ID3/C4.5/CART e Síntese Integrada) e testam as dez vistas interativas no navegador.

## Direction contract

THESIS: Árvores organizam infraestrutura física, redundância L2, compressão de telemetria, arbitragem determinística, controle reativo, busca multidimensional e indução preditiva — declarando com rigor onde um método não se aplica (RRT na máquina fixa), onde a concorrência exige Redes de Petri (Aula 24 reservada a integrante do grupo) e onde ML não substitui intertravamento hardwired.

OWN-WORLD: Atlas editorial técnico alinhado a `DESIGN.md`, com papel quase branco (`#f8f9f7`) e modo escuro azul-ardósia (`#101a21`), tinta azul profunda (`#142534` / `#f1f4f2`), vermelho de orientação (`#c62f24` / `#ff7666`), divisões por linhas finas de 1px, cantos retos de 2px, títulos em Georgia e texto funcional em Segoe UI / monospace técnico.

STORY: O visitante entra pelo cabeçalho editorial enxuto e percorre três abas acessíveis: (1) Apresentação em 11 slides com diagramas SVG vetoriais e modo tela cheia (`data-e03-fullscreen` / tecla `F`) cobrindo as Aulas 19–28; (2) Inventário de 20 itens (README, pares roteiro+notebook A19–23 e A25–28, e registro explícito de reserva da Aula 24); (3) Laboratório interativo com 10 vistas (`integrated`, `mst`, `huffman`, `binary`, `rrt`, `rstp`, `petri`, `bt`, `kdtree`, `dtree`). O caráter conceitual e didático é mantido explícito em toda a superfície.

FIRST VIEWPORT: Cabeçalho do portal com `Etapa 03` ativa; breadcrumb limpo; abertura editorial em duas colunas com título em Georgia (`Árvores da envasadora.`), síntese das Aulas 19–28 e índice numérico (`03 abas · 20 itens · 10 vistas`), seguida imediatamente pela barra de três abas e pela primeira lâmina do deck.

FORM: Estilos 100% isolados em `@scope (.etapa03-page)` dentro de `doc/css/etapa-03.css`, versionado por SHA-256 (LF) sem alterar `styles.css`, `portal.css` nem `main.js`. Inclui suporte de tela cheia (`100vw × 100vh`) no deck e grade responsiva para os 10 modos entre 390px e 1440px, respeitando `prefers-reduced-motion`.

FINISH: validado por `tests/etapa-03-visual-versioning.test.cjs`, `tests/etapa-03-fullscreen.test.cjs`, `tests/etapa-03-simulator.test.cjs` e `tests/portal-harmonization.test.cjs` com conferência de hash SHA-256, escopo CSS, integridade de seletores `data-e03-*` e compatibilidade com a casca do portal.
