# Guia Completo de Funcionamento — Portal e Simulador da Etapa 02 (Grafos)

Este documento explica, passo a passo e em linguagem acessível para um estudante iniciante, como funciona a página **`doc/etapa-02-grafos.html`** (*Portal da Etapa 02 — Grafos | Aqua Index*), como operar cada uma das **seis vistas interativas do simulador**, o que significa cada elemento visual na tela e como reproduzir com exatidão todos os resultados verificados nos testes e nos materiais das Aulas 11 a 18.

---

## 1. Visão Geral: O que é a Página da Etapa 02 e qual o seu Papel no Projeto

No projeto da disciplina **ECAA08 (Automática — UNIFEI, Grupo 2)**, estudamos uma **máquina pneumática de envasamento de água em copos** organizada sobre uma mesa giratória indexada com cinco estações sequenciais:

1. **E1 — Dispensa do copo** (Cilindro A libera o copo do magazine `MAG-100_Copos` para a mesa);
2. **E2 — Envase e dosagem de água** (Cilindro B de 3 vias, Cilindro C dosador de 150 ml `DOS-201_Dosador` e bico `BIC-202_Bico`);
3. **E3 — Posicionamento da tampa** (manipulador *pick-and-place* com Cilindros D/E e ventosa a vácuo `EJT-301`);
4. **E4 — Termosselagem** (prensa aquecida movida pelo Cilindro F);
5. **E5 — Ejeção** (Cilindros G e H transferem o copo fechado para a esteira de saída `EST-500_Saida`).

Na **Etapa 02**, aplicamos **Teoria dos Grafos** (Aulas 11 a 18) para responder perguntas específicas de engenharia sobre esse processo: como modelar tubulações e fluxos como dígrafos, como achar o menor caminho, como buscar rotas alternativas, como planejar uma ronda de inspeção sem repetir trechos, como roteirizar coletas com heurísticas e como separar a ordem lógica de fabricação (materiais) do tráfego de carrinhos (veículos).

> **Regra de ouro para não confundir na apresentação:**
> A página da Etapa 02 reúne **modelos matemáticos didáticos independentes** executados localmente no navegador. Clicar em um bloqueio ou calcular uma rota no simulador **recalcula apenas a estrutura de dados em JavaScript**; não envia comandos para CLP, não aciona válvulas no Automation Studio, não lê sensores reais de planta e não substitui os intertravamentos físicos da máquina.

---

## 2. Estrutura da Página: Cabeçalho e as Três Abas Principais

Ao abrir `doc/etapa-02-grafos.html` no navegador, você verá:

- **Cabeçalho superior (`site-header`)**: links para as páginas do portal (*Visão geral*, *Etapa 01*, *Etapa 02*, *A envasadora*, *GitHub & Entregas*) e o botão **`◐`** (`Alternar tema`) para alternar entre tema claro e escuro.
- **Faixa de abertura (`e02-hero`)**: apresenta o título *"Grafos da envasadora."* e o resumo lateral: **`03` abas de leitura**, **`17` arquivos mapeados** e **`06` vistas interativas**.
- **Barra das três abas principais (`[data-etapa02-tabs]`)**: você pode alternar clicando com o mouse ou, quando uma aba estiver focada, usando as setas **`←` / `→`**, **`Home`** e **`End`** do teclado. A URL também atualiza o hash (`#apresentacao`, `#arquivos`, `#simulador`).

### 2.1. Aba 1 — `Apresentação`
- Contém um **deck de 10 slides** (`01 / 10` a `10 / 10`), numerados na barra de botões rápidos como **`01`**, **`11`**, **`12`**, **`13`**, **`14`**, **`15`**, **`16`**, **`17`**, **`18`** e **`Σ`**.
- **Como navegar nos slides**:
  - Clicando diretamente nos botões **`01`** a **`Σ`** do índice do deck;
  - Clicando nos botões **`Anterior`** (`[data-e02-prev]`) e **`Próximo`** (`[data-e02-next]`) abaixo do slide;
  - Ou clicando dentro da caixa do deck (`.e02-deck`, que possui `tabindex="0"`) e usando as setas **`←`** e **`→`** do teclado.
- Cada slide resume **uma pergunta por aula** e traz na faixa inferior (`data-viz`) uma síntese visual rápida (por exemplo, `E1 → E2 → E3 → E4 → E5` na Abertura e `270 cm  →  275 cm  →  sem rota` na Aula 14).

### 2.2. Aba 2 — `Arquivos 17`
- Funciona como um **inventário vivo e mapa de leitura** dos **17 arquivos** da pasta `etapa-02-grafos/`: o `README.md` geral da etapa mais os **8 pares de Roteiro (`.md`) e Notebook (`.ipynb`)** das Aulas 11 a 18 (`1 + 8 × 2 = 17`).
- Na barra horizontal de seletores (`[data-e02-file-rail]`), basta clicar em `README`, `11 · Roteiro`, `11 · Notebook`, ..., `18 · Notebook` para exibir o cartão correspondente com a **Pergunta**, **Modelo/Funções**, **Achado/Resultado**, **Limite** e o botão para abrir o documento-fonte.
- É importante conhecer essa aba porque **alguns modelos das aulas estão documentados nos arquivos e slides, mas não possuem uma tela própria no simulador de 6 vistas** (por exemplo: as matrizes $B$, $A$, $W$ $13\times 13$ da rede de ar comprimido e o ciclo $C_5$ da mesa na Aula 12; a caça a vazamentos de 57,8 min e o circuito CIP dirigido de 20,0 min na Aula 16; e a conversão de distância para tempo de 20 min vs. 6,5 min ou a quarentena booleana na Aula 18).

