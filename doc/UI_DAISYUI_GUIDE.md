# Guia de UI local — Aqua Index

## Escopo e princípios

Esta camada renova somente as páginas marcadas com `portal-ui`. O simulador da Etapa 01 continua usando exclusivamente `css/styles.css` e `js/main.js`; ele não importa o bundle nem `portal.css`, e nenhuma classe, controle, cor, forma, animação ou layout do simulador foi alterado.

O portal permanece HTML/CSS/JS estático, sem framework, pacote, build ou runtime CDN. A Etapa 02 usa o módulo local e específico `js/etapa-02-simulator.js`, protegido para inicialização no DOM e exportação CommonJS apenas nos testes; ele calcula seis grafos didáticos independentes e não cria backend, requisição externa, telemetria ou comando. Seus estilos vivem em `css/etapa-02.css`, isolados em `@scope (.etapa02-page)`; o tema claro/escuro continua a usar os tokens existentes (`--paper`, `--ink`, `--blue`, `--teal`) sem alterar `portal.css`, `styles.css` ou `main.js`.

## daisyUI local e proveniência

O uso seguiu a skill daisyUI e os guias de `button`, `card`, `badge`, `breadcrumbs` e `table`. O arquivo `css/vendor/daisyui-5.7.50-portal.css` concatena, sem `@import`, os módulos oficiais abaixo dentro de `@scope (.portal-ui) { ... }`; o conteúdo de cada módulo é preservado, com um cabeçalho de URL e hash antes dele.

| Módulo | URL de origem | SHA-256 original |
| --- | --- | --- |
| button.css | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/components/button.css` | `4d07575e606c449516855782ed0011bc5dce76027e72e719971d2a5040cef9eb` |
| card.css | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/components/card.css` | `ba006327cd4b246279255ef6bea60d50cf26e8136391a6250f80f54cd7150434` |
| badge.css | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/components/badge.css` | `9a2db673cefc560caec464850946ac76feed7245889afd127ac9087ad4c03b4b` |
| breadcrumbs.css | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/components/breadcrumbs.css` | `7ba76b16f04acb2cffffa90b9ffa632ab04528fb78ad37a67840f22547ae9ada` |
| table.css | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/components/table.css` | `b4bfc009c7530e1f07d2dbd883c69bb4907e79fac00feae250c84851ed45ca6a` |
| LICENSE | `https://cdn.jsdelivr.net/npm/daisyui@5.7.50/LICENSE` | `8709e3ac65c84637c422dc8082b893d9997fce093751c77b2f1983bf29dbf9ea` |

Transformação aplicada: concatenação na ordem `button`, `card`, `badge`, `breadcrumbs`, `table`, com comentários de proveniência, seguida de envolvimento único em `@scope (.portal-ui)`. Não foram incluídos preflight, `rootcolor`, `rootscrolllock`, `rootscrollgutter`, `svg`, temas globais ou reset. A cópia integral da licença MIT está em `css/vendor/LICENSE.MIT`.

Como o CSS legado contém `a { color: inherit }` fora de camadas, `portal.css` inclui a ponte escopada `a.btn { color: var(--btn-fg) }`, preservando o contraste de links que usam botões daisyUI.

SHA-256 do bundle transformado: `49b8961018facf7358a34aad9cf45c99095c58b8157d80f0924e471635dc92ef`.

## Etapa 02 — portal e simulador local

