# Guia de UI local — Aqua Index

## Escopo e princípios

Esta camada renova somente as páginas marcadas com `portal-ui`. O simulador da Etapa 01 continua usando exclusivamente `css/styles.css` e `js/main.js`; ele não importa o bundle nem `portal.css`, e nenhuma classe, controle, cor, forma, animação ou layout do simulador foi alterado.

O portal permanece HTML/CSS/JS estático, sem framework, pacote, build ou runtime CDN. A nova página estática da Etapa 02 não introduz backend nem JavaScript novo; o tema claro/escuro segue os tokens existentes (`--paper`, `--ink`, `--blue`, `--teal`), e `portal.css` apenas os mapeia para os tokens de componentes dentro de `@scope (.portal-ui)`.

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

## Busca existente

O pedido de busca é condicionado a um controle de busca existente e funcional. Este portal não possui esse controle; portanto a nova página estática da Etapa 02 não adiciona busca aparente, formulário GET, rota de busca, backend ou JavaScript. Caso uma página futura já ofereça busca funcional, mantenha sua arquitetura e tema, acrescente o rótulo visível `Search projects`, associe-o ao campo, use formulário GET na página atual com `q`, e una `input` e `btn btn-primary` com as classes `join` adequadas — sem converter este exemplo em um recurso falso.

## Restauração e verificações

Para desfazer a renovação, restaure os arquivos a partir do backup disponibilizado para a intervenção ou compare o checkout com o commit-base aprovado antes de qualquer cópia. Não registre no repositório o local pessoal do backup, credenciais, dados pessoais ou artefatos de execução.

Nesta entrega, as verificações executadas são: diff sem whitespace; allowlist; UTF-8; referências e âncoras nas cinco páginas; os 16 links de materiais; ausência de CDN/runtime ou JS novo; hashes de `styles.css` e `main.js`; bloco do simulador contra `HEAD`; e fontes da Etapa 02 inalteradas. Revisão visual em navegador real permanece responsabilidade do gate indicado, não uma afirmação deste documento.

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
