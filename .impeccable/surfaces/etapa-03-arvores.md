---
version: 1
slug: "etapa-03-arvores"
primary_target: "doc/etapa-03-arvores.html"
related_targets:
  - "doc/css/etapa-03.css"
  - "index.html"
---

# Etapa 03 — Árvores da envasadora

Modo: Experience + Technical Atlas. Público: colegas e avaliadores de ECAA08 que percorrem as Aulas 19–22 (MST, Huffman, Árvores Binárias BDT/AVL e RRT) e testam os quatro simuladores didáticos no navegador.

## Direction contract

THESIS: Árvores organizam custo de infraestrutura, compressão de telemetria, decisão sensível ao contexto e historiador balanceado — e a Etapa 03 também declara com rigor onde uma estrutura de árvore (RRT) não se aplica fisicamente à mesa indexadora pneumática.

OWN-WORLD: Atlas editorial técnico alinhado a `DESIGN.md`, com papel quase branco (`#f8f9f7`) e modo escuro azul-ardósia (`#101a21`), tinta azul profunda (`#142534` / `#f1f4f2`), vermelho de orientação (`#c62f24` / `#ff7666`), divisões por linhas finas de 1px, cantos retos de 2px, títulos em Georgia e texto funcional em Segoe UI / monospace técnico.

STORY: O visitante entra pelo cabeçalho editorial enxuto e percorre três abas acessíveis: (1) Apresentação em 6 slides com diagramas SVG vetoriais cobrindo Aulas 19–22 e a ponte para Redes de Petri na Aula 24; (2) Inventário de 9 arquivos-fonte com pergunta, achado e limite; (3) Laboratório interativo com 4 modos (MST, Huffman, BDT/AVL e RRT logístico SE(2) no reabastecimento `MAG-100`). O caráter conceitual e didático é mantido explícito em toda a superfície.

FIRST VIEWPORT: Cabeçalho do portal com `Etapa 03` ativa; breadcrumb limpo; abertura editorial em duas colunas com título em Georgia (`Árvores da envasadora.`), síntese do critério de aderência física e índice numérico (`03 abas · 09 materiais · 04 simuladores`), seguida imediatamente pela barra de três abas e pela primeira lâmina do deck.

FORM: Estilos 100% isolados em `@scope (.etapa03-page)` dentro de `doc/css/etapa-03.css`, versionado por SHA-256 (LF) sem alterar `styles.css`, `portal.css` nem `main.js`. Zero sombras pesadas, zero imagens raster decorativas, responsividade limpa entre 390px e 1440px e respeito total a `prefers-reduced-motion`.

FINISH: validado por `tests/etapa-03-visual-versioning.test.cjs` e `tests/portal-harmonization.test.cjs` com conferência de hash SHA-256, escopo CSS, integridade de seletores `data-e03-*` e compatibilidade com a casca do portal.