### 2.3. Aba 3 — `Simulador 6 vistas`
- É o laboratório interativo (`#e02-sim-workbench`), precedido pela **Nota metodológica** que lembra que os controles recalculam estruturas didáticas no navegador.
- Possui **6 botões de vista** na barra superior (`.e02-mode-list`):
  1. **`Água / copos · Dijkstra`** (`data-e02-mode="water"`)
  2. **`Busca · BFS · DFS`** (`data-e02-mode="search"`)
  3. **`Inspeção · Euler`** (`data-e02-mode="round"`)
  4. **`AGV · NN · 2-Opt`** (`data-e02-mode="agv"`)
  5. **`Materiais · Kahn`** (`data-e02-mode="materials"`)
  6. **`Veículos · Dijkstra`** (`data-e02-mode="vehicles"`)

> **Isolamento entre vistas:** Cada vista possui seu próprio grafo imutável (`Object.freeze`), sua unidade de medida e seu algoritmo. Ao trocar de uma vista para outra, a função `changeMode()` limpa todos os bloqueios e reinicia o estado da nova vista. Alterar uma vista **nunca** afeta as demais.

---

## 3. Como Ler e Operar a Interface do Simulador

Dentro da aba **`Simulador`**, a tela é dividida em cinco áreas principais:

### 3.1. Cabeçalho da Vista (`.e02-sim-head`)
Mostra:
- O **código da aula** (`14 / 15`, `13 / busca`, `16 / inspeção`, `17 / AGV`, `18 / materiais`, `18 / veículos`);
- O **título e a descrição curta** da pergunta que aquela vista resolve;
- O **selo (badge) de unidade e sentido** no canto direito (`[data-e02-mode-unit]`), por exemplo: `cm · dirigido`, `s · dirigido`, `min · não dirigido`, `s · não dirigido`, `m · dirigido`.

### 3.2. Diagrama do Grafo em SVG e Rolagem Horizontal (`.e02-graph-panel`)
À esquerda fica o desenho vetorial (`<svg data-e02-graph viewBox="0 0 1100 580">`) dentro de um contêiner com rolagem horizontal (`.e02-graph-scroll`):
- **Rolagem horizontal**: o SVG tem largura mínima de `900px` (`min-width: 900px`). Em telas menores ou janelas divididas, aparece a instrução abaixo do gráfico: *"Em telas estreitas, arraste ou role horizontalmente para ler o diagrama."* Basta rolar horizontalmente para enxergar todos os nós até a extremidade direita.
- **Como interpretar os Nós (`.e02-node`)**:
  - Cada nó é um retângulo (`132 × 40`) representando um equipamento, estação, setor ou área logística.
  - Se o identificador do nó tiver mais de 17 caracteres (como `Estacao_Inspecao` na vista Busca, que tem 16, ou caso algum nome ultrapasse 17), o rótulo visual no retângulo é truncado nos 16 primeiros caracteres seguido de `…`, mas o nome completo aparece nos seletores e na lista do resultado.
  - **Cor normal**: fundo claro e borda azul (`--blue`).
  - **Nó na rota calculada (`.is-route`)**: fundo esverdeado suave e borda grossa verde-azulada (`--teal`).
  - **Nó bloqueado (`.is-blocked`)**: fundo avermelhado suave e borda tracejada vermelha (`--red`).
- **Como interpretar os Arcos / Arestas (`.e02-edge`)**:
  - Cada linha curva liga dois nós e exibe um rótulo no meio no formato **`<id> · <peso>`** (por exemplo, `a3 · 80` significa aresta `a3` com peso `80` na unidade da vista).
  - **Sentido**: quando o grafo é **`dirigido`** (`Água / copos`, `Busca`, `Materiais`, `Veículos`), a linha possui uma **seta na ponta** (`marker-end="url(#e02-arrow)"`) indicando o único sentido permitido. Quando o grafo é **`não dirigido`** (`Inspeção` e `AGV`), **não há seta**, pois o trecho pode ser percorrido nos dois sentidos.
  - **Aresta na rota calculada (`.is-route`)**: linha mais espessa (`stroke-width: 5`) em verde-azulado (`--teal`). Note que na vista `Materiais` (Kahn) todos os 16 vértices ficam destacados na ordem topológica, mas nenhuma aresta recebe destaque `.is-route` porque Kahn produz uma ordenação de vértices e não um único caminho simples.
  - **Aresta bloqueada (`.is-blocked`)**: linha tracejada vermelha (`--red`), seja porque a própria aresta foi bloqueada, seja porque um de seus nós extremos foi bloqueado.
- **Legenda abaixo do gráfico (`[data-e02-legend]`)**:
  - Mostra sempre três itens: **`aresta`** (cinza), **`rota calculada`** (verde-azulado) e, no terceiro item, **`bloqueio acionável`** (tracejado vermelho, nas 4 vistas que aceitam bloqueios: `Água / copos`, `Busca`, `Inspeção` e `Veículos`) ou **`fonte didática`** (nas 2 vistas sem bloqueios interativos: `AGV` e `Materiais`).

### 3.3. Painel de Controles à Direita (`.e02-controls`)
1. **Seletores de `Origem`, `Destino` ou `Partida` (`[data-e02-selection]`)**:
   - Nas vistas **`Água / copos`**, **`Busca`** e **`Veículos`**, aparecem dois menus `<select>`: **`Origem`** e **`Destino`**.
   - Na vista **`AGV`**, aparece um único menu `<select>`: **`Partida (matriz ilustrativa)`**.
   - Nas vistas **`Inspeção`** e **`Materiais`**, não há menu `<select>`, apenas uma frase explicativa (*"Bloqueie trechos para testar paridade e conectividade."* ou *"A ordenação considera o DAG completo."*).
   - **Atenção ao detalhe de operação**: quando você muda o valor de **`Origem`**, **`Destino`** ou **`Partida`** no menu `<select>`, **é necessário clicar no botão `Calcular`** para atualizar o resultado! O menu `<select>` sozinho não dispara o cálculo automaticamente.
