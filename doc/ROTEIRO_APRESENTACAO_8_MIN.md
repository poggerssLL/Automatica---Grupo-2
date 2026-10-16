# Roteiro de Apresentação de 8 Minutos — Etapa 02 (Teoria dos Grafos)

Este roteiro foi desenhado para **quatro integrantes** (`Integrante 1`, `Integrante 2`, `Integrante 3` e `Integrante 4`), com **8 minutos exatos (`00:00` a `08:00`, 480 segundos)** divididos em **quatro blocos equilibrados de 2 minutos (`120 segundos` cada)**.

Ele percorre **todos os 10 slides reais** da aba `Apresentação` (`01 / 10` a `10 / 10`), mantém a **linha narrativa central na envasadora de copos (`E1` a `E5`)** e realiza **três demonstrações enxutas na aba `Simulador`**, reservando entre **17 e 19 segundos por bloco** para cliques, trocas de abas e leitura visual da tela sem correria.

> **Nota sobre estimativa versus cronometragem real:**
> Os tempos e ritmos abaixo são **estimativas calculadas** com base na contagem exata por código das falas (**204 a 211 palavras por integrante**, totalizando **828 palavras** nos 8 minutos), o que exige **101 a 103 segundos de fala ativa** por bloco (cadência confortável de **120 a 125 palavras/minuto**, ou **94,2 a 97,4 segundos** se falado a 130 palavras/minuto) mais **17 a 19 segundos de operação de tela e transição**. **Não houve ensaio humano cronometrado** nesta etapa; a Seção 6 traz o protocolo de ensaio com cronômetro e cortes prontos caso necessário.

---

## 1. Preparação Antes de Começar (Checklist de Navegador, Zoom, Tema e Operação)

1. **Quem opera o computador (Regra do Operador Único)**:
   - Escolha **um único integrante** para operar o mouse/teclado durante os 8 minutos, ou combine que o orador da vez faça apenas os cliques indicados nas linhas **`[AÇÃO DE TELA]`**. Evitem duas pessoas disputando o cursor.
2. **Navegador compatível e comportamento local vs. links externos**:
   - Abra o arquivo local `doc/etapa-02-grafos.html` em um navegador atualizado com suporte a CSS `@scope` (**Chrome, Edge ou Firefox recente**).
   - As abas **`Apresentação`** e **`Simulador`** (assim como a leitura dos cartões da aba **`Arquivos`**) funcionam localmente no navegador sem backend. **Atenção**: não clique nos botões `Abrir roteiro` ou `Abrir notebook` da aba `Arquivos` (nem no link do rodapé) durante a apresentação, pois esses links apontam para URLs externas do GitHub (`https://github.com/...`) e dependeriam de internet.
   - Deixe uma **segunda aba do navegador** já aberta no mesmo arquivo local posicionada na aba **`Simulador`** como contingência.
3. **Tema e Zoom recomendados para projetor/TV**:
   - **Tema**: em salas claras ou projetores, mantenha o **tema claro (`light`, padrão)** para máximo contraste dos rótulos (`a3 · 80`) e das rotas em verde-azulado (`--teal`). Em TVs/monitores escuros, teste previamente o botão **`◐`** (`Alternar tema`) no topo direito.
   - **Zoom**: ajuste entre **`100%` e `110%`** (`Ctrl + 0` ou `Ctrl + +`) em tela cheia (`F11`), conferindo na aba `Simulador` se o diagrama SVG à esquerda e a coluna `Bloqueios` à direita cabem lado a lado.
4. **Estado inicial obrigatório antes do segundo `00:00`**:
   - Na aba **`Simulador`**, clique em **`Água / copos · Dijkstra`** e em **`Restaurar vista`** para limpar qualquer bloqueio anterior.
   - Volte para a aba **`Apresentação`** e clique no botão **`01`** do deck para deixar o slide **`01 / 10 — Abertura`** na tela.

---

## 2. Mapa Geral dos 8 Minutos (480 Segundos)

Para evitar excesso de cliques e idas e vindas entre abas, a apresentação percorre os slides iniciais na aba `Apresentação`, entra no `Simulador` para **3 demonstrações escolhidas** e retorna à aba `Apresentação` para o fechamento:

