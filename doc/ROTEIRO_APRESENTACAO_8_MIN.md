# Roteiro de Apresentação de 8 Minutos — Etapa 02 (Teoria dos Grafos)

Este roteiro foi desenhado para **quatro integrantes** (`Integrante 1`, `Integrante 2`, `Integrante 3` e `Integrante 4`), com a **meta planejada de 8 minutos (`00:00` a `08:00`, 480 segundos estimados no total)**, divididos em **quatro blocos equilibrados de 2 minutos (`120 segundos` cada)**.

Ele estabelece uma **separação funcional estrita entre teoria e simulação**:
1. **Integrantes 1, 2 e 3 explicam exclusivamente a teoria** da Etapa 02 (Aulas 11 a 18) com falas baseadas nos **dez slides reais** da aba **`Apresentação`** (`01 / 10` a `10 / 10`). **Nenhum dos três primeiros opera ou toca no simulador**. A tela permanece na aba `Apresentação` durante os primeiros 6 minutos.
2. **Integrante 4 explica exclusivamente o simulador** na aba **`Simulador 6 vistas`**, executando **demonstrações práticas e reproduzíveis** selecionadas do guia final ([`doc/EXPLICACAO_SIMULADOR_ETAPA_02.md`](EXPLICACAO_SIMULADOR_ETAPA_02.md)), com cliques sincronizados passo a passo à narração e sem a promessa inviável de demonstrar todos os cenários em dois minutos.
3. **O Slide 10 (`Síntese`) pertence ao final do Bloco 3 (Integrante 3)** como fechamento teórico das oito aulas e delimitação de escopo; a explicação operacional da bancada e os cliques em tela são de responsabilidade exclusiva do **Integrante 4** no Bloco 4.

> **Nota sobre estimativa de tempo versus cronometragem real:**
> Os tempos, durações de fala e janelas de tela abaixo são **estimativas calculadas** com base na contagem exata por código das falas (**201 a 209 palavras por integrante**, totalizando **817 palavras** no grupo). A uma cadência confortável e homogênea de **120 a 127 palavras por minuto**, cada integrante consome entre **95 e 100 segundos de fala ativa**, reservando entre **20 e 25 segundos por bloco** para avanço de slides, cliques operacionais no simulador, transições de orador e pausas respiratórias. **Não há garantia de tempo comprovado nesta revisão**, sendo mandatória a realização do protocolo de ensaio com cronômetro real (Seção 6) antes da banca examinadora.

---

## 1. Preparação Antes de Começar (Checklist de Navegador, Zoom, Tema e Operação)

1. **Atribuição de telas e operação (Regra do Operador)**:
   - **Nos Blocos 1, 2 e 3 (`00:00 – 06:00`)**: A tela permanece **exclusivamente na aba `Apresentação`**. O integrante da vez clica no número do slide no índice superior do deck (`01` a `10`) conforme indicado em **`[AÇÃO DE TELA]`**, ou um integrante designado avança os slides para os colegas.
   - **No Bloco 4 (`06:00 – 08:00`)**: O **`Integrante 4` assume o controle exclusivo do mouse e teclado**, clica na aba **`Simulador 6 vistas`** e opera as demonstrações interativas.
2. **Navegador compatível e links locais**:
   - Abra o arquivo local `doc/etapa-02-grafos.html` em um navegador moderno com suporte a CSS `@scope` (**Google Chrome, Microsoft Edge ou Firefox recente**).
   - As abas **`Apresentação`** e **`Simulador`** funcionam **100% no cliente sem backend**. Durante a apresentação, **não clique** nos botões `Abrir roteiro` ou `Abrir notebook` da aba `Arquivos`, pois apontam para URLs externas do GitHub.
   - Deixe uma **segunda aba do navegador** já aberta no mesmo arquivo local posicionada na aba **`Simulador`** como contingência rápida.
3. **Tema e Zoom recomendados para projetor/TV**:
   - **Tema**: Em salas claras ou projetores, mantenha o **tema claro (`light`, padrão)** para máximo contraste dos nós, das rotas em verde-azulado (`--teal`) e dos bloqueios em vermelho (`--red`). Em telas escuras ou monitores OLED, teste previamente o botão **`◐`** (`Alternar tema`).
   - **Zoom**: Ajuste entre **`100%` e `110%`** (`Ctrl + 0` ou `Ctrl + +`) em tela cheia (**`F11`**), assegurando que o diagrama SVG e a coluna lateral de bloqueios fiquem visíveis sem rolagem vertical excessiva.