2. **Caixa de `Bloqueios` (`[data-e02-blocks]`)**:
   - Nas vistas **`Água / copos`**, **`Busca`**, **`Inspeção`** e **`Veículos`**, exibe caixas de seleção (`checkbox`) para os nós ou arestas de estudo daquela aula.
   - **Recálculo automático nos bloqueios**: ao marcar ou desmarcar qualquer `checkbox` de bloqueio, a função `run()` é chamada **imediatamente**, sem precisar clicar em `Calcular`.
   - **Clique direto nas arestas do SVG**: nessas mesmas 4 vistas interativas (`water`, `search`, `round`, `vehicles`), todas as arestas do desenho SVG também são botões clicáveis (`role="button"`, `tabindex="0"`). Clicar em uma aresta no SVG alterna o bloqueio daquela aresta e recalcula na hora. Se a aresta tiver um checkbox correspondente na lista lateral (como `a3`, `a4` ou `t1`..`t10`), o checkbox marca/desmarca junto.
   - Nas vistas **`AGV`** e **`Materiais`**, a seção `Bloqueios` mostra a mensagem `"Esta vista não tem bloqueios interativos."` e as arestas do SVG não são clicáveis.
3. **Botões de Ação (`.e02-control-actions`)**:
   - **`Calcular`** (`[data-e02-run]`): executa o algoritmo da vista atual com a `Origem`/`Destino`/`Partida` e os bloqueios ativos, registrando uma nova linha no Diário curto.
   - **`Restaurar vista`** (`[data-e02-reset]`): recarrega a vista atual do zero, limpando todos os bloqueios de nós e arestas, voltando os seletores `Origem`/`Destino` para os valores nominais padrão e recalculando o resultado original.

### 3.4. Painel de `Resultado atual` (`.e02-result`) e `Diário curto` (`.e02-log`)
- **`Resultado atual`**:
  - **Título grande (`[data-e02-result-title]`)**: mostra o número principal ou status (ex.: `270 cm`, `5 arestas por BFS`, `Circuito · 24.5 min`, `NN 280 s → 2-Opt 260 s`, `16 vértices ordenados`, `40 m` ou `Sem rota`).
  - **Frase explicativa (`[data-e02-result]`)**: explica como o algoritmo obteve aquele resultado ou o motivo da falha (`sem rota`, `paridade inválida`, `subgrafo desconexo`, `origem ou destino bloqueado`).
  - **Lista de blocos (`[data-e02-route]`)**: exibe na ordem exata cada vértice do caminho, circuito ou ordenação topológica calculada.
- **`Diário curto`**:
  - Lista ordenada (`<ol data-e02-log>`) que guarda **as últimas 4 ações executadas** na vista atual, sempre colocando o evento mais recente no topo (`1.`).

---

## 4. As Seis Vistas do Simulador: Sequências Exatas de Cliques e Resultados Verificáveis

Abaixo estão os dados, o significado físico/didático e o passo a passo exato de cliques para cada uma das 6 vistas do produto atual.

---

### Vista 1 — `Água / copos · Dijkstra` (Aulas 11, 14 e 15)

- **Código e Título na tela**: `14 / 15` — *Água e copos: menor caminho*
- **Unidade e Tipo**: `cm · dirigido`
- **Algoritmo**: Dijkstra para caminho mínimo com pesos não negativos.
- **O que o grafo representa**:
  - Possui os **9 nós** e **9 conexões dirigidas** modelados na Aula 11:
    - Hidráulica (água): `TK-101_Agua` $\xrightarrow{a1:\,150\text{ cm (XV-101A)}}$ `P-101_BombaA`, `TK-101_Agua` $\xrightarrow{a2:\,150\text{ cm (XV-101B)}}$ `P-102_BombaB`, `P-101_BombaA` $\xrightarrow{a3:\,80\text{ cm (XV-200A)}}$ `MAN-200_Agua`, `P-102_BombaB` $\xrightarrow{a4:\,85\text{ cm (XV-200B)}}$ `MAN-200_Agua`, `MAN-200_Agua` $\xrightarrow{a5:\,40\text{ cm (XV-201)}}$ `DOS-201_Dosador`, `DOS-201_Dosador` $\xrightarrow{a6:\,20\text{ cm (XV-202)}}$ `BIC-202_Bico`, `BIC-202_Bico` $\xrightarrow{a7:\,10\text{ cm (gravidade)}}$ `MESA-000_Index`.
    - Mecânica (copos): `MAG-100_Copos` $\xrightarrow{a8:\,15\text{ cm (cil A)}}$ `MESA-000_Index`, `MESA-000_Index` $\xrightarrow{a9:\,50\text{ cm (cil H)}}$ `EST-500_Saida`.
  - **Por que os menus `Origem` e `Destino` só listam 6 nós?** Conforme explicado na descrição da vista (*"Consulta até o dosador; somente os trechos de água entram no cálculo."*), os menus `<select>` restringem a escolha aos 6 nós hidráulicos (`TK-101_Agua` até `BIC-202_Bico`) para evitar misturar tubulação de água com o transporte mecânico de copos (`MAG-100_Copos`, `MESA-000_Index`, `EST-500_Saida`), embora os 9 nós apareçam desenhados no SVG para preservar a visão completa da Aula 11.

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Nominal (via Bomba A — 270 cm)**:
   - **Cliques**: Abra a aba **`Simulador`** (a vista **`Água / copos · Dijkstra`** já abre selecionada com `Origem = TK-101_Agua`, `Destino = DOS-201_Dosador` e nenhum bloqueio). Se já tiver mexido na tela, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - Título: **`270 cm`**
     - Texto: `TK-101_Agua → DOS-201_Dosador; Dijkstra respeitou direção, pesos e bloqueios.`
     - Rota: `TK-101_Agua` $\to$ `P-101_BombaA` $\to$ `MAN-200_Agua` $\to$ `DOS-201_Dosador` ($150 + 80 + 40 = 270\text{ cm}$, arestas `a1`, `a3`, `a5`).