| Bloco | Quem Fala | Janela Cumulativa | Duração | Percurso de Slides e Demonstrações | Tempo de Fala vs. Cliques/Pausas |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Integrante 1** | `00:00 – 02:00` | `120 s` | Aba `Apresentação`: Slides **`01` (Abertura)**, **`11` (Aula 11)** e **`12` (Aula 12)** | `102 s` de fala + `18 s` de cliques/transição |
| **2** | **Integrante 2** | `02:00 – 04:00` | `120 s` | Aba `Apresentação`: Slides **`13`**, **`14`** e **`15`** $\to$ Aba `Simulador`: **Demo 1 — `Água / copos`** (`270 cm` $\to$ `275 cm` $\to$ `Sem rota`) | `102 s` de fala + `18 s` de cliques/demo |
| **3** | **Integrante 3** | `04:00 – 06:00` | `120 s` | Aba `Apresentação`: Slides **`16`** e **`17`** $\to$ Aba `Simulador`: **Demo 2 — `Inspeção · Euler`** (`24.5 min` $\to$ `Trilha · 22.5 min`) e leitura visual de **`AGV`** (`280 s → 260 s`) | `101 s` de fala + `19 s` de cliques/demo |
| **4** | **Integrante 4** | `06:00 – 08:00` | `120 s` | Aba `Simulador`: **Demo 3 — `Materiais · Kahn`** (`16 nós`) e **`Veículos · Dijkstra`** (`40 m` $\to$ `65 m`) $\to$ Aba `Apresentação`: Slides **`18`** e **`Σ` (Síntese)** | `103 s` de fala + `17 s` de cliques/fecho |
| **Total** | **4 Integrantes** | **`00:00 – 08:00`** | **`480 s`** | **Todos os 10 slides (`01` a `Σ`) + 3 blocos de demo no Simulador** | **`408 s` de fala + `72 s` de operação/pausas** |

---

## 3. Roteiro Palavra por Palavra e Ações de Tela

> **Convenção deste roteiro:**
> - Tudo o que está em blocos **`[AÇÃO DE TELA]`** e **`[TRANSIÇÃO]`** são instruções silenciosas de operação — **não devem ser lidas em voz alta**.
> - Tudo o que está entre **aspas duplas (`"..."`)** nos blocos **`Fala`** é o texto exato que o integrante deve dizer, com janela de tempo proporcional ao número de palavras de cada segmento.

---

### BLOCO 1 — Integrante 1 (`00:00` a `02:00` | 120 segundos)
**Objetivo do bloco**: Contextualizar a envasadora (`E1` a `E5`), as três abas do portal e a modelagem em grafos e matrizes das Aulas 11 e 12 (Slides `01`, `11` e `12`).

- **`00:00 – 00:04` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Tela na aba **`Apresentação`**, slide **`01 / 10 · Abertura`** (`Os cinco postos em uma leitura de grafo.`), apontando com o cursor para `E1 → E2 → E3 → E4 → E5` e para o resumo `03 abas · 17 arquivos · 06 vistas`.
- **`00:04 – 00:40` (`36 s`) · `73 palavras` — Fala de Integrante 1 (Segmento 1 — Slide `01 / 10 · Abertura`)**:
  > "Bom dia, professor e colegas. Somos o Grupo 2 e apresentamos a Etapa 02 do projeto Aqua Index, aplicando Teoria dos Grafos à envasadora pneumática de água em copos. No slide de abertura, vemos as cinco estações da mesa indexadora: dispensa em E1, envase em E2, tampa em E3, termosselagem em E4 e ejeção em E5. Organizamos o portal em três abas: dez slides, dezessete arquivos mapeados e o simulador com seis vistas."
- **`00:40 – 00:45` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`11`** (ou **`Próximo`**) para exibir o slide **`02 / 10 · Aula 11`** (`Nove conexões organizam água e copos.` / `TK ── A 270 cm / B 275 cm ── DOS`).
- **`00:45 – 01:17` (`32 s`) · `63 palavras` — Fala de Integrante 1 (Segmento 2 — Slide `02 / 10 · Aula 11`)**:
  > "No slide da Aula 11, modelamos a planta como um dígrafo ponderado de nove conexões em centímetros, destacando conectividade e redundância. O manifold de água possui grau de entrada dois porque recebe tanto a Bomba A, com oitenta centímetros, quanto a Bomba B reserva, com oitenta e cinco centímetros. Além disso, separamos os trechos hidráulicos até o dosador do transporte mecânico dos copos."