`etapa-02-grafos.html` preserva o shell do portal e organiza três abas acessíveis: apresentação com 10 slides, inventário de README e 16 materiais, e simulador. As abas principais usam `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, roving `tabindex`, setas e Home/End; sem JavaScript, os 10 slides e os 17 painéis continuam em leitura linear. O deck local só responde às setas quando recebe foco e inclui microdiagramas/indicadores locais por aula, sem imagem, fonte ou dependência adicional.

O simulador contém seis fontes independentes: água/copos (A11/A14/A15, Dijkstra), busca (A13, BFS/DFS), ronda não dirigida (A16, Hierholzer), matriz AGV ilustrativa (A17, NN/2-Opt), materiais (A18, Kahn) e veículos (A18, Dijkstra). Água/busca usam bifurcações, materiais é organizado em camadas e veículos separa corredores da via externa; ronda e AGV usam anel, com viewport horizontal rolável e rótulos ampliados em telas estreitas. No DAG, os identificadores de fonte são `E1_DISPENSA` a `E5_EJECAO` (referidos como E1–E5 somente na leitura curta). O módulo exporta somente para `node:test` as funções puras `dijkstra`, `bfs`, `dfsPaths`, `euler`, `nearestNeighbor`, `twoOpt` e `kahn`; os dados imutáveis carregam fontes e unidades próprias. Os limites permanecem: nenhum resultado é telemetria, hidráulica física, comando, rota de AGV implantada, otimização global, disponibilidade conjunta de insumos, aprovação docente ou validação de segurança.

## Busca existente

O pedido de busca é condicionado a um controle de busca existente e funcional. Este portal não possui esse controle; portanto a Etapa 02 não adiciona busca aparente, formulário GET, rota de busca ou backend. O JavaScript local autorizado limita-se às abas, deck e simulador desta página. Caso uma página futura já ofereça busca funcional, mantenha sua arquitetura e tema, acrescente o rótulo visível `Search projects`, associe-o ao campo, use formulário GET na página atual com `q`, e una `input` e `btn btn-primary` com as classes `join` adequadas — sem converter este exemplo em um recurso falso.

## Restauração e verificações

Para desfazer a renovação, restaure os arquivos a partir do backup disponibilizado para a intervenção ou compare o checkout com o commit-base aprovado antes de qualquer cópia. Não registre no repositório o local pessoal do backup, credenciais, dados pessoais ou artefatos de execução.

Nesta entrega da Etapa 02, as verificações executadas são: `node --check` e testes `node:test` dos algoritmos; `git diff --check`; allowlist; contagem dos 10 slides, 17 painéis e 16 links de materiais; hashes de `styles.css`, `main.js` e das fontes acadêmicas contra o baseline. O simulador valida dados finitos não negativos, direção, origem igual ao destino, nós desconhecidos, bloqueios/restauração, BFS/DFS, Hierholzer por IDs, NN/2-Opt e Kahn; a revisão visual em navegador real (temas, teclado, SVG, responsividade e console) permanece responsabilidade do gate indicado, não uma afirmação deste documento.

## Prompt de referência

```text
Use the daisyUI skill to improve this project's existing search controls.
Keep the project's framework, dependencies, and current page.
Add a visible Search projects label connected to a search input.
Use a native GET form on the current page, with q as the input name.
Keep input and button together with daisyUI join classes. Use input for the field and btn btn-primary for the submit button.
Make the field fit a narrow screen without making the button unreadable.
Keep keyboard focus visible and keep the project's existing theme colors.
Do not add JavaScript, a new route, a search backend, or a package.
Show the changed markup and list the checks you actually ran.
```

## Refinamento Argon da Etapa 02

O refinamento mantém os mesmos módulos locais daisyUI e a única CTA
`btn-primary`. Na página da Etapa 02, botões existentes continuam usando as
classes locais `btn` e `btn-outline`; o contraste adicional é limitado ao
escopo `.etapa02-page`, sem editar vendor, temas globais ou o simulador da
Etapa 01.

Em desktop, o SVG se ajusta à coluna sem rolagem horizontal e os 17 seletores
de arquivos quebram linha; em telas até 760px, o diagrama preserva uma área
rolável própria de 680px, sem mascarar conteúdo. O SVG desenha arestas, nós e
rótulos em camadas, e os controles atualizam o estado ARIA e os bloqueios
clicados no diagrama.

Verificações desta alteração devem registrar somente os comandos realmente
executados: sintaxe Node, `node:test`, QA independente/local disponível,
contagem do roteiro, hashes/allowlist e `git diff --check`. A inspeção visual
em navegador real continua pertencendo ao gate que a executar.

### Correção responsiva e setas

Em telas de até 760px, a regra posterior à grade desktop empilha o simulador
em uma coluna, deixa os controles em largura integral e preserva o SVG de 680px
no contêiner de rolagem horizontal local. As setas direcionadas usam três
marcadores SVG de tamanho fixo, com os mesmos tokens de aresta para estado
normal, rota e bloqueio; isso evita depender da herança de `currentColor`.

Checks efetivamente executados nesta correção: `node --check
doc/js/etapa-02-simulator.js`; `node --test tests/etapa-02-simulator.test.cjs`
(sete testes); `argon-acceptance.mjs` nos seis modos, claro e
escuro a 1440px (sem colisões, recorte ou span do simulador acima de 780px);
`argon-interaction-qa.mjs` (sete interações); e `mobile-stack-qa.mjs`, que
mediu 320px e 390px nos dois temas para os seis modos (24 pilhas corretas, sem
overflow da página) e comparou a cor computada de cada seta direcionada,
inclusive bloqueio, ao traço correspondente. `visual-final.mjs` também gerou
os recortes finais de água a 390px e dos modos materiais/veículos em desktop.

### Correção visual e versionamento de cache da apresentação

A atualização do deck didático da Etapa 02 para layout em duas colunas e diagramas SVG vetorizados exigiu que `doc/etapa-02-grafos.html` utilize URL versionada ligada ao conteúdo para `css/etapa-02.css`, prevenindo inconsistência visual decorrente de cache HTTP intermediário (`Cache-Control: max-age=600` no GitHub Pages). O parâmetro `?v=` carrega o hash SHA-256 integral do arquivo CSS, garantindo que qualquer cliente receba imediatamente as regras escopadas `.e02-lesson-layout`, `.e02-lesson-figure`, preenchimentos dinâmicos com tokens de tema (`--paper`, `--ink`, `--blue-deep`) e regras responsivas para visualização em desktop e dispositivos móveis.

## Harmonização Visual do Portal Editorial e Apresentação em Tela Cheia (Luna 6)

### 1. Escopo da Harmonização e Isolamento do Simulador

A renovação estética harmonizou a identidade visual do portal Aqua Index tomando como referência o acabamento da Etapa 02. As alterações foram centralizadas no arquivo escopado `doc/css/portal.css` sob o seletor `@scope (.portal-ui)`.

- **Hierarquia e Componentes**: Padronização de tipografia técnica, cards de especificações (`.spec-card`), cartões de arquitetura (`.architecture-card`), tabelas de dados com cabeçalhos contrastantes (`.data-table`, `.table-wrap`), quadros de notas e limites (`.callout`, `.callout-warning`) e responsividade em grid/flexbox.
- **Diagramas Vetoriais SVG Acessíveis**: Inclusão de figuras semânticas com `<figure class="portal-figure"><figcaption>` baseadas estritamente em dados reais do repositório:
  - `doc/planta-envasadora.html`: Fluxo circular das cinco estações da mesa indexadora e respectivas tags de instrumentação (XV-101 a XV-502).
  - `doc/diretrizes-github.html`: Fluxo de rastreabilidade e entregas atômicas (branch -> testes locais -> PR -> main).
  - `doc/etapa-01-logica.html`: Modelo de três camadas conceituais da avaliação integrada da Aula 10 (Telemetria, Discretização e Inferência).
- **Proteção do Simulador da Etapa 01**: A seção `#simulador` de `doc/etapa-01-logica.html` foi mantida sem a classe `.portal-ui`. Seu DOM, regras de `doc/css/styles.css`, sinótico SCADA, animações e comportamentos foram integralmente preservados sem qualquer interferência de estilos.
- **Herança em index.html**: O arquivo `index.html` já possui `<body class="portal-ui">` e herdou automaticamente os novos tokens e refinamentos visuais do CSS escopado, sem necessidade de alterações em seu conteúdo editorial além do versionamento da URL de cache.