4. **Estado inicial obrigatório antes do segundo `00:00`**:
   - Certifique-se de que a aba **`Apresentação`** está ativa.
   - Clique no botão **`01`** do deck para posicionar o slide **`01 / 10 · Abertura`** na tela.

---

## 2. Mapa Geral dos 8 Minutos Planejados (480 Segundos Estimados)

| Bloco | Quem Fala | Janela Cumulativa | Duração | Slides / Vistas em Tela | Papel Principal | Fala Ativa vs. Tela / Transição |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **1** | **Integrante 1** | `00:00 – 02:00` | `120 s` | Aba `Apresentação`: Slides **`01` (Abertura)**, **`02` (Aula 11)** e **`03` (Aula 12)** | **Teoria**: Linha de produção E1–E5, dígrafo ponderado e matrizes B/A/W | `98 s` de fala (`205 pal.`) + `22 s` de tela/transição |
| **2** | **Integrante 2** | `02:00 – 04:00` | `120 s` | Aba `Apresentação`: Slides **`04` (Aula 13)**, **`05` (Aula 14)** e **`06` (Aula 15)** | **Teoria**: Buscas BFS/DFS, menor caminho Dijkstra e contingência por falha manual | `97 s` de fala (`202 pal.`) + `23 s` de tela/transição |
| **3** | **Integrante 3** | `04:00 – 06:00` | `120 s` | Aba `Apresentação`: Slides **`07` (Aula 16)**, **`08` (Aula 17)**, **`09` (Aula 18)** e **`10` (Síntese)** | **Teoria**: Cobertura Euleriana, TSP Hamiltoniano/2-Opt, logística Kahn/veículos e síntese | `100 s` de fala (`209 pal.`) + `20 s` de tela/transição |
| **4** | **Integrante 4** | `06:00 – 08:00` | `120 s` | Aba `Simulador`: **Bancada interativa**, **Demo 1** (`Água · Dijkstra`), **Demo 2** (`Inspeção · Euler`) e fechamento | **Simulador**: Demonstrações práticas reproduzíveis e limites da simulação local | `95 s` de fala (`201 pal.`) + `25 s` de operação/fecho |
| **Total** | **4 Integrantes** | **`00:00 – 08:00`** | **`480 s`** | **10 slides teóricos (`01` a `10`) + Bancada do Simulador com 2 demos práticas** | **Teoria Completa (I1–I3) + Simulador Exclusivo (I4)** | **`390 s` de fala (`817 pal.`) + `90 s` de operação** |

---

## 3. Roteiro Palavra por Palavra e Ações de Tela

> **Convenção deste roteiro:**
> - Linhas marcadas com **`[AÇÃO DE TELA]`** e **`[TRANSIÇÃO]`** são instruções operacionais de direção — **não devem ser lidas em voz alta**.
> - Textos entre aspas duplas (**`"..."`**) dentro dos blocos de citação são as falas exatas a serem verbalizadas pelo orador indicado.

---

### BLOCO 1 — Integrante 1 (`00:00` a `02:00` | 120 segundos)
**Papel exclusivo**: Teoria da Etapa 02 — Contextualização da envasadora (`E1` a `E5`), escopo do portal e fundamentos de grafos e matrizes das Aulas 11 e 12 (Slides `01`, `02` e `03`). **Não opera o simulador**.

- **`00:00 – 00:04` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Tela na aba **`Apresentação`**, slide **`01 / 10 · Abertura`** (`Da pergunta ao modelo, do modelo ao algoritmo.`), cursor indicando a sequência `E1 → E2 → E3 → E4 → E5` e o resumo `03 abas · 17 arquivos · 06 vistas`.
- **`00:04 – 00:40` (`36 s`) · `74 palavras` — Fala de Integrante 1 (Segmento 1 — Slide `01 / 10 · Abertura`)**:
  > "Bom dia, professor e colegas. Somos o Grupo 2 e apresentamos a Etapa 02 do projeto Aqua Index, aplicando Teoria dos Grafos à envasadora pneumática de água em copos. Na abertura, vemos a linha de cinco postos da mesa indexadora: dispensa em E1, envase em E2, tampa em E3, termosselagem em E4 e ejeção em E5. Organizamos o portal em três abas: dez slides, dezessete arquivos e o simulador com seis vistas didáticas independentes."