- **`01:17 – 01:22` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`12`** (ou **`Próximo`**) para exibir o slide **`03 / 10 · Aula 12`** (`Matrizes revelam estrutura e custo.` / `B   A   W  ·  13 × 13`).
- **`01:22 – 01:56` (`34 s`) · `68 palavras` — Fala de Integrante 1 (Segmento 3 — Slide `03 / 10 · Aula 12`)**:
  > "No slide da Aula 12, descrevemos a rede pneumática treze por treze com as matrizes de incidência B, adjacência A e custos W. A matriz B tem posto doze, identifica o anel de equalização entre as ilhas A e B, equaciona o balanço de ar e calcula um resíduo de vazamento simulado no modelo. Já o ciclo separado da mesa aponta a selagem como gargalo. Passo a palavra."
- **`01:56 – 02:00` (`4 s`) — `[TRANSIÇÃO 1 → 2]`**:
  - `Integrante 1` passa a vez ao `Integrante 2`, que clica no botão **`13`** para abrir o slide **`04 / 10 · Aula 13`**.

---

### BLOCO 2 — Integrante 2 (`02:00` a `04:00` | 120 segundos)
**Objetivo do bloco**: Apresentar buscas (BFS/DFS na Aula 13) e menor caminho (Dijkstra nas Aulas 14 e 15), percorrendo os Slides `13`, `14` e `15` e executando a **Demo 1** no `Simulador` (vista **`Água / copos · Dijkstra`**).

- **`02:00 – 02:30` (`30 s`) · `63 palavras` — Fala de Integrante 2 (Segmento 1 — Slide `04 / 10 · Aula 13`)**:
  > "Obrigado. No slide da Aula 13, comparamos Busca em Largura e Busca em Profundidade na rede simplificada com bifurcação entre V1 e V2. A BFS explora por camadas e garante o menor número de arestas, chegando à empacotadora em cinco saltos sem usar os pesos em segundos. Já a DFS enumera os dois caminhos simples e desvia por V2 quando V1 é bloqueada."
- **`02:30 – 02:35` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`14`** (`05 / 10 · Aula 14`: `270 cm  →  275 cm  →  sem rota`), pausar brevemente e clicar no botão **`15`** (`06 / 10 · Aula 15`: `P-101 ×  →  P-102  →  MAN`).
- **`02:35 – 02:59` (`24 s`) · `49 palavras` — Fala de Integrante 2 (Segmento 2 — Slides `05 / 10 · Aula 14` e `06 / 10 · Aula 15`)**:
  > "Para minimizar comprimentos não negativos em centímetros, avançamos aos slides das Aulas 14 e 15 com Dijkstra. Do tanque TK-101 até o dosador DOS-201, a rota nominal pela Bomba A soma duzentos e setenta centímetros, e pela Bomba B soma duzentos e setenta e cinco. Vamos demonstrar no simulador."
- **`02:59 – 03:04` (`5 s`) — `[AÇÃO DE TELA — Entrada no Simulador]`**:
  - Clicar na aba **`Simulador 6 vistas`**. A vista **`Água / copos · Dijkstra`** já abre exibindo **`270 cm`** pela Bomba A.
- **`03:04 – 03:28` (`24 s`) · `50 palavras` — Fala de Integrante 2 (Segmento 3 — Demo Nominal e Bloqueio `a3`)**:
  > "Na vista Água e copos, vemos em verde a rota nominal de duzentos e setenta centímetros pela Bomba A. Marcando na coluna de bloqueios o trecho a3, entre a Bomba A e o manifold, o Dijkstra recalcula imediatamente o desvio pela Bomba B com duzentos e setenta e cinco centímetros."
- **`03:28 – 03:33` (`5 s`) — `[AÇÃO DE TELA — Bloqueios em Água / copos]`**:
  - Marcar o checkbox **`a3 · P-101_BombaA → MAN-200_Agua · 80 cm`** (exibe **`275 cm`**) e logo em seguida marcar **`a4 · P-102_BombaB → MAN-200_Agua · 85 cm`** (exibe **`Sem rota`**).
