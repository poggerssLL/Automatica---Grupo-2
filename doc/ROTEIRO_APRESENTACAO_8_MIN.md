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

### BLOCO 4 — Apresentação do Simulador (Versão Simples, Direta e Sem Decorar Números)
**Papel exclusivo**: Mostrar na prática como funciona o **Simulador Integrado da Etapa 02** (`#painel-simulador`).
**Dica de ouro para não decorar**: **Use a própria tela como cola!** O nome do algoritmo já está escrito em cada botão do topo (`[data-e02-model-select]`), e o resultado já aparece grande no quadro **`Resultado atual`**. Você só precisa lembrar **1 ideia central por botão** (2 frases curtas por modelo).

---

#### Mapa Mental de 1 Linha por Botão (Sua Cola Rápida)
1. **`Água / copos · Dijkstra`** → *Menor caminho somando os pesos (distância da tubulação).*
2. **`Busca · BFS · DFS`** → *BFS conta o menor número de saltos; DFS lista todas as rotas possíveis.*
3. **`Inspeção · Euler`** → *Passar por todos os cabos/tubos (arestas) uma única vez.*
4. **`AGV · NN · 2-Opt`** → *Visitar todos os postos (nós) uma vez e melhorar a rota do robô.*
5. **`Materiais · Kahn`** → *Ordem correta de produção sem ciclos (o que precisa vir antes).*
6. **`Veículos · Dijkstra`** → *Separado de materiais porque os carrinhos vão e voltam (têm ciclos).*

---

#### Roteiro Passo a Passo (O que clicar + O que falar de forma simples)

##### 1. Visão Geral do Simulador Interconectado
* **`[O QUE FAZER NA TELA]`**:
  1. Clique na aba **`Simulador`**.
  2. Passe o mouse pelo diagrama grande mostrando os **6 quadros juntos** e as **linhas tracejadas** que ligam um quadro ao outro.
  3. Aponte para a barra de botões **`Modelo de análise de grafos`** no topo.
* **`[SUA FALA]`**:
  > "Agora vou mostrar o nosso simulador funcionando. Aqui nós juntamos as seis visões da envasadora num único painel, e essas linhas tracejadas mostram onde um mesmo equipamento se conecta de um modelo para o outro. No topo, nós só escolhemos qual método de análise de grafos queremos rodar, e o simulador calcula tudo na hora."

---

##### 2. Botão 1 — `Água / copos · Dijkstra`
* **`[O QUE FAZER NA TELA]`**:
  1. Deixe no primeiro botão (**`Água / copos · Dijkstra`**) e aponte a linha verde acesa no primeiro quadro e o valor em **`Resultado atual`** (`270 cm`).
  2. Em **Bloqueios** (na direita), clique no primeiro trecho da **Bomba A** (`a3`): mostre que a linha muda para a **Bomba B** (`275 cm`).
  3. Clique no **Manifold** (`MAN-200_Agua`) para mostrar **`Sem rota`**, e depois clique em **`Restaurar vista`**.
* **`[SUA FALA]`**:
  > "O primeiro método é o **Dijkstra** na rede de água, que serve para achar o caminho mais curto somando o tamanho real da tubulação até o dosador. Se eu simular uma falha bloqueando a Bomba A aqui do lado, ele recalcula na hora o desvio pela Bomba B reserva; mas se eu bloquear o manifold central, onde as duas linhas se juntam, o sistema avisa que ficou sem rota."

---

##### 3. Botão 2 — `Busca · BFS · DFS`
* **`[O QUE FAZER NA TELA]`**:
  1. Clique no segundo botão: **`Busca · BFS · DFS`**.
  2. Aponte para o quadro do meio no topo e para o **`Resultado atual`** (que mostra as arestas da BFS e os caminhos da DFS).
  3. Marque o bloqueio da válvula **`V1`** na direita e mostre a linha desviando por baixo (`V2`).
* **`[SUA FALA]`**:
  > "No segundo botão temos **BFS e DFS**, que olham apenas para a conectividade da planta, sem somar os pesos. A **BFS** acha o caminho com o menor número de saltos, enquanto a **DFS** lista todos os caminhos possíveis pela válvula 1 ou pela válvula 2 — e se fecharmos a V1, o fluxo desvia na hora pela V2."

---

##### 4. Botão 3 — `Inspeção · Euler`
* **`[O QUE FAZER NA TELA]`**:
  1. Clique no terceiro botão: **`Inspeção · Euler`** (quadro superior direito).
  2. Aponte que o **`Resultado atual`** começa escrito **`Circuito`**.
  3. Na direita, bloqueie o trecho **`t9`** (`S200 — S400`): aponte que o resultado muda para **`Trilha`**. Se bloquear mais um trecho, mostra **`indisponível`**.
* **`[SUA FALA]`**:
  > "O terceiro modelo usa **Euler** para a ronda de manutenção: aqui a regra é passar por todas as conexões de cabos e mangueiras uma única vez, sem repetir. Quando todos os pontos têm número par de ligações, o técnico faz um **Circuito** fechado voltando ao início; se bloqueamos um trecho central, vira uma **Trilha** aberta, e com mais falhas a ronda sem repetição fica impossível."

---

##### 5. Botão 4 — `AGV · NN · 2-Opt`
* **`[O QUE FAZER NA TELA]`**:
  1. Clique no quarto botão: **`AGV · NN · 2-Opt`** (quadro inferior direito).
  2. Aponte para o hexágono verde e leia na tela o **`Resultado atual`**: **`NN 280 s → 2-Opt 260 s`**.
* **`[SUA FALA]`**:
  > "Já no quarto modelo, do robô **AGV**, o objetivo muda: em vez de passar por todas as linhas, ele precisa visitar todos os postos uma única vez, como no Caixeiro-Viajante. Primeiro o método do **Vizinho Mais Próximo** monta uma rota rápida pegando sempre o ponto mais perto, e depois o **2-Opt** descruza o trecho mais longo para economizar tempo de viagem."

---

##### 6. Botão 5 — `Materiais · Kahn`
* **`[O QUE FAZER NA TELA]`**:
  1. Clique no quinto botão: **`Materiais · Kahn`** (quadro inferior esquerdo).
  2. Aponte para a linha central (`E1` até `E5`), para as várias **linhas tracejadas verdes** que se acendem ligando aos outros quadros e para a lista numerada de `1` a `16` no **`Resultado atual`**.
* **`[SUA FALA]`**:
  > "No quinto modelo usamos o algoritmo de **Kahn** sobre o fluxo de materiais, que é um grafo sem ciclos. Ele não calcula distância, mas sim a **ordem de produção**: organiza as dezesseis etapas em fila garantindo que água, copo e tampa cheguem antes das estações de envase, selagem e expedição."

---

##### 7. Botão 6 — `Veículos · Dijkstra` (Fechamento)
* **`[O QUE FAZER NA TELA]`**:
  1. Clique no sexto botão: **`Veículos · Dijkstra`** (quadro inferior central).
  2. Aponte as setas de ida e volta nos corredores e marque o bloqueio do **`CORREDOR_B`** na direita, mostrando a linha desviando pela **`VIA_EXTERNA`**.
* **`[SUA FALA]`**:
  > "Por fim, em **Veículos**, nós separamos o trânsito dos carrinhos do grafo de materiais porque os veículos vão e voltam pelos corredores, formando ciclos que travariam o método anterior. Aqui voltamos a usar **Dijkstra** para achar a rota mais curta até a doca e desviar pela via externa se um corredor estiver interditado. Com isso fechamos a demonstração do grupo, muito obrigado!"

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