2. **Cenário de Contingência / Falha na Linha A (desvio via Bomba B — 275 cm)**:
   - **Cliques**: Na seção **Bloqueios**, marque a caixa **`a3 · P-101_BombaA → MAN-200_Agua · 80 cm`** (ou clique diretamente sobre a linha `a3 · 80` no diagrama SVG).
   - **Resultado exibido (imediato)**:
     - Título: **`275 cm`**
     - Texto: `TK-101_Agua → DOS-201_Dosador; Dijkstra respeitou direção, pesos e bloqueios.`
     - Rota: `TK-101_Agua` $\to$ `P-102_BombaB` $\to$ `MAN-200_Agua` $\to$ `DOS-201_Dosador` ($150 + 85 + 40 = 275\text{ cm}$, arestas `a2`, `a4`, `a5`).
3. **Cenário de Falha Dupla ou Bloqueio do Manifold (`Sem rota`)**:
   - **Cliques**: Mantendo `a3` marcado, marque também **`a4 · P-102_BombaB → MAN-200_Agua · 85 cm`** (ou marque **`Nó · MAN-200_Agua`**).
   - **Resultado exibido (imediato)**:
     - Título: **`Sem rota`**
     - Texto: `sem rota. Nenhum caminho é exibido.`
     - Rota: *(vazia — confirma que a redundância das bombas A e B não protege contra falha simultânea nas duas linhas nem contra bloqueio no nó comum `MAN-200_Agua`)*.
4. **Restauração**:
   - **Cliques**: Clique no botão **`Restaurar vista`**. O resultado volta para **`270 cm`**.

---

### Vista 2 — `Busca · BFS · DFS` (Aula 13)

- **Código e Título na tela**: `13 / busca` — *BFS e DFS: saltos e caminhos*
- **Unidade e Tipo**: `s · dirigido`
- **Algoritmos**: **BFS** (Busca em Largura — encontra o caminho com o menor número de arestas/saltos) e **DFS** (Busca em Profundidade — enumera todos os caminhos simples possíveis entre origem e destino, até o limite de segurança de 40 caminhos).
- **O que o grafo representa**:
  - É um **grafo simplificado próprio de 7 nós** da Aula 13 (`Reservatorio`, `Bomba`, `V1`, `V2`, `Envasadora`, `Estacao_Inspecao`, `Empacotadora`) e 7 arestas dirigidas (`b1` a `b7`) com pesos em segundos (`5 s`, `2 s`, `3 s`, `4 s`, `6 s`, `3 s`, `2 s`).
  - **Ponto conceitual importante**: embora as arestas tenham pesos em segundos (`s`), **a BFS ignora completamente os pesos em segundos** e conta apenas o **número de arestas (saltos)**. Como tanto o ramo por `V1` quanto o ramo por `V2` têm exatamente 5 arestas da origem até a `Empacotadora`, a BFS escolhe `V1` porque `V1` foi cadastrada antes na lista de adjacência.

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Nominal (5 saltos por BFS e 2 rotas por DFS)**:
   - **Cliques**: Clique no botão de vista **`Busca · BFS · DFS`** (`#e02-mode-search`). Ele abre com `Origem = Reservatorio` e `Destino = Empacotadora`.
   - **Resultado exibido**:
     - Título: **`5 arestas por BFS`**
     - Texto: `DFS encontrou 2 caminho(s) simples; BFS ignora os pesos em s.`
     - Rota destacada: `Reservatorio` $\to$ `Bomba` $\to$ `V1` $\to$ `Envasadora` $\to$ `Estacao_Inspecao` $\to$ `Empacotadora` (5 arestas: `b1`, `b2`, `b4`, `b6`, `b7`).
     - Diário curto: `BFS: 5 saltos; DFS: 2 caminho(s).`
2. **Bloqueio de `V1` (desvio por `V2`)**:
   - **Cliques**: Em **Bloqueios**, marque **`Nó · V1`**.
   - **Resultado exibido (imediato)**:
     - Título: **`5 arestas por BFS`**
     - Texto: `DFS encontrou 1 caminho(s) simples; BFS ignora os pesos em s.`
     - Rota destacada: `Reservatorio` $\to$ `Bomba` $\to$ `V2` $\to$ `Envasadora` $\to$ `Estacao_Inspecao` $\to$ `Empacotadora`.
3. **Bloqueio simultâneo de `V1` e `V2` (`Sem rota`)**:
   - **Cliques**: Mantendo `Nó · V1` marcado, marque também **`Nó · V2`**.
   - **Resultado exibido (imediato)**:
     - Título: **`Sem rota`**
     - Texto: `sem rota.`
     - Rota: *(vazia)*.
4. **Restauração**:
   - **Cliques**: Clique em **`Restaurar vista`** para voltar a **`5 arestas por BFS`** e `2 caminho(s) simples`.

---

### Vista 3 — `Inspeção · Euler` (Aula 16)

- **Código e Título na tela**: `16 / inspeção` — *Ronda: circuito Euleriano*
- **Unidade e Tipo**: `min · não dirigido`
- **Algoritmo**: Verificação de conectividade + paridade dos graus + **Algoritmo de Hierholzer por ID de aresta**.
- **O que o grafo representa**:
  - Modela a **ronda preventiva não dirigida** do técnico de manutenção por **8 pontos de inspeção** (`PAINEL`, `FRL-001`, `S100`, `S200`, `S300`, `S400`, `S500`, `MESA`) e **10 trechos físicos** (`t1` a `t10`: mangueiras, chicotes de sensores, cabo IO-Link e chicotes do motor/encoder da mesa), com tempos em minutos que somam **24,5 min** (`24.5 min`).
  - No estado nominal, todos os 8 vértices têm **grau par** (`S200` e `S400` têm grau 4; os outros seis têm grau 2) e o grafo é conexo, satisfazendo o **Teorema de Euler** para um circuito fechado sem repetir nenhuma aresta.
  - *(Nota: os outros dois problemas estudados na Aula 16 — a caça a vazamentos na rede pneumática com Carteiro Chinês de 57,8 min e a lavagem CIP dirigida de 20,0 min — estão explicados nos slides e na aba `Arquivos`, pois usam grafos diferentes).*

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Nominal (Circuito Euleriano completo — 24,5 min)**:
   - **Cliques**: Clique no botão de vista **`Inspeção · Euler`** (`#e02-mode-round`).
   - **Resultado exibido**:
     - Título: **`Circuito · 24.5 min`**
     - Texto: `Hierholzer usou 10 IDs uma vez cada.`
     - Rota (11 paradas, começando e terminando em `PAINEL`): `PAINEL` $\to$ `FRL-001` $\to$ `S100` $\to$ `S200` $\to$ `S300` $\to$ `S400` $\to$ `S200` $\to$ `MESA` $\to$ `S400` $\to$ `S500` $\to$ `PAINEL`.