### 2. Apresentação em Tela Cheia no Deck da Etapa 02

Para o deck didático de 10 slides da Etapa 02 (`doc/etapa-02-grafos.html`), foi adicionado o recurso de exibição em tela cheia exclusivo:

- **Controle Acessível**: Botão dedicado `<button class="btn btn-sm btn-outline e02-fullscreen-btn" type="button" data-e02-fullscreen>` com rótulo ARIA dinâmico, alternando entre "Apresentar em tela cheia" e "Sair da tela cheia (Esc)".
- **Script Dedicado (`doc/js/etapa-02-deck-fullscreen.js`)**:
  - Utiliza Fullscreen API nativa (`requestFullscreen` / `exitFullscreen`).
  - Sincronização automática de estado e classes via eventos `fullscreenchange` e `webkitfullscreenchange`.
  - Tratamento nativo e por fallback da tecla `Escape`.
  - Atalhos de teclado `f` / `F` para alternar modo quando o deck está em foco.
  - Modo de projeção de fallback (classe `.is-fullscreen`) em navegadores sem suporte nativo ou em caso de rejeição de permissão.
- **Estilos Escopados (`doc/css/etapa-02.css`)**: Regras para `:scope .e02-deck:fullscreen` e `:scope .e02-deck.is-fullscreen` projetadas para cobertura de 100vw e 100vh com fundo temático, centralização dos slides e dimensionamento responsivo de diagramas SVG.