- **`03:33 – 03:57` (`24 s`) · `47 palavras` — Fala de Integrante 2 (Segmento 4 — Falha Dupla, Vértice de Articulação e Restauração)**:
  > "Se bloquearmos também o trecho a4, ou o próprio manifold que é um vértice de articulação antes da ponte até o dosador, o painel informa sem rota. Clicando em Restaurar vista, voltamos aos duzentos e setenta centímetros nominais. Passo a palavra para inspeção e roteamento de AGV."
- **`03:57 – 04:00` (`3 s`) — `[AÇÃO DE TELA E TRANSIÇÃO 2 → 3]`**:
  - Clicar em **`Restaurar vista`** (`270 cm`), voltar à aba **`Apresentação`** e clicar no botão **`16`** (`07 / 10 · Aula 16`). `Integrante 3` assume.

---

### BLOCO 3 — Integrante 3 (`04:00` a `06:00` | 120 segundos)
**Objetivo do bloco**: Explicar problemas Eulerianos (Aula 16) e Hamiltonianos/TSP (Aula 17) nos Slides `16` e `17`, e mostrar a **Demo 2** no `Simulador` (`Inspeção · Euler` e leitura direta de `AGV · NN · 2-Opt`).

- **`04:00 – 04:32` (`32 s`) · `65 palavras` — Fala de Integrante 3 (Segmento 1 — Slide `07 / 10 · Aula 16`)**:
  > "Continuando no slide da Aula 16, o objetivo agora é percorrer os dez trechos de chicotes e mangueiras exatamente uma vez na ronda preventiva. Pelo Teorema de Euler, um grafo não dirigido conexo possui circuito fechado se todos os vértices têm grau par. Nos arquivos também documentamos a caça a vazamentos por Carteiro Chinês, de cinquenta e sete vírgula oito minutos, e o CIP dirigido."
- **`04:32 – 04:37` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`17`** (`08 / 10 · Aula 17`: `NN 280 s  →  2-Opt 260 s`).
- **`04:37 – 05:01` (`24 s`) · `48 palavras` — Fala de Integrante 3 (Segmento 2 — Slide `08 / 10 · Aula 17`)**:
  > "No slide da Aula 17 contrastamos Euler, que cobre arestas, com o ciclo hamiltoniano do Caixeiro-Viajante, que visita cada vértice uma única vez. Como o problema é NP-difícil, aplicamos na matriz ilustrativa legada do notebook a heurística do Vizinho Mais Próximo refinada pelo 2-Opt. Vamos abrir o simulador."
- **`05:01 – 05:07` (`6 s`) — `[AÇÃO DE TELA — Vista Inspeção · Euler]`**:
  - Clicar na aba **`Simulador 6 vistas`** e selecionar **`Inspeção · Euler`** (exibe **`Circuito · 24.5 min`**).
- **`05:07 – 05:32` (`25 s`) · `56 palavras` — Fala de Integrante 3 (Segmento 3 — Demo de Inspeção Euleriana)**:
  > "Na vista Inspeção, os oito pontos têm grau par e o algoritmo de Hierholzer constrói um circuito fechado de vinte e quatro vírgula cinco minutos, usando cada ID de trecho uma vez. Bloqueando o trecho t9 entre S200 e S400, surgem dois vértices ímpares e obtemos uma trilha aberta de vinte e dois vírgula cinco minutos."
- **`05:32 – 05:38` (`6 s`) — `[AÇÃO DE TELA — Bloqueio t9, Restauração e Clique em AGV]`**:
  - Marcar **`t9 · S200 — S400 · 2 min`** (`Trilha · 22.5 min`), clicar em **`Restaurar vista`** e clicar na vista **`AGV · NN · 2-Opt`** (`NN 280 s → 2-Opt 260 s`).
- **`05:38 – 05:58` (`20 s`) · `42 palavras` — Fala de Integrante 3 (Segmento 4 — Leitura do AGV e Passagem)**:
  > "Já na vista AGV, partindo do laboratório na matriz ilustrativa do notebook, o Vizinho Mais Próximo calcula duzentos e oitenta segundos, e o 2-Opt inverte os dois últimos pontos para uma rota candidata de duzentos e sessenta segundos. Passo para a logística."