2. **Quebra de Paridade para 2 Vértices Ímpares (Trilha Euleriana aberta)**:
   - **Cliques**: Em **Bloqueios**, marque apenas um trecho, por exemplo **`t9 · S200 — S400 · 2 min`** (ou **`t1 · PAINEL — FRL-001 · 3 min`**).
   - **Resultado exibido (imediato)**:
     - Se marcou `t9`: os nós `S200` e `S400` passam a ter grau 3 (exatamente 2 vértices ímpares). O título muda para **`Trilha · 22.5 min`** (`Hierholzer usou 9 IDs uma vez cada.`), pois ainda existe uma trilha euleriana aberta começando em um vértice ímpar e terminando no outro.
3. **Paridade Inválida (> 2 vértices ímpares) ou Subgrafo Desconexo**:
   - **Cliques**: Com `t9` desmarcado (ou clicando antes em **`Restaurar vista`**), marque **`t1 · PAINEL — FRL-001 · 3 min`** e **`t4 · S200 — S300 · 3 min`** (criando 4 vértices de grau ímpar: `PAINEL`, `FRL-001`, `S200`, `S300`).
   - **Resultado exibido (imediato)**:
     - Título: **`Rota Euleriana indisponível`**
     - Texto: `paridade inválida; não há rota exibida.`
   - *(Bloquear `t1` e `t7` deixa `PAINEL` isolado, mas os oito trechos ativos restantes ainda formam uma **trilha** de `18.5 min`; não é subgrafo desconexo. O resultado **`subgrafo desconexo; não há rota exibida.`** ocorre quando há arestas ativas em componentes separados: por exemplo, bloquear `t2` e `t7` mantém `t1` ativo em um componente e os demais trechos ativos em outro.)*.
4. **Restauração**:
   - **Cliques**: Clique em **`Restaurar vista`** para voltar a **`Circuito · 24.5 min`**.

---

### Vista 4 — `AGV · NN · 2-Opt` (Aula 17)

- **Código e Título na tela**: `17 / AGV` — *Matriz legada: NN e 2-Opt*
- **Unidade e Tipo**: `s · não dirigido`
- **Algoritmos**: Heurística construtiva do **Vizinho Mais Próximo (Nearest Neighbor — NN)** seguida de refinamento por busca local **2-Opt** (que inverte segmentos da rota e aceita apenas trocas que reduzam estritamente o custo total).
- **Cuidado essencial com os nomes dos nós**:
  - Os 6 vértices desta vista (`Lab`, `TK301`, `TK302`, `R101`, `TK303`, `GRAN201`) e as 15 arestas (`g1` a `g15`, grafo completo $K_6$ simétrico em segundos) vêm da **matriz ilustrativa legada do notebook da Aula 17**.
  - **Não diga que `TK301`, `R101` ou `GRAN201` são tags físicas da envasadora de copos!** A própria interface destaca isso no título (*"Matriz legada: NN e 2-Opt"*) e na descrição (*"Rótulos e custos da matriz ilustrativa do notebook; resultado é candidato, não ótimo global."*).
  - Além disso, NN + 2-Opt são **heurísticas**: o resultado de `260 s` é uma **rota candidata melhorada**, e não uma prova matemática de ótimo global para qualquer instância do Problema do Caixeiro-Viajante (TSP).

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Padrão (Partida = `Lab`, melhoria de 280 s para 260 s)**:
   - **Cliques**: Clique no botão de vista **`AGV · NN · 2-Opt`** (`#e02-mode-agv`). Ele já abre com `Partida (matriz ilustrativa) = Lab`.
   - **Resultado exibido**:
     - Título: **`NN 280 s → 2-Opt 260 s`**
     - Texto: `A melhoria aceita apenas troca estritamente melhor; é candidata, não ótimo global.`
     - Rota exibida (após o refinamento 2-Opt): `Lab` $\to$ `TK301` $\to$ `TK302` $\to$ `R101` $\to$ `GRAN201` $\to$ `TK303` $\to$ `Lab` ($45 + 20 + 45 + 40 + 35 + 75 = 260\text{ s}$).
     - *(O Vizinho Mais Próximo inicial fazia `Lab → TK301 → TK302 → R101 → TK303 → GRAN201 → Lab`, que custava $45 + 20 + 45 + 25 + 35 + 110 = 280\text{ s}$ por causa do salto longo final de `GRAN201` até `Lab`; o 2-Opt inverteu `TK303` e `GRAN201`, economizando 20 segundos).*
2. **Testando outra Partida**:
   - **Cliques**: Mude o menu **`Partida (matriz ilustrativa)`** para outro vértice (ex.: `TK301` ou `TK303`); a troca recalcula imediatamente, e o botão **`Calcular`** continua disponível para repetir a consulta. Para voltar ao padrão (`Lab`), clique em **`Restaurar vista`**.

---

### Vista 5 — `Materiais · Kahn` (Aula 18 — Camada de Materiais)