### 3. Versionamento de Cache (SHA-256)

Para prevenir inconsistências decorrentes do cache do GitHub Pages (`Cache-Control: max-age=600`), todas as referências aos arquivos CSS dinâmicos utilizam o hash SHA-256 integral em parâmetros de query string:

- `doc/css/etapa-02.css?v=<sha256>` em `doc/etapa-02-grafos.html`.
- `doc/css/portal.css?v=<sha256>` em `index.html`, `doc/etapa-01-logica.html`, `doc/etapa-02-grafos.html`, `doc/planta-envasadora.html` e `doc/diretrizes-github.html`.

### 4. Validações e Testes Executados

As seguintes verificações automatizadas foram implementadas e executadas com sucesso:

- `node --check doc/js/etapa-02-deck-fullscreen.js`: Validação de sintaxe ECMAScript.
- `git diff --check`: Verificação de integridade de diff e ausência de erros de formatação.
- `tests/portal-harmonization.test.cjs`:
  - Preservação estrita dos hashes SHA-256 de `doc/css/styles.css` e `doc/js/main.js` contra o baseline.
  - Comparação com `git show HEAD` isolando a execução do git e expondo falhas de assertiva sem engolir divergências.
  - Isolamento estrito da seção `#simulador` sem classes `.portal-ui`.
  - Integridade da navegação entre as cinco páginas.
  - Presença de diagramas SVG acessíveis com legendas.
  - Verificação determinística do hash SHA-256 de `doc/css/portal.css` em todas as páginas que o carregam.
- `tests/etapa-02-fullscreen.test.cjs`:
  - Validação estrutural de marcação e regras CSS.
  - Testes funcionais via VM Node.js com mock de DOM: alternância de clique entra/sai, sincronização com eventos nativos `fullscreenchange` e tecla `Escape`, atalhos `f`/`F`, fallback de projeção em caso de erro e operação em navegadores sem Fullscreen API.
- `tests/etapa-02-simulator.test.cjs` e `tests/etapa-02-visual-versioning.test.cjs`: Preservação dos algoritmos de grafos e versionamento da Etapa 02.
- `tests/browser-headless-inspection.test.cjs`: Inspeção programática portátil baseada em Chromium/Edge headless com fallback gracioso (skip quando o binário não estiver presente no ambiente):
  - **Renderização e raster**: Valida que o motor gráfico compila capturas não vazias (>10KB) em desktop (1440x900) e mobile (390x844). *Limite estrito*: o raster binário e o tamanho de arquivo comprovam apenas a ausência de colapso de renderização ou falha de processo; eles **não** comprovam ausência de clipping, corte ou overflow visual de layout, cuja verificação requer auditoria visual humana em navegador real.
  - **Inspeção estrutural do DOM**: Confirma a presença de `<body>`, componentes `.portal-ui`, cabeçalho, rodapé e marcações específicas da Etapa 01 e Etapa 02 no DOM renderizado.
  - **Alternância de tema (Light vs Dark)**: Comprovada com carregamento real dos assets via `<base href>` com `--allow-file-access-from-files` e leitura direta dos estilos computados no DOM (`--paper`: `#f4f1e8` claro vs `#101820` escuro; `background-color` do body: `rgb(244, 241, 232)` vs `rgb(16, 24, 32)`), sem assumir aprovação estética de componentes individuais.

### 5. Limites Declarados e Auditoria Visual

- **Não alegação sobre clipping/overflow via captura binária**: A geração de PNGs acima de 10KB comprova unicamente que o motor gráfico executou o pipeline de renderização sem tela em branco ou crash; ela não substitui a auditoria visual em viewport real para verificar ausência de clipping, quebras inadequadas de texto ou overflow de contêineres.
- **Validação de tema**: A alternância entre temas claro e escuro é atestada estritamente no nível de atributos DOM e variáveis/propriedades CSS computadas (`--paper` e `background-color` do `body`) quando os estilos são carregados. Não se alega harmonia visual integral ou ausência de artefatos estéticos sem inspeção interativa.
