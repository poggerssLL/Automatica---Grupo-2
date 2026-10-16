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