- **Código e Título na tela**: `18 / materiais` — *Precedências: ordenação de Kahn*
- **Unidade e Tipo**: `m · dirigido`
- **Algoritmo**: **Algoritmo de Kahn** para ordenação topológica em um **DAG** (Grafo Acíclico Dirigido).
- **O que o grafo representa**:
  - Possui **16 vértices** e **15 arestas dirigidas** (`m1` a `m15`) representando o fluxo lógico de insumos desde os três recebimentos (`RECEB_COPOS`, `RECEB_AGUA`, `RECEB_TAMPAS`), passando pelos estoques intermediários, entrando nas **cinco estações obrigatórias da envasadora (`E1_DISPENSA` $\to$ `E2_ENVASE` $\to$ `E3_TAMPA` $\to$ `E4_SELAGEM` $\to$ `E5_EJECAO`)**, até `EST-500_Saida` $\to$ `EMBALAGEM` $\to$ `ESTOQUE_PRODUTO` $\to$ `DOCA_EXPEDICAO`.
  - **Cuidado conceitual**: a convergência de arestas no DAG mostra a **ordem de precedência estrutural** (o que precisa vir antes do quê) e confirma que não há ciclos dirigidos no fluxo normal do produto. Porém, **convergência topológica não prova sozinha a disponibilidade simultânea (operação lógica AND) de água, copo, tampa e ar comprimido**, nem substitui a verificação de quarentena/qualidade demonstrada no notebook da Aula 18.

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Único na Vista (16 vértices ordenados mantendo E1–E5)**:
   - **Cliques**: Clique no botão de vista **`Materiais · Kahn`** (`#e02-mode-materials`). Não há seletores nem bloqueios interativos nesta vista.
   - **Resultado exibido**:
     - Título: **`16 vértices ordenados`**
     - Texto: `Kahn ordenou precedências; E1_DISPENSA → E2_ENVASE → E3_TAMPA → E4_SELAGEM → E5_EJECAO (E1–E5) permanece no DAG.`
     - Lista ordenada dos 16 vértices:
       1. `RECEB_AGUA`
       2. `RECEB_COPOS`
       3. `ESTOQUE_COPOS`
       4. `MAG-100_Copos`
       5. `E1_DISPENSA`
       6. `RECEB_TAMPAS`
       7. `ESTOQUE_TAMPAS`
       8. `TK-101_Agua`
       9. `E2_ENVASE`
       10. `E3_TAMPA`
       11. `E4_SELAGEM`
       12. `E5_EJECAO`
       13. `EST-500_Saida`
       14. `EMBALAGEM`
       15. `ESTOQUE_PRODUTO`
       16. `DOCA_EXPEDICAO`

---

### Vista 6 — `Veículos · Dijkstra` (Aula 18 — Camada de Circulação Interna)

- **Código e Título na tela**: `18 / veículos` — *Veículos: menor caminho*
- **Unidade e Tipo**: `m · dirigido`
- **Algoritmo**: Dijkstra sobre o dígrafo de circulação de veículos internos (carrinhos de movimentação).
- **Por que é separado da vista `Materiais`?**
  - Porque um veículo interno circula por **corredores, portaria, recebimento, estoque final, via externa e doca** (`9 vértices` e `14 arestas dirigidas`, `v1` a `v14`), onde existem **vias de mão dupla e ciclos legítimos** (por exemplo, `CORREDOR_A` $\leftrightarrow$ `CORREDOR_B` e o retorno `DOCA_EXPEDICAO` $\to$ `SAIDA` $\to$ `PORTARIA`). Um carrinho não passa por dentro do cilindro dosador ou da prensa térmica!

#### Sequência exata de cliques e resultados verificáveis:
1. **Cenário Nominal (pelos corredores internos — 40 m)**:
   - **Cliques**: Clique no botão de vista **`Veículos · Dijkstra`** (`#e02-mode-vehicles`). Ele abre com `Origem = RECEBIMENTO` e `Destino = DOCA_EXPEDICAO`.
   - **Resultado exibido**:
     - Título: **`40 m`**
     - Texto: `RECEBIMENTO → DOCA_EXPEDICAO; Dijkstra respeitou direção, pesos e bloqueios.`
     - Rota: `RECEBIMENTO` $\to$ `CORREDOR_A` $\to$ `CORREDOR_B` $\to$ `ESTOQUE_FINAL` $\to$ `DOCA_EXPEDICAO` ($10 + 12 + 8 + 10 = 40\text{ m}$, arestas `v2`, `v6`, `v8`, `v10`).
2. **Cenário de Contingência / Corredor B interditado (desvio pela Via Externa — 65 m)**:
   - **Cliques**: Em **Bloqueios**, marque **`Nó · CORREDOR_B`**.
   - **Resultado exibido (imediato)**:
     - Título: **`65 m`**
     - Texto: `RECEBIMENTO → DOCA_EXPEDICAO; Dijkstra respeitou direção, pesos e bloqueios.`
     - Rota: `RECEBIMENTO` $\to$ `VIA_EXTERNA` $\to$ `DOCA_EXPEDICAO` ($30 + 35 = 65\text{ m}$, arestas `v13`, `v14`).
3. **Cenário de Bloqueio Duplo (`CORREDOR_B` + `VIA_EXTERNA` — `Sem rota`)**:
   - **Cliques**: Mantendo `Nó · CORREDOR_B` marcado, marque também **`Nó · VIA_EXTERNA`**.
   - **Resultado exibido (imediato)**:
     - Título: **`Sem rota`**
     - Texto: `sem rota. Nenhum caminho é exibido.`
     - Rota: *(vazia)*.
4. **Restauração**:
   - **Cliques**: Clique em **`Restaurar vista`** para retornar a **`40 m`**.

---

## 5. Resumo Comparativo Rápido das 6 Vistas do Simulador