- **`05:58 – 06:00` (`2 s`) — `[TRANSIÇÃO 3 → 4]`**:
  - `Integrante 4` assume já na aba **`Simulador`** e clica no quinto botão de vista: **`Materiais · Kahn`**.

---

### BLOCO 4 — Integrante 4 (`06:00` a `08:00` | 120 segundos)
**Objetivo do bloco**: Mostrar no `Simulador` a **Demo 3** da Aula 18 (`Materiais · Kahn` e `Veículos · Dijkstra`), retornar à aba `Apresentação` nos Slides `18` e `Σ (Síntese)` e encerrar com os limites metodológicos.

- **`06:00 – 06:28` (`28 s`) · `57 palavras` — Fala de Integrante 4 (Segmento 1 — Demo de `Materiais · Kahn`)**:
  > "Obrigado. Na Aula 18 separamos o fluxo de materiais da circulação de veículos. Aqui na vista Materiais temos um grafo acíclico dirigido com dezesseis vértices e quinze arestas, ligando os recebimentos de água, copos e tampas até a expedição. O algoritmo de Kahn ordena as precedências mantendo obrigatoriamente a cadeia das estações E1 a E5 no DAG."
- **`06:28 – 06:32` (`4 s`) — `[AÇÃO DE TELA — Troca para Veículos · Dijkstra]`**:
  - Clicar no sexto botão de vista: **`Veículos · Dijkstra`** (exibe **`40 m`** pelos corredores A e B).
- **`06:32 – 06:58` (`26 s`) · `51 palavras` — Fala de Integrante 4 (Segmento 2 — Demo de `Veículos · Dijkstra`)**:
  > "Na vista Veículos, o grafo admite corredores de mão dupla e ciclos legítimos de retorno. O Dijkstra encontra o menor caminho do recebimento até a doca em quarenta metros pelos corredores A e B sem bloqueios. Bloqueando o Corredor B, o veículo desvia pela via externa com sessenta e cinco metros."
- **`06:58 – 07:07` (`9 s`) — `[AÇÃO DE TELA — Bloqueio em Veículos e Retorno aos Slides 18 e Σ]`**:
  - Marcar **`Nó · CORREDOR_B`** (exibe **`65 m`**), clicar em **`Restaurar vista`** (`40 m`), voltar à aba **`Apresentação`**, clicar no botão **`18`** (`09 / 10 · Aula 18`) por 2 segundos e clicar no botão **`Σ`** (`10 / 10 · Síntese`).
- **`07:07 – 07:56` (`49 s`) · `96 palavras` — Fala de Integrante 4 (Segmento 3 — Slides `09 / 10 · Aula 18` e `10 / 10 · Síntese`)**:
  > "Fechando nos slides da Aula 18 e de Síntese, consolidamos as oito aulas mostrando que cada pergunta exige o modelo adequado: matrizes para a rede pneumática, BFS e DFS para buscas, Dijkstra para menor caminho, Hierholzer para inspeção de arestas, heurísticas 2-Opt para visita de vértices e Kahn para precedências. Como limite metodológico, ressaltamos que os seis grafos são modelos didáticos independentes executados localmente no navegador e validados por testes, portanto não enviam comandos reais ao CLP ou ao Automation Studio nem substituem intertravamentos físicos. Muito obrigado pela atenção, professor, e estamos à disposição para perguntas."
- **`07:56 – 08:00` (`4 s`) — `[FINALIZAÇÃO]`**:
  - Permanecer no slide **`10 / 10 · Síntese`** (`Seis modelos, perguntas delimitadas.`) aguardando as perguntas do professor.

---

## 4. Tabela de Validação: Contagem Exata de Palavras por Código, Segmentos e Tempos

A tabela abaixo reflete a contagem exata obtida pelo script de verificação (`count-script.py`) sobre todas as linhas de fala (`> "..."`) dos Blocos 1 a 4:

| Integrante | Palavras por Segmento | Total de Palavras | Tempo a 130 ppm | Tempo de Fala Alocado (~122 ppm) | Tempo de Cliques / Transições | Tempo Total do Bloco | Intervalos Contíguos | Slides e Vistas no Bloco |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Integrante 1** | `73 + 63 + 68` | **204 palavras** | `94,2 s` | `102 s` (`1,70 min`) | `18 s` | **`120 s` (`2:00`)** | `7` | Slides `01`, `11` e `12` |
| **Integrante 2** | `63 + 49 + 50 + 47` | **209 palavras** | `96,5 s` | `102 s` (`1,70 min`) | `18 s` | **`120 s` (`2:00`)** | `8` | Slides `13`, `14`, `15` + Demo 1: `Água / copos` |
| **Integrante 3** | `65 + 48 + 56 + 42` | **211 palavras** | `97,4 s` | `101 s` (`1,68 min`) | `19 s` | **`120 s` (`2:00`)** | `8` | Slides `16`, `17` + Demo 2: `Inspeção` e `AGV` |
| **Integrante 4** | `57 + 51 + 96` | **204 palavras** | `94,2 s` | `103 s` (`1,72 min`) | `17 s` | **`120 s` (`2:00`)** | `6` | Demo 3: `Materiais` e `Veículos` + Slides `18` e `Σ` |
| **TOTAL GRUPO** | **14 segmentos de fala** | **828 palavras** | **`382,3 s`** | **`408 s` (`6,80 min`)** | **`72 s` (`1,20 min`)** | **`480 s` (`8:00`)** | **`29`** | **10 slides (`01` a `Σ`) + 3 demos no Simulador** |

---

## 5. Plano Alternativo se a Demonstração Falhar (Plano de Contingência)

1. **Caso 1 — Dificuldade de clicar no touchpad da bancada durante a demo**:
   - **Solução**: Use exclusivamente as **caixas de seleção (`checkbox`) da coluna direita `Bloqueios`** (`a3`, `a4`, `t9`, `Nó · CORREDOR_B`), que têm área clicável ampla e recalculam sem precisar clicar em `Calcular`.
2. **Caso 2 — Diagrama SVG cortado na lateral direita em projetor de menor resolução**:
   - **Solução**: Reduza um nível de zoom (`Ctrl + -`, `90%`) ou arraste a barra de rolagem horizontal (`.e02-graph-scroll`) abaixo do grafo.
3. **Caso 3 — Falha na aba do simulador**:
   - **Solução**: Alterne para a segunda aba local pré-aberta ou apresente diretamente pelos **10 slides da aba `Apresentação`**, pois cada slide exibe na faixa inferior (`data-viz`) os mesmos resultados numéricos (`270 cm → 275 cm → sem rota`, `10 trechos · 24,5 min`, `NN 280 s → 2-Opt 260 s`, `recebimentos → E1–E5 → expedição`).

---

## 6. Guia de Ensaio Rápido e Cortes Priorizados (Caso Passem de 8 Minutos no Treino)

Realizem **dois ensaios cronometrados** antes da apresentação (meta de passagem: `02:00`, `04:00`, `06:00` e `08:00`), acionando cada clique nos últimos 2 segundos da fala anterior. Caso o grupo fale mais devagar que 115 palavras/minuto e ultrapasse `08:00`, apliquem estes cortes na ordem abaixo:

1. **Corte Prioritário 1 (Bloco 3 — economiza ~9 s e 2 cliques)**:
   - Na vista **`Inspeção · Euler`**, **não marque o checkbox `t9`**; mostre apenas o resultado nominal aberto (`Circuito · 24.5 min`) e passe direto para a vista **`AGV`**.
2. **Corte Prioritário 2 (Bloco 1 — economiza ~8 s)**:
   - No Slide `12` (Aula 12), resuma o final para: *"A matriz B tem posto doze, equaciona o balanço com o anel de equalização e calcula um resíduo de vazamento simulado, enquanto o ciclo da mesa aponta a selagem como gargalo."*
3. **Corte Prioritário 3 (Bloco 4 — economiza ~8 s)**:
   - Na vista **`Materiais · Kahn`**, diga apenas: *"Na vista Materiais, o algoritmo de Kahn ordena os dezesseis vértices do DAG preservando a sequência E1 a E5."*