- **`00:40 – 00:45` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`02`** (ou botão **`Próximo`**) para exibir o slide **`02 / 10 · Aula 11`** (`Uma conexão precisa de sentido e significado.` / `TK ── A 270 cm / B 275 cm ── DOS`).
- **`00:45 – 01:16` (`31 s`) · `64 palavras` — Fala de Integrante 1 (Segmento 2 — Slide `02 / 10 · Aula 11`)**:
  > "No slide da Aula 11, modelamos a planta como um dígrafo ponderado de nove nós e nove conexões em centímetros, formalizando sentido e custo de escoamento. O manifold de água possui grau de entrada dois porque recebe a Bomba A principal, com oitenta centímetros, e a Bomba B reserva, com oitenta e cinco. Além disso, separamos a tubulação hidráulica do transporte mecânico dos copos."
- **`01:16 – 01:21` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`03`** (ou botão **`Próximo`**) para exibir o slide **`03 / 10 · Aula 12`** (`Três matrizes, três leituras da mesma rede.` / `B   A   W  ·  13 × 13`).
- **`01:21 – 01:55` (`34 s`) · `67 palavras` — Fala de Integrante 1 (Segmento 3 — Slide `03 / 10 · Aula 12`)**:
  > "No slide da Aula 12, representamos a rede pneumática treze por treze pelas matrizes de incidência B, adjacência A e custos W. A matriz B tem posto doze, conserva sentido com soma zero por coluna e equaciona o anel de equalização entre ilhas. Em paralelo, a matriz da mesa indexadora descreve o ciclo de cinco avanços, indicando a selagem como gargalo. Passo a palavra ao Integrante 2."
- **`01:55 – 02:00` (`5 s`) — `[TRANSIÇÃO 1 → 2]`**:
  - `Integrante 1` conclui e passa a palavra. `Integrante 2` assume o microfone e clica no botão **`04`** do deck para exibir o slide **`04 / 10 · Aula 13`**. A tela permanece na aba `Apresentação`.

---

### BLOCO 2 — Integrante 2 (`02:00` a `04:00` | 120 segundos)
**Papel exclusivo**: Teoria da Etapa 02 — Algoritmos de busca (BFS/DFS na Aula 13), menor caminho (Dijkstra na Aula 14) e simulação de contingências (Aula 15) nos Slides `04`, `05` e `06`. **Não opera o simulador**.

- **`02:00 – 02:04` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Slide **`04 / 10 · Aula 13`** (`Encontrar alcance não é minimizar tempo.` / bifurcação entre `V1` e `V2`).
- **`02:04 – 02:37` (`33 s`) · `67 palavras` — Fala de Integrante 2 (Segmento 1 — Slide `04 / 10 · Aula 13`)**:
  > "Obrigado. No slide da Aula 13, comparamos algoritmos de busca na rede simplificada com bifurcação entre válvulas V1 e V2. A Busca em Largura expande em camadas por fila FIFO e garante a rota com menor número de arestas, alcançando a empacotadora em cinco saltos sem ponderar os segundos. Já a Busca em Profundidade enumera os dois caminhos simples e desvia por V2 quando V1 está bloqueada."
- **`02:37 – 02:42` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`05`** (ou botão **`Próximo`**) para exibir o slide **`05 / 10 · Aula 14`** (`Minimizar a soma dos pesos disponíveis.` / `270 cm  →  275 cm  →  sem rota`).
- **`02:42 – 03:13` (`31 s`) · `63 palavras` — Fala de Integrante 2 (Segmento 2 — Slide `05 / 10 · Aula 14`)**:
  > "Para minimizar distâncias, avançamos ao slide da Aula 14 com o algoritmo de Dijkstra em pesos não negativos. Do tanque principal até o cilindro dosador, a rota nominal via Bomba A totaliza duzentos e setenta centímetros, enquanto a via alternativa pela Bomba B soma duzentos e setenta e cinco. Dijkstra avalia o custo cumulativo global relaxando arestas, garantindo a decisão ótima no grafo."