| Botão da Vista | Aulas | Tipo e Unidade | Algoritmo no JS | Controles na Tela | Resultado Nominal e com Bloqueios |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **`Água / copos`** | 11, 14, 15 | Dirigido · `cm` | `dijkstra()` | `Origem`, `Destino` (6 nós hidráulicos); bloqueios `a3`, `a4`, `MAN-200_Agua` + clique em arestas | Nominal: **`270 cm`** (via A) $\to$ Bloq. `a3`: **`275 cm`** (via B) $\to$ Bloq. `a3`+`a4` ou `MAN-200_Agua`: **`Sem rota`** |
| **`Busca`** | 13 | Dirigido · `s` | `bfs()` + `dfsPaths()` | `Origem`, `Destino` (7 nós); bloqueios `V1`, `V2` + clique em arestas | Nominal: **`5 arestas por BFS`** (`2 caminho(s)` na DFS) $\to$ Bloq. `V1`: **`5 arestas por BFS`** via `V2` (`1 caminho`) $\to$ Bloq. `V1`+`V2`: **`Sem rota`** |
| **`Inspeção`** | 16 | Não dirigido · `min` | `euler()` (Hierholzer por ID) | Sem `<select>`; bloqueios `t1` a `t10` + clique em arestas | Nominal: **`Circuito · 24.5 min`** (10 IDs) $\to$ 1 trecho como `t9` bloqueado: **`Trilha · 22.5 min`** $\to$ >2 ímpares ou desconexo: **`Rota Euleriana indisponível`** |
| **`AGV`** | 17 | Não dirigido · `s` | `nearestNeighbor()` + `twoOpt()` | `Partida (matriz ilustrativa)` (`Lab` padrão); **sem bloqueios** | Nominal (`Lab`): **`NN 280 s → 2-Opt 260 s`** (`Lab → TK301 → TK302 → R101 → GRAN201 → TK303 → Lab`) |
| **`Materiais`** | 18 | Dirigido (DAG) · `m` | `kahn()` | Sem `<select>`; **sem bloqueios** | **`16 vértices ordenados`** preservando `E1_DISPENSA → E2_ENVASE → E3_TAMPA → E4_SELAGEM → E5_EJECAO` |
| **`Veículos`** | 18 | Dirigido · `m` | `dijkstra()` | `Origem`, `Destino` (9 nós); bloqueios `CORREDOR_B`, `VIA_EXTERNA` + clique em arestas | Nominal: **`40 m`** (via Corredores A/B) $\to$ Bloq. `CORREDOR_B`: **`65 m`** (via Externa) $\to$ Bloq. ambos: **`Sem rota`** |

---

## 6. O que NÃO Existe no Simulador (Para Não Inventar Durante a Apresentação)

Para manter rigor técnico total diante do professor, **nunca prometa nem procure na tela** recursos que não fazem parte do escopo estático do simulador:
1. **Não há edição livre de pesos na tela web**: a alteração de peso (como mudar `P-101_BombaA → MAN-200_Agua` de `80 cm` para `100 cm` na Aula 14, ou converter metros para minutos na Aula 18) existe e está validada **nos notebooks Python**, mas no simulador HTML/JS os grafos são imutáveis (`Object.freeze`) e a interação ocorre por seleção de terminais e bloqueio/restauração.
2. **Não há botões de "presets de falha" automáticos nem simulação temporal/animação**: os bloqueios são marcados manualmente pelo usuário nos checkboxes (ou clicando nas arestas do SVG).
3. **Não há comunicação com CLP, SCADA real ou Automation Studio**: o cálculo das 6 vistas ocorre localmente no navegador sem backend; porém, note que na aba **`Arquivos`** os botões `Abrir roteiro` e `Abrir notebook` das Aulas 11 a 18 (assim como o link do rodapé) apontam para URLs externas do GitHub (`https://github.com/...`, exigindo internet apenas se você clicar para sair da página), enquanto `Abrir README` usa caminho relativo local (`../etapa-02-grafos/README.md`). Além disso, os estilos em `doc/css/etapa-02.css` usam a regra moderna `@scope`, portanto utilize um navegador atualizado compatível (Chrome, Edge ou Firefox recente).
4. **Não há garantia de ótimo global no AGV**: o 2-Opt melhora a solução gulosa do Vizinho Mais Próximo (`280 s → 260 s`), mas continua sendo uma heurística local.

---

## 7. Mini Glossário para Estudantes Iniciantes

- **Vértice (ou Nó)**: cada ponto do grafo (representado por um retângulo no diagrama), como um tanque (`TK-101_Agua`), uma bomba (`P-101_BombaA`), uma estação da máquina (`E1_DISPENSA`) ou um corredor (`CORREDOR_A`).
- **Aresta / Arco**: a ligação entre dois vértices. Quando tem sentido obrigatório (seta), costuma ser chamada de **arco** (em um **dígrafo**); quando pode ser percorrida nos dois sentidos (sem seta), é uma **aresta não dirigida**.
- **Ponte vs. Vértice de Articulação**: uma **ponte** é uma **aresta** cuja remoção interrompe a conectividade (por exemplo, o trecho único `a5: MAN-200_Agua → DOS-201_Dosador` ou `DOS-201_Dosador → BIC-202_Bico`); já um **vértice de articulação (nó crítico)** é um **vértice** cuja remoção/bloqueio desconecta o caminho entre origem e destino (como o nó `MAN-200_Agua`).
- **Peso (Custo)**: o número associado a cada aresta (`cm`, `m`, `s` ou `min`). Só faz sentido somar pesos quando todas as arestas do grafo estão na mesma unidade e são não negativas.
- **Grau de um Vértice**: em um grafo não dirigido (como na `Inspeção`), é o número de arestas conectadas ao vértice. Em um dígrafo, divide-se em **grau de entrada ($\deg^-$)** (quantas setas chegam) e **grau de saída ($\deg^+$)** (quantas setas saem).
- **Matriz de Incidência ($B$), Adjacência ($A$) e Custos ($W$)** *(Aula 12)*: três formas matriciais de representar o mesmo grafo. $B$ ($n \times m$, com $-1, 0, +1$) representa quem sai e quem entra em cada aresta e é usada no modelo didático da Aula 12 para equacionar o balanço de ar ($B\vec{Q} = \vec{S}$) e calcular um **resíduo de vazamento simulado** (que não é telemetria real de planta); $A$ ($n \times n$, com $0$ e $1$) mostra quem se conecta a quem; $W$ ($n \times n$) guarda os custos das conexões diretas ($\infty$ quando não há ligação).
- **BFS (*Breadth-First Search* — Busca em Largura)**: explora o grafo por camadas usando uma fila (FIFO). Encontra o caminho com o **menor número de arestas (saltos)**, ignorando os pesos numéricos.
- **DFS (*Depth-First Search* — Busca em Profundidade)**: avança até o fim de cada ramo antes de retroceder (*backtracking*). No simulador, é usada para listar todos os caminhos simples possíveis sem repetir vértices.
- **Algoritmo de Dijkstra**: encontra o caminho de **menor soma de pesos** desde a origem até o destino, exigindo que todos os pesos sejam finitos e **não negativos** ($\ge 0$).
- **Circuito Euleriano e Trilha Euleriana**: um passeio que percorre **cada aresta exatamente uma vez**. Se começa e termina no mesmo vértice, é um **circuito euleriano** (exige grafo conexo e todos os vértices com grau par). Se começa em um vértice e termina em outro, é uma **trilha euleriana** (ocorre quando há exatamente 2 vértices de grau ímpar). O **Algoritmo de Hierholzer** constrói esse percurso em tempo linear $O(|E|)$.
- **Ciclo Hamiltoniano e TSP (Caixeiro-Viajante)**: diferente de Euler (que foca nas *arestas*), o ciclo hamiltoniano exige visitar **cada vértice exatamente uma vez** e voltar à origem. Encontrar o de menor custo (TSP) é um problema NP-difícil, resolvido na prática com heurísticas como **Vizinho Mais Próximo (NN)** e **2-Opt**.
- **DAG (*Directed Acyclic Graph* — Grafo Acíclico Dirigido)**: um dígrafo sem nenhum ciclo fechado. Representa precedências (etapas que dependem de outras).
- **Ordenação Topológica (Algoritmo de Kahn)**: coloca os vértices de um DAG em uma fila linear onde toda etapa aparece depois de todos os seus pré-requisitos.

---

## 8. Perguntas Típicas do Professor e Respostas Curtas Baseadas nas Fontes

1. **"Por que na vista Busca (Aula 13) as arestas têm pesos em segundos, mas a BFS escolhe V1 dizendo '5 arestas por BFS'?"**
   - **Resposta**: Porque a BFS usa uma fila por camadas e minimiza apenas a **quantidade de arestas (saltos)**, ignorando os pesos em segundos. Para minimizar a soma de pesos não negativos, o algoritmo correto é o **Dijkstra** (visto nas Aulas 14, 15 e 18).
2. **"E se houvesse um peso negativo na rede da Aula 14? O Dijkstra funcionaria?"**
   - **Resposta**: Não. A prova de correção do Dijkstra depende de que adicionar uma aresta nunca diminua a distância já acumulada. Por isso, tanto o notebook da Aula 14 quanto o simulador rejeitam pesos negativos; se existissem pesos negativos, seria necessário usar um algoritmo como Bellman-Ford.
3. **"Se vocês têm duas bombas em paralelo (P-101 e P-102) na vista Água/copos, por que a máquina ainda pode ficar 'Sem rota'?"**
   - **Resposta**: Por dois motivos topológicos: primeiro, se houver falha simultânea nas duas arestas de entrada (`a3` e `a4`); segundo, porque as duas bombas convergem para um único **vértice de articulação (nó crítico)**, o `MAN-200_Agua`, seguido por uma **ponte (aresta crítica)** `a5` (`MAN-200_Agua → DOS-201_Dosador`). Bloquear o nó crítico `MAN-200_Agua` ou a aresta ponte `a5` corta todas as rotas até o dosador.
4. **"Qual a diferença prática entre o problema da Aula 16 (Inspeção/Euler) e o da Aula 17 (AGV/Hamiltoniano)?"**
   - **Resposta**: Na Aula 16 (Euler), o objetivo é inspecionar **todas as arestas (mangueiras e chicotes)** uma única vez, podendo passar mais de uma vez pelo mesmo nó; isso tem critério exato e rápido em $O(|V|+|E|)$ (conectividade e graus pares). Na Aula 17 (Hamiltoniano/TSP), o objetivo é visitar **todos os vértices (pontos de coleta)** uma única vez; é um problema NP-difícil, no qual usamos a heurística do Vizinho Mais Próximo (`280 s`) refinada pelo 2-Opt (`260 s`) sobre a matriz ilustrativa do notebook.
5. **"Por que na Aula 16 a ronda no simulador dá 24,5 min sem repetir trechos, enquanto a caça a vazamentos no notebook dá 57,8 min?"**
   - **Resposta**: Porque são dois grafos diferentes. A ronda preventiva (8 nós, 10 trechos) é formada por dois anéis acoplados onde todos os nós têm grau par, permitindo um circuito euleriano puro de `24,5 min`. Já a rede pneumática de caça a vazamentos tem 10 cilindros terminais de grau 1 (ímpares); pelo Problema do Carteiro Chinês, o técnico precisa repetir a ida e a volta nas mangueiras terminais (`21,4 min` extras sobre `36,4 min`, totalizando `57,8 min`).
6. **"Por que a Aula 18 separa o grafo de Materiais (Kahn) do grafo de Veículos (Dijkstra)?"**
   - **Resposta**: Porque eles respondem perguntas com regras topológicas opostas. O fluxo de transformação do produto (`Materiais`) não pode voltar para trás nem pular as estações `E1_DISPENSA` a `E5_EJECAO`, logo precisa ser um **DAG** validado pela ordenação topológica de Kahn. Já a circulação de carrinhos (`Veículos`) ocorre em corredores de mão dupla e anéis de retorno à portaria, que possuem **ciclos legítimos** onde o algoritmo de Kahn falharia, mas o Dijkstra calcula o menor caminho normalmente (`40 m` pelo Corredor B ou `65 m` pela Via Externa).
7. **"O DAG de materiais convergir em E2 e E3 garante que a máquina pode produzir o copo?"**
   - **Resposta**: Não. A convergência de arestas no DAG mostra apenas de onde vêm a água (`TK-101_Agua → E2_ENVASE`) e a tampa (`ESTOQUE_TAMPAS → E3_TAMPA`). Ela não substitui uma condição lógica `AND` de disponibilidade simultânea de estoque nem os permissivos e sensores do controle da máquina.