- **`03:13 – 03:18` (`5 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`06`** (ou botão **`Próximo`**) para exibir o slide **`06 / 10 · Aula 15`** (`Uma falha manual altera o grafo consultado.` / `P-101 ×  →  P-102  →  MAN`).
- **`03:18 – 03:54` (`36 s`) · `72 palavras` — Fala de Integrante 2 (Segmento 3 — Slide `06 / 10 · Aula 15`)**:
  > "No slide da Aula 15, simulamos contingências por falha manual e recálculo de rota. Ao isolar a conexão a3 da Bomba A, o recálculo desvia imediatamente o fluxo para a Bomba B em duzentos e setenta e cinco centímetros. Se bloquearmos também a conexão a4 ou o manifold de água, que é um vértice de articulação crítico, o sistema acusa sem rota. A resposta é puramente computacional e local. Passo a palavra."
- **`03:54 – 04:00` (`6 s`) — `[TRANSIÇÃO 2 → 3]`**:
  - `Integrante 2` conclui e passa a palavra. `Integrante 3` assume o microfone e clica no botão **`07`** do deck para exibir o slide **`07 / 10 · Aula 16`**. A tela permanece na aba `Apresentação`.

---

### BLOCO 3 — Integrante 3 (`04:00` a `06:00` | 120 segundos)
**Papel exclusivo**: Teoria da Etapa 02 — Problemas eulerianos (Aula 16), ciclos hamiltonianos/TSP (Aula 17), logística de materiais e veículos (Aula 18) e síntese teórica das oito aulas nos Slides `07`, `08`, `09` e `10`. **Não opera o simulador**.

- **`04:00 – 04:04` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Slide **`07 / 10 · Aula 16`** (`Inspecionar cada aresta exatamente uma vez.` / `PAINEL ── FRL ── S100... / 24,5 min`).
- **`04:04 – 04:31` (`27 s`) · `56 palavras` — Fala de Integrante 3 (Segmento 1 — Slide `07 / 10 · Aula 16`)**:
  > "Obrigado. No slide da Aula 16, cobrimos arestas na inspeção preventiva com problemas eulerianos. Com oito nós de grau par, o algoritmo de Hierholzer gera o circuito fechado de dez trechos em vinte e quatro vírgula cinco minutos. Bloquear um trecho cria dois nós ímpares e abre uma trilha. Carteiro Chinês e CIP constam nos arquivos."
- **`04:31 – 04:35` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`08`** (ou botão **`Próximo`**) para exibir o slide **`08 / 10 · Aula 17`** (`Visitar vértices e retornar à partida.` / `NN 280 s  →  2-Opt 260 s`).
- **`04:35 – 05:00` (`25 s`) · `52 palavras` — Fala de Integrante 3 (Segmento 2 — Slide `08 / 10 · Aula 17`)**:
  > "No slide da Aula 17, o ciclo hamiltoniano visita cada vértice uma vez e retorna à base. Por ser NP-difícil, usamos a matriz do notebook com o Vizinho Mais Próximo em duzentos e oitenta segundos, refinada pelo 2-Opt para duzentos e sessenta segundos. É rota candidata, sem prova global nem AGV físico."
- **`05:00 – 05:04` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`09`** (ou botão **`Próximo`**) para exibir o slide **`09 / 10 · Aula 18`** (`Precedência e circulação exigem grafos separados.` / `DAG E1–E5 vs Veículos`).
- **`05:04 – 05:29` (`25 s`) · `52 palavras` — Fala de Integrante 3 (Segmento 3 — Slide `09 / 10 · Aula 18`)**:
  > "No slide da Aula 18, separamos materiais de veículos. O fluxo produtivo forma um Grafo Acíclico Dirigido de dezesseis nós, onde Kahn ordena precedências preservando a sequência E1 a E5. Veículos percorrem vias com ciclos, resolvidos por Dijkstra em quarenta metros nominais e sessenta e cinco no desvio. Unir ambos causaria paradoxo."
- **`05:29 – 05:33` (`4 s`) — `[AÇÃO DE TELA]`**:
  - Clicar no botão **`10`** (ou botão **`Σ`**) para exibir o slide **`10 / 10 · Síntese`** (`Uma pergunta por vez, uma evidência por resultado.`).
- **`05:33 – 05:56` (`23 s`) · `49 palavras` — Fala de Integrante 3 (Segmento 4 — Slide `10 / 10 · Síntese Teórica`)**:
  > "Fechando no slide de Síntese, consolidamos as oito aulas: matrizes para redes, buscas para saltos, Dijkstra para menor caminho, Euler para arestas, heurísticas para visitas e Kahn para precedências. Como limite metodológico, os modelos são didáticos e locais, sem comandos ao CLP ou Automation Studio. Passo ao Integrante quatro."
- **`05:56 – 06:00` (`4 s`) — `[TRANSIÇÃO 3 → 4]`**:
  - `Integrante 3` conclui a exposição teórica. O `Integrante 4` assume o controle exclusivo do terminal/mouse e prepara a entrada na aba do simulador.

---

### BLOCO 4 — Integrante 4 (`06:00` a `08:00` | 120 segundos)
**Papel exclusivo**: Operação e demonstração do Simulador na aba **`Simulador 6 vistas`** — Demonstrações práticas reproduzíveis baseadas no guia final ([`doc/EXPLICACAO_SIMULADOR_ETAPA_02.md`](EXPLICACAO_SIMULADOR_ETAPA_02.md)), com cliques rigorosamente sincronizados à fala, cadência constante de ~125 ppm e sem a promessa inviável de demonstrar todos os cenários em dois minutos.

- **`06:00 – 06:05` (`5 s`) — `[AÇÃO DE TELA — Entrada no Simulador]`**:
  - Clicar na aba superior **`Simulador 6 vistas`** (`#tab-simulador`). A bancada abre na primeira vista padrão: **`Água / copos · Dijkstra`**, com rota nominal exibindo **`270 cm`** em verde no diagrama SVG.
- **`06:05 – 06:29` (`24 s`) · `51 palavras` — Fala de Integrante 4 (Segmento 1 — Bancada Interativa e Execução Local)**:
  > "Assumo a operação exclusiva do simulador. Esta bancada roda no navegador em JavaScript puro, sem backend e sem comandos ao CLP ou Automation Studio. São seis vistas com isolamento estrito de estado. Temos o diagrama SVG responsivo à esquerda, controles e bloqueios à direita, com Resultado Atual e Diário curto abaixo."
- **`06:29 – 06:31` (`2 s`) — `[AÇÃO DE TELA — Apontar Rota Nominal]`**:
  - Apontar com o cursor no diagrama SVG para o trajeto em verde `TK-101_Agua → P-101_BombaA → MAN-200_Agua → DOS-201_Dosador` (`270 cm`).
- **`06:31 – 06:44` (`13 s`) · `27 palavras` — Fala de Integrante 4 (Segmento 2A — Demo 1: Rota Nominal em Água e Copos)**:
  > "Na vista Água e copos, o Dijkstra calcula a rota nominal em verde de duzentos e setenta centímetros da fonte até o dosador pela Bomba A principal."
- **`06:44 – 06:47` (`3 s`) — `[AÇÃO DE TELA — Bloqueio do Trecho a3]`**:
  - Na coluna lateral **Bloqueios**, marcar a caixa **`a3 · P-101_BombaA → MAN-200_Agua · 80 cm`**. A tela recalcula de imediato para **`275 cm`** destacando o desvio pela Bomba B.
- **`06:47 – 06:58` (`11 s`) · `23 palavras` — Fala de Integrante 4 (Segmento 2B — Demo 1: Desvio pela Bomba B)**:
  > "Com o trecho a3 bloqueado, o algoritmo recalcula imediatamente o desvio pela Bomba B reserva, resultando em duzentos e setenta e cinco centímetros."
- **`06:58 – 07:02` (`4 s`) — `[AÇÃO DE TELA — Bloqueio a4]`**:
  - Marcar também a caixa **`a4 · P-102_BombaB → MAN-200_Agua · 85 cm`**. Manter **`Sem rota`** na tela até a fala explicar a falha dupla.
- **`07:02 – 07:15` (`13 s`) · `27 palavras` — Fala de Integrante 4 (Segmento 2C — Demo 1: Falha Dupla e Restauração)**:
  > "Ao bloquearmos também a4 ou o manifold, que é um vértice de articulação crítico, o sistema acusa sem rota. Restauramos a vista aos duzentos e setenta nominais."
  - **`[AÇÃO DURANTE A FALA]`**: clicar em **`Restaurar vista`** ao dizer “Restauramos”; mostrar novamente **`270 cm`** até trocar de vista.
- **`07:15 – 07:19` (`4 s`) — `[AÇÃO DE TELA — Trocar para Inspeção · Euler]`**:
  - Clicar no botão da terceira vista: **`Inspeção · Euler`** (`#e02-mode-round`). A tela exibe o título **`Circuito · 24.5 min`** com Hierholzer.
- **`07:19 – 07:32` (`13 s`) · `28 palavras` — Fala de Integrante 4 (Segmento 3A — Demo 2: Circuito Fechado Nominal)**:
  > "Na vista Inspeção, todos os oito postos têm grau par, permitindo a Hierholzer construir o circuito fechado de vinte e quatro vírgula cinco minutos com os dez trechos."
- **`07:32 – 07:36` (`4 s`) — `[AÇÃO DE TELA — Bloqueio t9]`**:
  - Na coluna Bloqueios, marcar a caixa **`t9 · S200 — S400 · 2 min`**. Manter **`Trilha · 22.5 min`** na tela até a fala explicar a trilha aberta.
- **`07:36 – 07:49` (`13 s`) · `28 palavras` — Fala de Integrante 4 (Segmento 3B — Demo 2: Trilha Aberta por Quebra de Paridade e Restauração)**:
  > "Com o trecho t9 bloqueado, surgem dois vértices ímpares e obtemos uma trilha aberta de vinte e dois vírgula cinco minutos. Restaurando a vista, o circuito nominal retorna."
  - **`[AÇÃO DURANTE A FALA]`**: clicar em **`Restaurar vista`** ao dizer “Restaurando”; mostrar **`Circuito · 24.5 min`** antes de abrir Materiais.
- **`07:49 – 07:51` (`2 s`) — `[AÇÃO DE TELA — Destaque em Materiais]`**:
  - Clicar na vista **`Materiais · Kahn`** (`#e02-mode-materials`), exibindo **`16 vértices ordenados`** com as arestas da espinha dorsal `E1–E5` destacadas em verde-azulado no SVG.
- **`07:51 – 07:59` (`8 s`) · `17 palavras` — Fala de Integrante 4 (Segmento 4 — Vistas Complementares e Encerramento)**:
  > "Em Materiais, Kahn ordena dezesseis nós preservando E1 a E5. Estamos à disposição da banca para perguntas."
- **`07:59 – 08:00` (`1 s`) — `[FINALIZAÇÃO]`**:
  - O grupo permanece posicionado com o simulador na tela, pronto para demonstrar qualquer outro cenário ou responder à arguição da banca.

---

## 4. Tabela de Validação: Contagem Exata de Palavras por Código, Segmentos e Tempos Estimados

A tabela abaixo detalha a contagem exata obtida por análise de código (`len(fala.split())`) sobre todas as falas textuais dos Blocos 1 a 4:

| Integrante | Segmentos de Fala no Bloco | Contagem de Palavras por Segmento | Total de Palavras | Tempo a 125 ppm | Tempo de Fala Alocado | Tempo de Tela / Transição | Duração Estimada do Bloco | Conteúdo Apresentado |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Integrante 1** | 3 segmentos | `74 + 64 + 67` | **205 palavras** | `98,4 s` | `98 s` | `22 s` | **`120 s` (`02:00`)** | **Teoria**: Slide `01` (Abertura), Slide `02` (Aula 11) e Slide `03` (Aula 12) |
| **Integrante 2** | 3 segmentos | `67 + 63 + 72` | **202 palavras** | `97,0 s` | `97 s` | `23 s` | **`120 s` (`02:00`)** | **Teoria**: Slide `04` (Aula 13), Slide `05` (Aula 14) e Slide `06` (Aula 15) |
| **Integrante 3** | 4 segmentos | `56 + 52 + 52 + 49` | **209 palavras** | `100,3 s` | `100 s` | `20 s` | **`120 s` (`02:00`)** | **Teoria**: Slide `07` (Aula 16), Slide `08` (Aula 17), Slide `09` (Aula 18) e Slide `10` (Síntese) |
| **Integrante 4** | 7 falas sincr. | `51 + 27 + 23 + 27 + 28 + 28 + 17` | **201 palavras** | `96,5 s` | `95 s` | `25 s` | **`120 s` (`02:00`)** | **Simulador**: Bancada, Demo 1 (`Água`), Demo 2 (`Inspeção`), Destaque `Materiais` e Fecho |
| **TOTAL GRUPO** | **17 falas** | — | **817 palavras** | **`392,2 s`** | **`390 s` (`6,50 min`)** | **`90 s` (`1,50 min`)** | **`480 s` (`08:00`)** | **10 slides teóricos completos + Laboratório interativo do Simulador** |

---

## 5. Plano Alternativo se a Demonstração Falhar (Plano de Contingência)

1. **Caso 1 — Dificuldade no manuseio do touchpad ou cursor instável durante a demo**:
   - **Solução**: O Integrante 4 deve utilizar exclusivamente as **caixas de seleção (`checkbox`) na coluna lateral direita `Bloqueios`** (`a3`, `a4`, `t9`), que possuem área de clique ampla e disparam o recálculo imediato por evento `change`, sem exigir cliques de precisão sobre as arestas finas do SVG.
2. **Caso 2 — Projetor com resolução reduzida cortando o diagrama SVG na lateral**:
   - **Solução**: Reduza o zoom em um nível (**`Ctrl + -`**, `90%`) ou utilize a rolagem horizontal suave da barra inferior (`.e02-graph-scroll`), que mantém toda a legibilidade do diagrama.
3. **Caso 3 — Congelamento do navegador ou falha de JavaScript na aba do simulador**:
   - **Solução**: Alterne imediatamente com **`Ctrl + Tab`** para a **segunda aba pré-aberta** no navegador. Se persistir, o Integrante 4 pode apresentar os resultados analíticos diretamente pelos **slides da aba `Apresentação`**, utilizando os textos conceituais em tópicos (`.e02-lesson-copy`) e os diagramas vetoriais (`.e02-lesson-figure`), que documentam fielmente os mesmos resultados numéricos:
     - No **Slide 05** (Aula 14) e **Slide 06** (Aula 15): o texto enumera a rota nominal de `270 cm` (`150 + 80 + 40`), a alternativa de `275 cm` (`150 + 85 + 40`), e o diagrama ilustra o recálculo com a contingência `Nominal → a3 isolada → a3+a4 (sem rota) → Restaurar`;
     - No **Slide 07** (Aula 16): o texto formaliza a ronda com `oito pontos e dez trechos, com total nominal de 24,5 min`, e o diagrama exibe o anel acoplado com paridade de graus;
     - No **Slide 08** (Aula 17): o texto documenta o Vizinho Mais Próximo com `280 s` refinado pelo 2-Opt para `260 s`;
     - No **Slide 09** (Aula 18): o texto documenta a ordenação de `16 vértices no DAG` por Kahn preservando `E1–E5`, e os trajetos de veículos com `40 m nominal` e `65 m` no desvio.
4. **Caso 4 — Questionamento da banca sobre integração física com bancada**:
   - **Solução**: Responda com firmeza técnica que o simulador é uma **ferramenta de projeto didático e analítico** executada localmente no cliente em JavaScript, com testes automatizados via Node, não enviando telemetria a CLP nem substituindo intertravamentos físicos de segurança.

---

## 6. Protocolo de Ensaio Cronometrado e Cortes Priorizados (Caso Passem de 8 Minutos no Treino)

O grupo deve realizar **no mínimo dois ensaios prévios completos com cronômetro real** (metas de passagem: Integrante 1 entrega em `02:00`, Integrante 2 em `04:00`, Integrante 3 em `06:00` e Integrante 4 encerra em `08:00`). Caso a cadência vocal da equipe seja inferior a 115 palavras por minuto e o tempo estoure, apliquem os seguintes cortes em ordem estrita de prioridade:

1. **Corte Prioritário 1 (Bloco 4 — economiza ~8 s e 2 cliques)**:
   - Na vista **`Inspeção · Euler`**, não marque a caixa `t9`; apenas mostre o circuito fechado nominal de `24,5 min` e aponte verbalmente que a remoção de um trecho abriria uma trilha de `22,5 min`.
2. **Corte Prioritário 2 (Bloco 2 — economiza ~7 s)**:
   - No Slide `06` (Aula 15), reduza a fala final para: *"Ao isolar a3, o Dijkstra desvia pela Bomba B em 275 centímetros; bloqueando também a4 ou o manifold, acusa sem rota por se tratar de vértice de articulação."*
3. **Corte Prioritário 3 (Bloco 3 — economiza ~6 s)**:
   - No Slide `08` (Aula 17), reduza a fala para: *"Na Aula 17, o ciclo hamiltoniano visita cada vértice uma vez; na matriz do notebook, o Vizinho Mais Próximo obtém 280 segundos e o 2-Opt refina para 260 segundos."*
4. **Corte Prioritário 4 (Bloco 1 — economiza ~6 s)**:
   - No Slide `03` (Aula 12), reduza a fala para: *"A matriz de incidência B tem posto doze e conserva sentido com soma zero, equacionando o anel de ar, enquanto a mesa C5 aponta a selagem como gargalo."*

---

## 7. Perguntas Rápidas de Banca e Alinhamento Conceitual (Respostas Prontas)

Caso a banca faça perguntas técnicas ao final da apresentação, utilizem as seguintes respostas fundamentadas:

1. **"Por que na Vista 2 (Busca) a BFS escolhe a rota por V1 exibindo '5 arestas por BFS', mesmo existindo tempos em segundos nos trechos?"**
   - *Resposta*: Porque o algoritmo BFS explora em camadas (fila FIFO) e minimiza exclusivamente o **número de arestas (saltos)**, desconsiderando magnitudes de tempo ou distância. Como as rotas por V1 e por V2 contêm exatamente 5 saltos, a BFS escolhe V1 pela ordem determinística de inserção. Para minimizar tempo acumulado em segundos, o algoritmo correto é o Dijkstra.
2. **"Se a planta possui duas bombas em paralelo (P-101 e P-102), por que a máquina ainda pode ficar 'Sem rota'?"**
   - *Resposta*: Porque a redundância protege contra falha simples em uma bomba, mas não contra falha simultânea ($a_3$ e $a_4$). Além disso, ambas convergem no manifold `MAN-200_Agua`, que é um **vértice de articulação**, sucedido pela aresta-ponte crítica $a_5$. Bloquear o manifold ou a tubulação $a_5$ interrompe totalmente a alimentação do dosador.
3. **"Qual é a diferença entre Euler (Aula 16) e Hamiltoniano/TSP (Aula 17)?"**
   - *Resposta*: Euler (Aula 16) exige cobrir **todas as arestas** exatamente uma vez (inspeção de mangueiras/cabos), sendo solúvel em tempo linear $O(\|E\|)$ pelo Algoritmo de Hierholzer. Já o ciclo hamiltoniano / TSP (Aula 17) exige visitar **todos os vértices** uma vez e retornar à base; trata-se de um problema NP-difícil solucionado por heurísticas construtivas (Vizinho Mais Próximo) e refinamento local (2-Opt).
4. **"Por que na Aula 16 a ronda fecha em 24,5 min e no notebook a caça a vazamentos soma 57,8 min?"**
   - *Resposta*: Porque são grafos e problemas diferentes. A ronda do simulador possui 8 postos onde todos têm grau par, permitindo um circuito euleriano fechado direto de $24,5\text{ min}$. Já a caça a vazamentos possui 10 cilindros terminais de grau ímpar ($\deg=1$), exigindo repetição de trechos via Algoritmo do Carteiro Chinês ($36,4\text{ min}$ base $+ 21,4\text{ min}$ repetição $= 57,8\text{ min}$).
5. **"Por que separar o grafo de Materiais (Kahn) do grafo de Veículos (Dijkstra) na Aula 18?"**
   - *Resposta*: Porque eles possuem propriedades matemáticas incompatíveis. A produção física de materiais é irreversível no produto e forma um **Grafo Acíclico Dirigido (DAG)** ordenado por Kahn sem ciclos. A logística de veículos transita por vias bidirecionais de mão dupla com **ciclos de retorno**, onde Kahn falharia, mas que são resolvidos naturalmente pelo algoritmo de Dijkstra.
6. **"Os modelos do simulador enviam comandos para a máquina ou para o Automation Studio?"**
   - *Resposta*: Não. Todos os seis modelos rodam 100% no navegador em JavaScript como ferramentas analíticas de engenharia. Eles não possuem telemetria em tempo real, não acionam CLP e não substituem os intertravamentos físicos de segurança da planta.
