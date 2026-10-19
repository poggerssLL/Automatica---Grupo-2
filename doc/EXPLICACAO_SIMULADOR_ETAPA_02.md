# Guia Didático e Verificável — Portal e Simulador da Etapa 02 (Grafos)

Este documento é o guia de referência didática, técnica e operacional da página **[`etapa-02-grafos.html`](etapa-02-grafos.html)** (*Portal da Etapa 02 — Grafos | Aqua Index*). Ele detalha a arquitetura do portal, o funcionamento de cada uma das **seis vistas interativas do simulador**, a semântica visual dos diagramas e a sequência reproduzível de cliques para cada cenário de estudo das Aulas 11 a 18 da disciplina **ECAA08 (Automática — UNIFEI, Grupo 2)**.

---

## 1. Contexto e Papel da Etapa 02 no Projeto ECAA08 (Aqua Index)

O projeto estuda uma **máquina pneumática de envasamento de água em copos**, cujo processo fabril ocorre sobre uma **mesa giratória indexada** servocontrolada com cinco postos sequenciais:

```text
Magazine de copos (MAG-100)
       │
       ▼
 [E1] Dispensa do copo (Cilindro A)
       │
       ▼
 [E2] Envase e dosagem (Cilindro B, Cilindro C / DOS-201, Bico BIC-202)
       │
       ▼
 [E3] Posicionamento de tampa (Manipulador pick-and-place D/E, Ventosa a vácuo EJT-301)
       │
       ▼
 [E4] Termosselagem aquecida (Cilindro F)
       │
       ▼
 [E5] Ejeção do copo fechado (Cilindros G e H) ──► Esteira de saída (EST-500)
```

Na **Etapa 02**, aplicamos conceitos de **Teoria dos Grafos** para responder perguntas de engenharia sobre topologia, rotas de escoamento, buscas, cobertura de inspeção, roteamento de veículos e ordem lógica de manufatura.

> [!IMPORTANT]
> **Regra de ouro e limites metodológicos fundamentais:**
> 1. **Modelos matemáticos didáticos independentes:** Os grafos das aulas e do simulador representam recortes conceituais para estudo algorítmico, e não uma planta industrial integrada em regime permanente.
> 2. **Execução 100% local no navegador:** O simulador roda integralmente em JavaScript no cliente via [`js/etapa-02-simulator.js`](js/etapa-02-simulator.js). Não há servidor, não há banco de dados e não há requisições HTTP de telemetria em segundo plano.
> 3. **Isolamento estrito entre as vistas:** Cada uma das seis vistas possui estrutura de dados imutável própria (`Object.freeze`), unidade própria e algoritmo específico. A alteração de uma vista **nunca** transporta estado nem contamina as demais.
> 4. **Sem atuação física:** Clicar em um bloqueio ou calcular uma rota recalcula apenas estruturas em memória no navegador; **não envia comandos para CLP**, não aciona atuadores no **Automation Studio**, não monitora sensores de bancada e não substitui os intertravamentos físicos e de segurança da máquina.

---

## 2. Estrutura do Portal: Cabeçalho, Abas e Interação

Ao carregar [`etapa-02-grafos.html`](etapa-02-grafos.html), a página exibe:

- **Cabeçalho superior (`site-header`)**: Links institucionais (*Visão geral*, *Etapa 01*, *Etapa 02*, *A envasadora*, *GitHub & Entregas*) e o botão **`◐`** (`Alternar tema`), que alterna entre os temas claro (`data-theme="light"`, padrão) e escuro (`data-theme="dark"`).
- **Faixa de abertura (`e02-hero`)**: Apresenta o título *"Grafos da envasadora."* e os três indicadores de escopo: **`03` abas de leitura**, **`17` arquivos mapeados** e **`06` vistas interativas**.
- **Barra de abas principais (`[data-etapa02-tabs]`)**: Organizada com acessibilidade ARIA (`role="tablist"`):
  - **Navegação com mouse**: Clique sobre o nome da aba.
  - **Navegação com teclado**: Com uma aba focada, as teclas **`←` / `→`** alternam ciclicamente entre as abas; as teclas **`Home`** e **`End`** saltam para a primeira e a última aba, respectivamente.
  - **Sincronização de URL**: A navegação atualiza automaticamente o fragmento hash na barra de endereço (`#apresentacao`, `#arquivos` ou `#simulador`), permitindo salvar atalhos diretos.

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Apresentação          │  Arquivos [17]         │  Simulador [6 vistas]│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Aba 1 — `Apresentação`
- Contém um **deck interativo de 10 slides** (`01 / 10` a `10 / 10`), com índices rápidos: **`01`** (Abertura), **`11`** (Modelagem), **`12`** (Matrizes), **`13`** (Buscas), **`14`** (Dijkstra), **`15`** (Falhas), **`16`** (Euler), **`17`** (AGV), **`18`** (Logística) e **`Σ`** (Síntese).
- **Operação**:
  - Clique direto nos botões **`01`** a **`Σ`** no seletor horizontal;
  - Clique nos botões **`Anterior`** (`[data-e02-prev]`) e **`Próximo`** (`[data-e02-next]`);
  - Navegação com setas **`←`** e **`→`** do teclado quando o contêiner do deck (`.e02-deck`, com `tabindex="0"`) estiver com foco.
- Cada slide possui um resumo conceitual da aula e uma faixa de síntese visual (`data-viz`), como `TK ── A 270 cm / B 275 cm ── DOS` na Aula 11 ou `NN 280 s → 2-Opt 260 s` na Aula 17.

### 2.2. Aba 2 — `Arquivos 17`
- Apresenta o **inventário completo e mapa de leitura** dos **17 arquivos** versionados da Etapa 02: o `README.md` da etapa e os 8 pares de roteiro (`.md`) e notebook (`.ipynb`) das Aulas 11 a 18 ($1 + 8 \times 2 = 17$).
- A barra de seleção horizontal (`[data-e02-file-rail]`) permite alternar entre os cartões com mouse ou setas do teclado. Cada cartão expõe a **Pergunta**, o **Modelo**, o **Achado** e o **Limite metodológico**.
- **Comportamento de links**: O botão `Abrir README` usa caminho relativo local (`../etapa-02-grafos/README.md`); já os botões `Abrir roteiro` e `Abrir notebook` abrem URLs externas no GitHub (`target="_blank" rel="noopener"`).
- **Modelos documentados nos arquivos sem vista dedicada no simulador**:
  - *Aula 12*: Matrizes $13\times 13$ $B, A, W$ da rede pneumática, anel de equalização entre ilhas, resíduo simulado de vazamento e ciclo $C_5$ da mesa;
  - *Aula 16*: Caça a vazamentos com Carteiro Chinês (10 vértices ímpares, 57,8 min) e o circuito de limpeza CIP dirigido (20,0 min);
  - *Aula 18*: Conversão de metros para minutos de circulação (20 min vs. 6,5 min) e checagem booleana de quarentena.

### 2.3. Aba 3 — `Simulador 6 vistas`
- O laboratório computacional de grafos, acessível pelo botão de aba `Simulador 6 vistas` ou pelo hash `#simulador`.
- Contém a **Nota metodológica** alertando sobre a natureza didática dos cálculos e apresenta o **diagrama SVG panorâmico unificado e interconectado** (`viewBox="0 0 1620 980"`), no qual todas as 6 sub-redes da planta são renderizadas simultaneamente em 6 zonas bem distribuídas (3 no topo: `water`, `search`, `round`; 3 na base: `materials`, `vehicles`, `agv`), conectadas por 14 elos físicos e lógicos de acoplamento (`COUPLING_LINKS`).
- A escolha do usuário é exclusivamente **qual Modelo de Análise de Grafos** utilizar sobre a planta, selecionado via menu `<select class="select select-sm" data-e02-model-select>` ou pelos botões correspondentes `[data-e02-mode]`:
  1. **`Água / copos · Dijkstra`** (`data-e02-mode="water"`)
  2. **`Busca · BFS · DFS`** (`data-e02-mode="search"`)
  3. **`Inspeção · Euler`** (`data-e02-mode="round"`)
  4. **`AGV · NN · 2-Opt`** (`data-e02-mode="agv"`)
  5. **`Materiais · Kahn`** (`data-e02-mode="materials"`)
  6. **`Veículos · Dijkstra`** (`data-e02-mode="vehicles"`)

---

## 3. Anatomia da Interface do Simulador e Mecânica de Operação

Dentro da bancada (`#e02-sim-workbench`), a tela organiza-se de maneira integrada e intuitiva:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Barra de Modelo: Seletor <select> + 6 Botões de Modelo de Análise     │
├────────────────────────────────────────────────────────────────────────┤
│  Cabeçalho: Código da Aula, Título, Descrição e Selo Unidade           │
├───────────────────────────────────────┬────────────────────────────────┤
│                                       │  Controles de Consulta Ativa   │
│  Diagrama Panorâmico SVG (1620×980)   │  - Seletores Origem / Destino  │
│  - Camada de Zonas (.e02-zone-layer)  │  - Bloqueios (Checkboxes)      │
│  - Camada de Elos (.e02-coupling-layer│  - Ações: Calcular / Restaurar │
│  - 6 Sub-redes (Ativa + 5 Contexto)   │                                │
│  - Legenda e dica responsiva          │                                │
├───────────────────────────────────────┴────────────────────────────────┤
│  Resultado Atual: Título Principal, Frase Explicativa e Lista de Rota  │
├────────────────────────────────────────────────────────────────────────┤
│  Diário Curto: Histórico das últimas 4 ações                           │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Barra de Escolha do Modelo e Cabeçalho
- **Barra de Modelo (`.e02-model-bar`)**:
  - Seletor acessível `<label class="e02-model-select-label">Modelo de análise de grafos <select data-e02-model-select>` sincronizado bidirecionalmente com a lista de botões `[data-e02-mode]`.
  - Deixa explícito ao usuário que as 6 visualizações já estão ativas e interconectadas no diagrama panorâmico, cabendo a ele apenas definir qual modelo matemático deseja consultar e destacar.
- **Cabeçalho da Vista Ativa (`.e02-sim-head`)**:
  - `[data-e02-mode-code]`: Código da aula (`14 / 15`, `13 / busca`, `16 / inspeção`, `17 / AGV`, `18 / materiais` ou `18 / veículos`).
  - `[data-e02-mode-title]`, `[data-e02-mode-description]`: Enunciam o objetivo da análise em foco.
  - `[data-e02-mode-unit]`: Métrica e topologia (`cm · dirigido`, `s · dirigido`, `min · não dirigido`, `s · não dirigido` ou `m · dirigido`).

### 3.2. Diagrama Panorâmico Unificado em SVG (`viewBox="0 0 1620 980"`)
O simulador renderiza integralmente a planta industrial em um único SVG estruturado em camadas ordenadas:
- **Camada de Zonas (`.e02-zone-layer`)**:
  - Seis quadros visuais delimitadores (`.e02-zone`, com atributo `data-e02-zone="<id>"` e título `.e02-zone-title`).
  - Organizados em 3 zonas no topo (`water`, `search`, `round`) e 3 zonas na base (`materials`, `vehicles`, `agv`).
  - A zona do modelo ativo recebe a classe de destaque `.is-active-zone`, com borda acentuada e fundo sutilmente iluminado.
- **Camada de Interconexão (`.e02-coupling-layer`)**:
  - Contém os 14 elos de acoplamento inter-vistas (`.e02-coupling-edge`, com atributo `data-e02-coupling`), traçados como curvas suaves conectando os nós equivalentes:
    1. `water:TK-101_Agua` $\leftrightarrow$ `materials:TK-101_Agua`
    2. `water:TK-101_Agua` $\leftrightarrow$ `search:Reservatorio`
    3. `water:MAG-100_Copos` $\leftrightarrow$ `materials:MAG-100_Copos`
    4. `water:DOS-201_Dosador` $\leftrightarrow$ `materials:E2_ENVASE`
    5. `water:MESA-000_Index` $\leftrightarrow$ `round:MESA`
    6. `water:MESA-000_Index` $\leftrightarrow$ `search:Envasadora`
    7. `water:EST-500_Saida` $\leftrightarrow$ `materials:EST-500_Saida`
    8. `search:Empacotadora` $\leftrightarrow$ `materials:EMBALAGEM`
    9. `search:Estacao_Inspecao` $\leftrightarrow$ `agv:Lab`
    10. `round:S100` $\leftrightarrow$ `materials:E1_DISPENSA`
    11. `round:S500` $\leftrightarrow$ `materials:E5_EJECAO`
    12. `materials:RECEB_COPOS` $\leftrightarrow$ `vehicles:RECEBIMENTO`
    13. `materials:ESTOQUE_PRODUTO` $\leftrightarrow$ `vehicles:ESTOQUE_FINAL`
    14. `materials:DOCA_EXPEDICAO` $\leftrightarrow$ `vehicles:DOCA_EXPEDICAO`
  - Quando um nó participante do elo pertence à rota calculada ativa, o elo ganha `.is-coupled-route` (traço destacado em verde-azulado) e o nó homólogo na outra sub-rede ganha `.is-coupled-node.is-coupled-route`. Caso conectado a um nó bloqueado ativo, recebe `.is-coupled-blocked`.
- **Camadas de Arestas e Nós (`.e02-edge-layer`, `.e02-node-layer`, `.e02-label-layer`)**:
  - **Todas as 6 sub-redes permanecem 100% visíveis simultaneamente**.
  - A sub-rede do modelo ativo destaca a rota principal (`.is-route`, com traço largo verde-azulado e marcadores `#e02-arrow-route`).
  - As demais 5 sub-redes exibem em segundo plano contextual suas respectivas rotas calculadas (`.is-context-route`, com traço fino e marcadores `#e02-arrow-context-route`).
  - Elementos bloqueados exibem traço tracejado avermelhado (`.is-blocked`, marcadores `#e02-arrow-blocked`).
- **Responsividade e Rolagem**:
  - *Desktop (> 760px)*: Diagrama panorâmico exibe largura total responsiva (`min-width: 0`, altura entre 480px e 620px).
  - *Telas estreitas e mobile (≤ 760px)*: A grade passa para layout vertical, o SVG adota largura mínima de 960px e o contêiner `.e02-graph-scroll` ativa rolagem horizontal com dica: *"Em telas estreitas, arraste ou role horizontalmente para ler o diagrama."*

### 3.3. Interatividade Panorâmica e Preservação de Estado em Memória
1. **Preservação de Bloqueios por Modelo**:
   - Cada modelo de análise mantém seu próprio conjunto de bloqueios em memória (`state.blocksByMode`). Alternar entre modelos não apaga nem reinicializa os bloqueios configurados nas outras sub-redes.
2. **Cliques Diretos em Qualquer Zona do SVG**:
   - Clicar em uma aresta ou nó bloqueável de qualquer zona no diagrama SVG ativa automaticamente o modelo daquela zona e alterna o bloqueio instantaneamente, recalculando todas as rotas e elos.
   - Clicar sobre a área de uma zona (`.e02-zone`) altera o modelo ativo para aquela zona.
3. **Seletores e Disparo Imediato (`change`)**:
   - A alteração em qualquer `<select>` de origem, destino ou partida recalcula a rota imediatamente no DOM.
   - O botão `Restaurar vista` limpa os bloqueios e restaura a origem/destino nominais do modelo ativo.
4. **Legenda Panorâmica Atualizada (`[data-e02-legend]`)**:
   - Exibe 5 categorias com amostras de cor:
     * `aresta` (traço padrão suave)
     * `rota calculada` (verde-azulado principal)
     * `rota em outra vista` (verde-azulado contextual)
     * `elo entre vistas (interconexão)` (traço tracejado de acoplamento)
     * `bloqueio acionável` (vermelho tracejado)

### 3.4. Painel de Resultado Atual e Diário Curto
- **`Resultado atual` (`.e02-result`)**:
  - `[data-e02-result-title]`: Custo, saltos ou status do modelo ativo (`270 cm`, `5 arestas por BFS`, `Circuito · 24.5 min`, etc.).
  - `[data-e02-result]`: Explicação detalhada da solução ou do motivo formal da ausência de rota.
  - `[data-e02-route]`: Lista ordenada dos nós do trajeto ativo.
- **`Diário curto` (`.e02-log`)**:
  - Registra as últimas 4 ações da bancada em ordem cronológica inversa.

---

## 4. As Seis Vistas Interativas: Dados, Algoritmos, Unidades e Cenários Didáticos Verificáveis

---

### Vista 1 — `Água / copos · Dijkstra` (Aulas 11, 14 e 15)

- **Identificação na tela**: Código `14 / 15` — *Água e copos: menor caminho*.
- **Métrica e Topologia**: `cm · dirigido`.
- **Algoritmo**: Algoritmo de Dijkstra sobre grafo dirigido ponderado com custos não negativos.
- **Significado físico e topológico**:
  - Representa o **dígrafo de 9 vértices e 9 conexões** formalizado na Aula 11 e estudado nas Aulas 14 e 15:
    - *Ramo hidráulico*: `TK-101_Agua` alimentando as bombas redundantes `P-101_BombaA` ($a_1: 150\text{ cm}$) e `P-102_BombaB` ($a_2: 150\text{ cm}$); as bombas convergem para o manifold `MAN-200_Agua` por $a_3: 80\text{ cm}$ e $a_4: 85\text{ cm}$; o manifold alimenta o cilindro dosador `DOS-201_Dosador` por $a_5: 40\text{ cm}$; o dosador alimenta o bico `BIC-202_Bico` por $a_6: 20\text{ cm}$; o bico descarrega por gravidade na mesa `MESA-000_Index` por $a_7: 10\text{ cm}$.
    - *Ramo mecânico de copos*: `MAG-100_Copos` dispensa copos na mesa por $a_8: 15\text{ cm}$ (Cilindro A); e a mesa transfere os copos fechados para a esteira `EST-500_Saida` por $a_9: 50\text{ cm}$ (Cilindro H).
  - **Filtro didático nos menus `<select>`**: Os menus `Origem` e `Destino` disponibilizam apenas os **6 nós da linha de água** (`TK-101_Agua`, `P-101_BombaA`, `P-102_BombaB`, `MAN-200_Agua`, `DOS-201_Dosador`, `BIC-202_Bico`), pois somar o comprimento de tubulações de água com o transporte físico de copos na mesa seria fisicamente inconsistente. Os 9 nós permanecem desenhados no diagrama SVG para preservar a visão global do dígrafo da Aula 11.

#### Tabela de Conexões da Vista 1
| ID Aresta | Origem | Destino | Peso | Válvula / Atuador | Tipo de Bloqueio |
| :---: | :--- | :--- | :---: | :---: | :--- |
| `a1` | `TK-101_Agua` | `P-101_BombaA` | 150 cm | XV-101A | Clique no SVG |
| `a2` | `TK-101_Agua` | `P-102_BombaB` | 150 cm | XV-101B | Clique no SVG |
| `a3` | `P-101_BombaA` | `MAN-200_Agua` | 80 cm | XV-200A | Checkbox lateral ou SVG |
| `a4` | `P-102_BombaB` | `MAN-200_Agua` | 85 cm | XV-200B | Checkbox lateral ou SVG |
| `a5` | `MAN-200_Agua` | `DOS-201_Dosador` | 40 cm | XV-201 | Clique no SVG (aresta ponte) |
| `a6` | `DOS-201_Dosador` | `BIC-202_Bico` | 20 cm | XV-202 | Clique no SVG |
| `a7` | `BIC-202_Bico` | `MESA-000_Index` | 10 cm | Gravidade | Clique no SVG |
| `a8` | `MAG-100_Copos` | `MESA-000_Index` | 15 cm | Cilindro A | Clique no SVG |
| `a9` | `MESA-000_Index` | `EST-500_Saida` | 50 cm | Cilindro H | Clique no SVG |

#### Cenários Reproduzíveis da Vista 1

1. **Cenário 1.1 — Nominal: Abastecimento via Bomba A (270 cm)**
   - **Sequência de cliques**: Acesse a aba **`Simulador 6 vistas`** e certifique-se de que a vista **`Água / copos · Dijkstra`** está selecionada (estado inicial padrão). Se houver modificações anteriores, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - *Título*: **`270 cm`**
     - *Texto*: `TK-101_Agua → DOS-201_Dosador; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `TK-101_Agua` $\to$ `P-101_BombaA` $\to$ `MAN-200_Agua` $\to$ `DOS-201_Dosador` (arestas `a1`, `a3`, `a5`).
     - *Diário curto*: `Dijkstra: 270 cm.`
   - **Verificação analítica**: $150 + 80 + 40 = 270\text{ cm}$. O caminho via Bomba B somaria $150 + 85 + 40 = 275\text{ cm}$, sendo corretamente preterido pelo Dijkstra.

2. **Cenário 1.2 — Contingência: Bloqueio da Linha Principal A (Desvio via Bomba B — 275 cm)**
   - **Sequência de cliques**: Na coluna **Bloqueios**, marque a caixa **`a3 · P-101_BombaA → MAN-200_Agua · 80 cm`** (ou clique na aresta `a3` no diagrama SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`275 cm`**
     - *Texto*: `TK-101_Agua → DOS-201_Dosador; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `TK-101_Agua` $\to$ `P-102_BombaB` $\to$ `MAN-200_Agua` $\to$ `DOS-201_Dosador` (arestas `a2`, `a4`, `a5`).
     - *Diário curto*: `Dijkstra: 275 cm.`

3. **Cenário 1.3 — Falha Dupla: Isolamento das Duas Bombas (`Sem rota`)**
   - **Sequência de cliques**: Mantendo `a3` marcado, marque também a caixa **`a4 · P-102_BombaB → MAN-200_Agua · 85 cm`**.
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota. Nenhum caminho é exibido.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Dijkstra: sem rota.`
   - **Significado**: Mostra que a redundância em paralelo suporta falha simples em uma das bombas, mas não protege contra perda simultânea das duas alimentações.

4. **Cenário 1.4 — Ponto Único de Falha: Bloqueio do Manifold (`Sem rota`)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. Em **Bloqueios**, marque a caixa **`Nó · MAN-200_Agua`** (ou clique no retângulo do nó `MAN-200_Agua` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota. Nenhum caminho é exibido.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Dijkstra: sem rota.`
   - **Significado didático**: O `MAN-200_Agua` é um **vértice de articulação (nó crítico)**; mesmo com ambas as bombas operacionais, o bloqueio do nó convergente interrompe todo o escoamento.

5. **Cenário 1.5 — Aresta-Ponte Crítica Bloqueada no SVG com Aviso Dinâmico (`Sem rota`)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. No diagrama SVG, clique diretamente sobre a aresta **`a5 · 40`** (`MAN-200_Agua → DOS-201_Dosador`).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota. Nenhum caminho é exibido.`
     - *Aviso dinâmico lateral*: Surge o parágrafo `<p data-e02-extra-blocks="" aria-live="polite">Arestas bloqueadas no diagrama: a5.</p>`.
     - *Diário curto*: `Dijkstra: sem rota.`
   - **Significado didático**: `a5` é uma **aresta ponte (aresta crítica)**. Sua interdição isola o dosador da fonte.

6. **Cenário 1.6 — Consulta Estendida até o Bico de Envase (290 cm)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. No seletor **`Destino`**, selecione **`BIC-202_Bico`**.
   - **Resultado exibido (imediato)**:
     - *Título*: **`290 cm`**
     - *Texto*: `TK-101_Agua → BIC-202_Bico; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `TK-101_Agua` $\to$ `P-101_BombaA` $\to$ `MAN-200_Agua` $\to$ `DOS-201_Dosador` $\to$ `BIC-202_Bico` (arestas `a1`, `a3`, `a5`, `a6`).
     - *Diário curto*: `Dijkstra: 290 cm.`
   - **Verificação**: $270 + 20 = 290\text{ cm}$.

7. **Cenário 1.7 — Origem Igual ao Destino (0 cm)**
   - **Sequência de cliques**: No seletor **`Origem`**, selecione **`DOS-201_Dosador`** (com `Destino = DOS-201_Dosador`).
   - **Resultado exibido (imediato)**:
     - *Título*: **`0 cm`**
     - *Texto*: `DOS-201_Dosador → DOS-201_Dosador; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `DOS-201_Dosador` (distância nula, nenhuma aresta).

---

### Vista 2 — `Busca · BFS · DFS` (Aula 13)

- **Identificação na tela**: Código `13 / busca` — *BFS e DFS: saltos e caminhos*.
- **Métrica e Topologia**: `s · dirigido`.
- **Algoritmos**:
  - **BFS (Busca em Largura)**: Explora em camadas por fila FIFO, determinando o caminho com o menor número de arestas/saltos ($O(|V|+|E|)$).
  - **DFS (Busca em Profundidade)**: Explora com retrocesso (*backtracking*), enumerando caminhos simples entre origem e destino (com teto preventivo de 40 caminhos).
- **Significado físico e topológico**:
  - Modela o grafo didático simplificado próprio da Aula 13 com 7 nós (`Reservatorio`, `Bomba`, `V1`, `V2`, `Envasadora`, `Estacao_Inspecao`, `Empacotadora`) e 7 arcos dirigidos (`b1` a `b7`).
  - **Ponto conceitual crítico (BFS ignora pesos)**: As arestas possuem pesos expressos em segundos ($5\text{ s}, 2\text{ s}, 3\text{ s}, 4\text{ s}, 6\text{ s}, 3\text{ s}, 2\text{ s}$), mas **o algoritmo BFS ignora totalmente os pesos em segundos** e minimiza apenas o **número de saltos**. Como os ramos via `V1` e via `V2` contêm exatamente 5 saltos cada, a BFS desempata pelo critério determinístico de ordem de inserção na lista de adjacência (ramo por `V1`).

#### Tabela de Conexões da Vista 2
| ID Aresta | Origem | Destino | Peso | Descrição do Trecho | Bloqueio |
| :---: | :--- | :--- | :---: | :--- | :--- |
| `b1` | `Reservatorio` | `Bomba` | 5 s | Sucção do reservatório | Clique no SVG |
| `b2` | `Bomba` | `V1` | 2 s | Linha de alimentação via Válvula 1 | Clique no SVG |
| `b3` | `Bomba` | `V2` | 3 s | Linha de alimentação via Válvula 2 | Clique no SVG |
| `b4` | `V1` | `Envasadora` | 4 s | Descarga da V1 na envasadora | Clique no SVG |
| `b5` | `V2` | `Envasadora` | 6 s | Descarga da V2 na envasadora | Clique no SVG |
| `b6` | `Envasadora` | `Estacao_Inspecao` | 3 s | Transferência para inspeção | Clique no SVG |
| `b7` | `Estacao_Inspecao` | `Empacotadora` | 2 s | Transferência para empacotadora | Clique no SVG |

#### Cenários Reproduzíveis da Vista 2

1. **Cenário 2.1 — Nominal: Menor Número de Saltos por BFS e Duas Rotas por DFS**
   - **Sequência de cliques**: Clique no botão de vista **`Busca · BFS · DFS`** (`#e02-mode-search`). Ele inicializa com `Origem = Reservatorio` e `Destino = Empacotadora`. Se necessário, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - *Título*: **`5 arestas por BFS`**
     - *Texto*: `DFS encontrou 2 caminho(s) simples: Reservatorio → Bomba → V1 → Envasadora → Estacao_Inspecao → Empacotadora | Reservatorio → Bomba → V2 → Envasadora → Estacao_Inspecao → Empacotadora; BFS ignora os pesos em s.`
     - *Rota destacada*: `Reservatorio` $\to$ `Bomba` $\to$ `V1` $\to$ `Envasadora` $\to$ `Estacao_Inspecao` $\to$ `Empacotadora` (5 arestas: `b1`, `b2`, `b4`, `b6`, `b7`).
     - *Diário curto*: `BFS: 5 saltos; DFS: 2 caminho(s).`
   - **Nota sobre pesos**: Se somássemos os segundos, a rota por V1 custaria $5+2+4+3+2 = 16\text{ s}$ e por V2 custaria $5+3+6+3+2 = 19\text{ s}$. Contudo, a BFS reporta `5 arestas por BFS` porque seu critério é estritamente topológico por camadas, e não ponderado.

2. **Cenário 2.2 — Bloqueio do Nó `V1` (Desvio por `V2`)**
   - **Sequência de cliques**: Na seção **Bloqueios**, marque a caixa **`Nó · V1`** (ou clique no retângulo do nó `V1` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`5 arestas por BFS`**
     - *Texto*: `DFS encontrou 1 caminho(s) simples: Reservatorio → Bomba → V2 → Envasadora → Estacao_Inspecao → Empacotadora; BFS ignora os pesos em s.`
     - *Rota destacada*: `Reservatorio` $\to$ `Bomba` $\to$ `V2` $\to$ `Envasadora` $\to$ `Estacao_Inspecao` $\to$ `Empacotadora` (5 arestas: `b1`, `b3`, `b5`, `b6`, `b7`).
     - *Diário curto*: `BFS: 5 saltos; DFS: 1 caminho(s).`

3. **Cenário 2.3 — Bloqueio Simultâneo de `V1` e `V2` (`Sem rota`)**
   - **Sequência de cliques**: Mantendo `Nó · V1` marcado, marque também a caixa **`Nó · V2`** (ou clique no retângulo do nó `V2` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Busca: sem rota.`

4. **Cenário 2.4 — Bloqueio de Vértice Intermediário Crítico (ex.: `Bomba`)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. No SVG, bloqueie a aresta de sucção **`b1`** (`Reservatorio → Bomba`).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota.`
     - *Aviso dinâmico*: `Arestas bloqueadas no diagrama: b1.`
     - *Diário curto*: `Busca: sem rota.`

---

### Vista 3 — `Inspeção · Euler` (Aula 16)

- **Identificação na tela**: Código `16 / inspeção` — *Ronda: circuito Euleriano*.
- **Métrica e Topologia**: `min · não dirigido`.
- **Algoritmo**: Verificação de componentes conexos ativos + paridade de graus + **Algoritmo de Hierholzer por ID de aresta** ($O(|E|)$).
- **Significado físico e topológico**:
  - Modela a **ronda preventiva de manutenção** por **8 postos físicos** (`PAINEL`, `FRL-001`, `S100`, `S200`, `S300`, `S400`, `S500`, `MESA`) e **10 trechos não dirigidos** (`t1` a `t10`), somando **24,5 minutos** de inspeção.
  - A estrutura é composta por dois anéis acoplados: o anel externo (`PAINEL` $\to$ `FRL` $\to$ estações $\to$ `PAINEL`) e o anel interno (`MESA` com chicotes do motor `M-001`, encoder e cabo IO-Link ligando a `S200` e `S400`).
  - No estado nominal, todos os 8 nós possuem **grau par**: `S200` e `S400` têm grau 4; os outros seis nós têm grau 2. Por conseguinte, pelo **Teorema de Euler**, existe um **circuito euleriano fechado** que percorre todos os 10 trechos exatamente uma vez e retorna à origem.
  - *(Diferenciação importante: a caça a vazamentos com Carteiro Chinês de 57,8 min e o circuito CIP de 20 min pertencem a outros modelos da Aula 16 e estão documentados na aba `Arquivos`).*

#### Tabela de Trechos da Vista 3
| ID Trecho | Vértice 1 | Vértice 2 | Tempo (min) | Elemento Físico Inspecionado |
| :---: | :--- | :--- | :---: | :--- |
| `t1` | `PAINEL` | `FRL-001` | 3,0 min | Alimentação e filtro principal de ar |
| `t2` | `FRL-001` | `S100` | 2,0 min | Linha pneumática para estação E1 |
| `t3` | `S100` | `S200` | 2,5 min | Chicote de sensores E1 para E2 |
| `t4` | `S200` | `S300` | 3,0 min | Chicote e válvulas E2 para E3 |
| `t5` | `S300` | `S400` | 2,5 min | Linha de vácuo e controle E3 para E4 |
| `t6` | `S400` | `S500` | 3,5 min | Alimentação pneumática da prensa e ejeção E4 para E5 |
| `t7` | `S500` | `PAINEL` | 3,0 min | Retorno de cabeamento de esteira ao painel |
| `t8` | `MESA` | `S200` | 1,5 min | Cabo de encoder e servomotor da mesa indexadora |
| `t9` | `S200` | `S400` | 2,0 min | Barramento central de comunicação IO-Link |
| `t10` | `S400` | `MESA` | 1,5 min | Chicote de aterramento e sensores de indexação |

#### Cenários Reproduzíveis da Vista 3

1. **Cenário 3.1 — Nominal: Circuito Euleriano Fechado (24,5 min)**
   - **Sequência de cliques**: Clique no botão de vista **`Inspeção · Euler`** (`#e02-mode-round`). Se necessário, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - *Título*: **`Circuito · 24.5 min`**
     - *Texto*: `Hierholzer usou 10 IDs uma vez cada (t1 → t2 → t3 → t4 → t5 → t9 → t8 → t10 → t6 → t7).`
     - *Rota destacada (11 paradas, iniciando e concluindo em `PAINEL`)*:
       `PAINEL` $\to$ `FRL-001` $\to$ `S100` $\to$ `S200` $\to$ `S300` $\to$ `S400` $\to$ `S200` $\to$ `MESA` $\to$ `S400` $\to$ `S500` $\to$ `PAINEL`.
     - *Diário curto*: `Euler: circuito, 24.5 min.`
   - **Verificação analítica**: Soma dos 10 trechos: $3,0 + 2,0 + 2,5 + 3,0 + 2,5 + 3,5 + 3,0 + 1,5 + 2,0 + 1,5 = 24,5\text{ min}$. Todos os 10 IDs foram consumidos uma única vez sem repetição de aresta.

2. **Cenário 3.2 — Bloqueio Simples: Quebra para 2 Vértices Ímpares (Trilha Euleriana Aberta de 22,5 min)**
   - **Sequência de cliques**: Na seção **Bloqueios**, marque a caixa **`t9 · S200 — S400 · 2 min`** (ou clique na aresta `t9` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Trilha · 22.5 min`**
     - *Texto*: `Hierholzer usou 9 IDs uma vez cada (t3 → t2 → t1 → t7 → t6 → t5 → t4 → t8 → t10).`
     - *Rota destacada (10 paradas, aberta)*:
       `S200` $\to$ `S100` $\to$ `FRL-001` $\to$ `PAINEL` $\to$ `S500` $\to$ `S400` $\to$ `S300` $\to$ `S200` $\to$ `MESA` $\to$ `S400`.
     - *Diário curto*: `Euler: trilha, 22.5 min.`
   - **Significado didático**: A remoção de `t9` reduz o grau de `S200` de 4 para 3 e o de `S400` de 4 para 3. Havendo **exatamente dois vértices de grau ímpar**, o Teorema de Euler assegura a existência de uma **trilha euleriana aberta**, que obrigatoriamente tem início em um vértice ímpar (`S200`) e término no outro (`S400`), somando $24,5 - 2,0 = 22,5\text{ min}$.

3. **Cenário 3.3 — Quebra de Paridade com > 2 Vértices Ímpares (`Rota Euleriana indisponível`)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. Em **Bloqueios**, marque **`t1 · PAINEL — FRL-001 · 3 min`** e marque também **`t4 · S200 — S300 · 3 min`**.
   - **Resultado exibido (imediato)**:
     - *Título*: **`Rota Euleriana indisponível`**
     - *Texto*: `paridade inválida; não há rota exibida.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Euler: paridade inválida.`
   - **Significado didático**: O bloqueio simultâneo de `t1` e `t4` gera 4 vértices de grau ímpar (`PAINEL`, `FRL-001`, `S200`, `S300`), inviabilizando qualquer percurso euleriano sem duplicação de trechos.

4. **Cenário 3.4 — Subgrafo Desconexo (`Rota Euleriana indisponível`)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. Marque **`t2 · FRL-001 — S100 · 2 min`** e marque **`t7 · S500 — PAINEL · 3 min`**.
   - **Resultado exibido (imediato)**:
     - *Título*: **`Rota Euleriana indisponível`**
     - *Texto*: `subgrafo desconexo; não há rota exibida.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Euler: subgrafo desconexo.`
   - **Significado didático**: A aresta ativa `t1` (`PAINEL — FRL-001`) fica isolada em uma componente conexa separada dos demais 7 trechos ativos. Um passeio euleriano não pode saltar no espaço vazio entre componentes disjuntas.

5. **Cenário 3.5 — Ausência Total de Trechos Ativos (`sem trechos ativos`)**
   - **Sequência de cliques**: No código ([`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs)), quando todas as arestas são bloqueadas simultaneamente, o simulador retorna `{ ok: false, reason: "sem trechos ativos" }`. Na interface, isso pode ser alcançado marcando todos os checkboxes `t1` a `t10`.

---

### Vista 4 — `AGV · NN · 2-Opt` (Aula 17)

- **Identificação na tela**: Código `17 / AGV` — *Matriz legada: NN e 2-Opt*.
- **Métrica e Topologia**: `s · não dirigido`.
- **Algoritmos**: Heurística construtiva do **Vizinho Mais Próximo (Nearest Neighbor — NN)** com desempate determinístico, seguida de refinamento por busca local **2-Opt** com critério de melhoria estrita.
- **Rigor sobre a proveniência dos dados**:
  - Os 6 vértices (`Lab`, `TK301`, `TK302`, `R101`, `TK303`, `GRAN201`) e as 15 arestas (`g1` a `g15`, formando um grafo completo $K_6$ simétrico) foram **adotados diretamente da matriz ilustrativa legada do notebook da Aula 17**.
  - **Não confunda esses nomes com equipamentos da envasadora!** `TK301` e `GRAN201` pertencem ao exercício didático de Caixeiro-Viajante (TSP) disponibilizado para estudo de heurísticas.
  - **Heurística vs. Ótimo Global**: O Problema do Caixeiro-Viajante é NP-difícil. A rota obtida de **`260 s`** é uma **solução candidata válida e melhorada**, e não uma garantia matemática de ótimo global para instâncias genéricas.

#### Tabela de Arestas da Matriz Ilustrativa ($K_6$)
| ID | Vértices Conectados | Custo (s) | ID | Vértices Conectados | Custo (s) | ID | Vértices Conectados | Custo (s) |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: | :--- | :---: |
| `g1` | `Lab` — `TK301` | 45 s | `g6` | `TK301` — `TK302` | 20 s | `g11` | `TK302` — `TK303` | 50 s |
| `g2` | `Lab` — `TK302` | 50 s | `g7` | `TK301` — `R101` | 55 s | `g12` | `TK302` — `GRAN201` | 85 s |
| `g3` | `Lab` — `R101` | 80 s | `g8` | `TK301` — `TK303` | 60 s | `g13` | `R101` — `TK303` | 25 s |
| `g4` | `Lab` — `TK303` | 75 s | `g9` | `TK301` — `GRAN201` | 95 s | `g14` | `R101` — `GRAN201` | 40 s |
| `g5` | `Lab` — `GRAN201` | 110 s | `g10` | `TK302` — `R101` | 45 s | `g15` | `TK303` — `GRAN201` | 35 s |

#### Cenários Reproduzíveis da Vista 4

1. **Cenário 4.1 — Nominal: Partida em `Lab` (Melhoria 2-Opt de 280 s para 260 s)**
   - **Sequência de cliques**: Clique no botão de vista **`AGV · NN · 2-Opt`** (`#e02-mode-agv`). A vista abre com `Partida (matriz ilustrativa) = Lab`. Se necessário, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - *Título*: **`NN 280 s → 2-Opt 260 s`**
     - *Texto*: `NN inicial (Lab → TK301 → TK302 → R101 → TK303 → GRAN201 → Lab) refinada por 2-Opt; a melhoria aceita apenas troca estritamente melhor e é candidata, não ótimo global.`
     - *Rota final destacada*:
       `Lab` $\to$ `TK301` $\to$ `TK302` $\to$ `R101` $\to$ `GRAN201` $\to$ `TK303` $\to$ `Lab` (arestas `g1`, `g6`, `g10`, `g14`, `g15`, `g4`).
     - *Diário curto*: `NN 280 s; 2-Opt 260 s.`
   - **Mecanismo da melhoria**:
     - O Vizinho Mais Próximo construiu a rota gulosa: `Lab` $\xrightarrow{45}$ `TK301` $\xrightarrow{20}$ `TK302` $\xrightarrow{45}$ `R101` $\xrightarrow{25}$ `TK303` $\xrightarrow{35}$ `GRAN201` $\xrightarrow{110}$ `Lab`, totalizando **$280\text{ s}$**. Note o salto longo de retorno `GRAN201 → Lab` (110 s).
     - A busca local 2-Opt testou as inversões de 2 arestas e identificou que inverter a ordem dos dois últimos vértices (`GRAN201` com `TK303`) produz: `R101` $\xrightarrow{40}$ `GRAN201` $\xrightarrow{35}$ `TK303` $\xrightarrow{75}$ `Lab`, totalizando **$260\text{ s}$** ($45 + 20 + 45 + 40 + 35 + 75 = 260\text{ s}$).
     - A economia obtida foi de **$20\text{ s}$**. Como uma nova rodada de 2-Opt não encontra nenhuma redução estrita, o algoritmo estaciona no mínimo local.

2. **Cenário 4.2 — Testando Outros Vértices de Partida**
   - **Sequência de cliques**: No seletor **`Partida (matriz ilustrativa)`**, escolha outro vértice (ex.: `TK301` ou `TK303`).
   - **Resultado exibido**: O simulador recalcula a rota e o custo de forma imediata (evento `change`). Para retornar à configuração padrão de referência, clique em **`Restaurar vista`**.

---

### Vista 5 — `Materiais · Kahn` (Aula 18 — Camada de Materiais)

- **Identificação na tela**: Código `18 / materiais` — *Precedências: ordenação de Kahn*.
- **Métrica e Topologia**: `m · dirigido`.
- **Algoritmo**: Algoritmo de Kahn para ordenação topológica em **DAG** (Grafo Acíclico Dirigido).
- **Significado físico e topológico**:
  - Modela a **precedência lógica de fabricação** do produto desde os três recebimentos de insumos até a doca de expedição:
    - *Copos*: `RECEB_COPOS` $\xrightarrow{8\text{ m}}$ `ESTOQUE_COPOS` $\xrightarrow{6\text{ m}}$ `MAG-100_Copos` $\xrightarrow{1\text{ m}}$ `E1_DISPENSA`;
    - *Água*: `RECEB_AGUA` $\xrightarrow{10\text{ m}}$ `TK-101_Agua` $\xrightarrow{2.7\text{ m}}$ `E2_ENVASE`;
    - *Tampas*: `RECEB_TAMPAS` $\xrightarrow{7\text{ m}}$ `ESTOQUE_TAMPAS` $\xrightarrow{5\text{ m}}$ `E3_TAMPA`;
    - *Espinha dorsal de transformação na mesa indexadora*: `E1_DISPENSA` $\xrightarrow{0.6\text{ m}}$ `E2_ENVASE` $\xrightarrow{0.6\text{ m}}$ `E3_TAMPA` $\xrightarrow{0.6\text{ m}}$ `E4_SELAGEM` $\xrightarrow{0.6\text{ m}}$ `E5_EJECAO`;
    - *Expedição final*: `E5_EJECAO` $\xrightarrow{0.8\text{ m}}$ `EST-500_Saida` $\xrightarrow{3\text{ m}}$ `EMBALAGEM` $\xrightarrow{5\text{ m}}$ `ESTOQUE_PRODUTO` $\xrightarrow{8\text{ m}}$ `DOCA_EXPEDICAO`.
  - **Destaque visual comprovado no código**:
    - O algoritmo de Kahn ordena todos os 16 vértices.
    - No diagrama SVG, **as 4 arestas da espinha dorsal da máquina (`m8`, `m9`, `m10`, `m11`), que unem `E1_DISPENSA` $\to$ `E2_ENVASE` $\to$ `E3_TAMPA` $\to$ `E4_SELAGEM` $\to$ `E5_EJECAO`, recebem destaque visual na cor verde-azulada (`.is-route`)**, evidenciando o caminho produtivo central da máquina no DAG.
- **Ressalva conceitual essencial**: A ordenação topológica comprova ausência de ciclos dirigidos e determina uma sequência viável de tarefas. No entanto, **a convergência de arcos no DAG não comprova disponibilidade conjunta (operação lógica AND)** de copos, água, tampas e ar comprimido, nem substitui os sensores de barreira e intertravamentos de segurança física da máquina.

#### Tabela de Precedências do DAG de Materiais (16 Vértices, 15 Arestas)
| ID Aresta | Origem | Destino | Peso (m) | Significado no Processo |
| :---: | :--- | :--- | :---: | :--- |
| `m1` | `RECEB_COPOS` | `ESTOQUE_COPOS` | 8,0 m | Recepção e armazenamento de copos |
| `m2` | `ESTOQUE_COPOS` | `MAG-100_Copos` | 6,0 m | Abastecimento do magazine de copos |
| `m3` | `MAG-100_Copos` | `E1_DISPENSA` | 1,0 m | Liberação do copo para o alojamento da mesa |
| `m4` | `RECEB_AGUA` | `TK-101_Agua` | 10,0 m | Captação e enchimento do reservatório de água |
| `m5` | `TK-101_Agua` | `E2_ENVASE` | 2,7 m | Conexão da rede de água ao dosador de 150 ml |
| `m6` | `RECEB_TAMPAS` | `ESTOQUE_TAMPAS` | 7,0 m | Recepção e guarda de tampas seláveis |
| `m7` | `ESTOQUE_TAMPAS` | `E3_TAMPA` | 5,0 m | Alimentação do magazine de tampas |
| `m8` | `E1_DISPENSA` | `E2_ENVASE` | 0,6 m | Avanço da mesa indexadora da dispensa ao envase |
| `m9` | `E2_ENVASE` | `E3_TAMPA` | 0,6 m | Avanço da mesa do envase ao posicionamento de tampa |
| `m10` | `E3_TAMPA` | `E4_SELAGEM` | 0,6 m | Avanço da mesa da tampa à prensa de termosselagem |
| `m11` | `E4_SELAGEM` | `E5_EJECAO` | 0,6 m | Avanço da mesa da termosselagem à estação de ejeção |
| `m12` | `E5_EJECAO` | `EST-500_Saida` | 0,8 m | Ejeção do copo pronto para a esteira motorizada |
| `m13` | `EST-500_Saida` | `EMBALAGEM` | 3,0 m | Transporte por esteira até a célula de encaixotamento |
| `m14` | `EMBALAGEM` | `ESTOQUE_PRODUTO` | 5,0 m | Paletização e envio ao estoque de produtos acabados |
| `m15` | `ESTOQUE_PRODUTO` | `DOCA_EXPEDICAO` | 8,0 m | Transferência para a doca de expedição |

#### Cenários Reproduzíveis da Vista 5

1. **Cenário 5.1 — Ordenação Topológica Completa Preservando E1–E5**
   - **Sequência de cliques**: Clique no botão de vista **`Materiais · Kahn`** (`#e02-mode-materials`). Não há seletores de origem/destino nem bloqueios nesta vista.
   - **Resultado exibido**:
     - *Título*: **`16 vértices ordenados`**
     - *Texto*: `Kahn ordenou precedências; E1_DISPENSA → E2_ENVASE → E3_TAMPA → E4_SELAGEM → E5_EJECAO (E1–E5) permanece no DAG.`
     - *Arestas destacadas no SVG*: `m8`, `m9`, `m10`, `m11` em verde-azulado (`.is-route`).
     - *Lista ordenada de 16 vértices*:
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
     - *Diário curto*: `Kahn: 16 vértices.`
   - **Verificação**: A ordem respeita rigorosamente as precedências: os insumos são preparados antes das estações de montagem, a cadeia $E_1 \to E_2 \to E_3 \to E_4 \to E_5$ é respeitada e a expedição aparece ao final.

2. **Cenário de Teste — Detecção de Ciclo em Grafo Dirigido Inválido (`ciclo detectado`)**
   - O algoritmo de Kahn em [`js/etapa-02-simulator.js`](js/etapa-02-simulator.js) verifica se a contagem de nós ordenados iguala o número total de vértices. Nos testes automatizados ([`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs)), submeter um grafo cíclico retorna `{ ok: false, reason: "ciclo detectado" }`. Na interface web nominal, o DAG de materiais é estritamente acíclico.

---

### Vista 6 — `Veículos · Dijkstra` (Aula 18 — Camada de Circulação Interna)

- **Identificação na tela**: Código `18 / veículos` — *Veículos: menor caminho*.
- **Métrica e Topologia**: `m · dirigido`.
- **Algoritmo**: Dijkstra sobre dígrafo de vias e corredores industriais.
- **Por que esta vista é separada da vista de Materiais?**:
  - Um veículo de transporte interno (carrinho ou empilhadeira) transita por **corredores e vias físicas de mão dupla** e por **anéis de retorno à portaria**. Esse grafo possui **ciclos legítimos** (ex.: `CORREDOR_A` $\leftrightarrow$ `CORREDOR_B` e `DOCA_EXPEDICAO` $\to$ `SAIDA` $\to$ `PORTARIA`).
  - Tentar modelar materiais e veículos no mesmo grafo provocaria um paradoxo matemático: o algoritmo de Kahn falharia devido aos ciclos dos corredores, e o Dijkstra de veículos calcularia trajetos impossíveis que atravessariam cilindros pneumáticos ou bicos dosadores de água.

#### Tabela de Conexões da Camada de Veículos (9 Vértices, 14 Arestas)
| ID Aresta | Origem | Destino | Peso (m) | Descrição da Via | Bloqueio |
| :---: | :--- | :--- | :---: | :--- | :--- |
| `v1` | `PORTARIA` | `RECEBIMENTO` | 20 m | Acesso da portaria ao recebimento | Clique no SVG |
| `v2` | `RECEBIMENTO` | `CORREDOR_A` | 10 m | Entrada do recebimento para Corredor A | Clique no SVG |
| `v3` | `CORREDOR_A` | `RECEBIMENTO` | 10 m | Retorno do Corredor A para recebimento | Clique no SVG |
| `v4` | `CORREDOR_A` | `ABASTECIMENTO` | 8 m | Ramo para área de abastecimento | Clique no SVG |
| `v5` | `ABASTECIMENTO` | `CORREDOR_A` | 8 m | Retorno do abastecimento para Corredor A | Clique no SVG |
| `v6` | `CORREDOR_A` | `CORREDOR_B` | 12 m | Interligação interna Corredor A $\to$ B | Clique no SVG |
| `v7` | `CORREDOR_B` | `CORREDOR_A` | 12 m | Interligação interna Corredor B $\to$ A | Clique no SVG |
| `v8` | `CORREDOR_B` | `ESTOQUE_FINAL` | 8 m | Acesso ao estoque final de produtos | Clique no SVG |
| `v9` | `ESTOQUE_FINAL` | `CORREDOR_B` | 8 m | Saída do estoque final para Corredor B | Clique no SVG |
| `v10` | `ESTOQUE_FINAL` | `DOCA_EXPEDICAO` | 10 m | Transferência final para doca | Clique no SVG |
| `v11` | `DOCA_EXPEDICAO` | `SAIDA` | 15 m | Saída dos veículos da doca | Clique no SVG |
| `v12` | `SAIDA` | `PORTARIA` | 10 m | Retorno externo à portaria principal | Clique no SVG |
| `v13` | `RECEBIMENTO` | `VIA_EXTERNA` | 30 m | Acesso direto pelo pátio externo | Clique no SVG |
| `v14` | `VIA_EXTERNA` | `DOCA_EXPEDICAO` | 35 m | Contorno externo até a doca de expedição | Clique no SVG |

#### Cenários Reproduzíveis da Vista 6

1. **Cenário 6.1 — Nominal: Transporte Interno pelos Corredores A e B (40 m)**
   - **Sequência de cliques**: Clique no botão de vista **`Veículos · Dijkstra`** (`#e02-mode-vehicles`). Abre com `Origem = RECEBIMENTO` e `Destino = DOCA_EXPEDICAO`. Se necessário, clique em **`Restaurar vista`**.
   - **Resultado exibido**:
     - *Título*: **`40 m`**
     - *Texto*: `RECEBIMENTO → DOCA_EXPEDICAO; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `RECEBIMENTO` $\to$ `CORREDOR_A` $\to$ `CORREDOR_B` $\to$ `ESTOQUE_FINAL` $\to$ `DOCA_EXPEDICAO` (arestas `v2`, `v6`, `v8`, `v10`).
     - *Diário curto*: `Dijkstra: 40 m.`
   - **Verificação analítica**: $10 + 12 + 8 + 10 = 40\text{ m}$. A alternativa pela Via Externa somaria $30 + 35 = 65\text{ m}$, sendo rejeitada por ter maior distância.

2. **Cenário 6.2 — Contingência: Interdição do Corredor B (Desvio pela Via Externa — 65 m)**
   - **Sequência de cliques**: Na seção **Bloqueios**, marque a caixa **`Nó · CORREDOR_B`** (ou clique no retângulo do nó `CORREDOR_B` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`65 m`**
     - *Texto*: `RECEBIMENTO → DOCA_EXPEDICAO; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `RECEBIMENTO` $\to$ `VIA_EXTERNA` $\to$ `DOCA_EXPEDICAO` (arestas `v13`, `v14`).
     - *Diário curto*: `Dijkstra: 65 m.`

3. **Cenário 6.3 — Falha Dupla: Bloqueio do Corredor B e da Via Externa (`Sem rota`)**
   - **Sequência de cliques**: Mantendo `Nó · CORREDOR_B` marcado, marque também **`Nó · VIA_EXTERNA`** (ou clique no nó `VIA_EXTERNA` no SVG).
   - **Resultado exibido (imediato)**:
     - *Título*: **`Sem rota`**
     - *Texto*: `sem rota. Nenhum caminho é exibido.`
     - *Rota destacada*: Lista vazia.
     - *Diário curto*: `Dijkstra: sem rota.`

4. **Cenário 6.4 — Ciclo de Retorno Completo até a Portaria (25 m)**
   - **Sequência de cliques**: Clique em **`Restaurar vista`**. No menu **`Origem`**, escolha **`DOCA_EXPEDICAO`**; no menu **`Destino`**, escolha **`PORTARIA`**.
   - **Resultado exibido (imediato)**:
     - *Título*: **`25 m`**
     - *Texto*: `DOCA_EXPEDICAO → PORTARIA; Dijkstra respeitou direção, pesos e bloqueios.`
     - *Rota destacada*: `DOCA_EXPEDICAO` $\to$ `SAIDA` $\to$ `PORTARIA` (arestas `v11`, `v12`).
     - *Diário curto*: `Dijkstra: 25 m.`
   - **Verificação analítica**: $15 + 10 = 25\text{ m}$. Comprova que o dígrafo de circulação contempla circuitos de retorno e vias de tráfego que seriam incompatíveis com um grafo acíclico.

---

## 5. Quadro Comparativo Consolidado das Seis Vistas

| Botão da Vista | Aulas | Sentido e Unidade | Algoritmo | Controles e Bloqueios | Resultado Nominal | Estados de Desvio / Falha |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **`Água / copos`** | 11, 14, 15 | Dirigido · `cm` | `dijkstra()` | Menus: 6 nós hidráulicos.<br>Bloqueios: `a3`, `a4`, `MAN-200_Agua` + SVG. | **`270 cm`** (via Bomba A) | Bloq. `a3`: **`275 cm`** (Bomba B).<br>Bloq. `a3`+`a4` ou `MAN`: **`Sem rota`**. |
| **`Busca`** | 13 | Dirigido · `s` | `bfs()` + `dfsPaths()` | Menus: 7 nós.<br>Bloqueios: `V1`, `V2` + SVG. | **`5 arestas por BFS`**<br>(DFS: 2 caminhos simples) | Bloq. `V1`: **`5 arestas por BFS`** via `V2` (DFS: 1 caminho).<br>Bloq. `V1`+`V2`: **`Sem rota`**. |
| **`Inspeção`** | 16 | Não dirigido · `min` | `euler()` (Hierholzer por ID) | Sem `<select>`.<br>Bloqueios: `t1` a `t10` + SVG. | **`Circuito · 24.5 min`**<br>(10 IDs, graus pares) | 1 trecho (`t9`): **`Trilha · 22.5 min`**.<br>>2 ímpares ou desconexo: **`Rota Euleriana indisponível`**. |
| **`AGV`** | 17 | Não dirigido · `s` | `nearestNeighbor()` + `twoOpt()` | Menu: `Partida` (`Lab` padrão).<br>Sem bloqueios. | **`NN 280 s → 2-Opt 260 s`**<br>(Partindo do `Lab`) | Partida em outros vértices calcula ciclicamente sobre a matriz $K_6$. |
| **`Materiais`** | 18 | Dirigido (DAG) · `m` | `kahn()` | Sem `<select>`.<br>Sem bloqueios. | **`16 vértices ordenados`**<br>(Espinha $E_1$ a $E_5$ destacada) | DAG estrutural invariante; rejeita ciclos nos testes. |
| **`Veículos`** | 18 | Dirigido · `m` | `dijkstra()` | Menus: 9 áreas fabris.<br>Bloqueios: `CORREDOR_B`, `VIA_EXTERNA` + SVG. | **`40 m`**<br>(Corredores A e B) | Bloq. `CORREDOR_B`: **`65 m`** (Via Externa).<br>Bloq. ambos: **`Sem rota`**. |

---

## 6. Diferenciação de Modelos, Hipóteses e Limites Metodológicos

Ao apresentar ou documentar o projeto, mantenha total rigor sobre os seguintes limites técnicos:

1. **Grafos Independentes e Visualização Panorâmica Interconectada**:
   - O simulador unifica visualmente as seis sub-redes em um único diagrama SVG panorâmico com 14 elos de acoplamento (`COUPLING_LINKS`, `.e02-coupling-edge`) entre nós equivalentes da planta (tanque de água, dosador, magazine de copos, postos da mesa, esteira de saída, inspeção, estoque e docas).
   - Essa visualização panorâmica permite ao engenheiro compreender a envasadora como um sistema integrado, destacando homologias e rotas de contexto nas sub-redes adjacentes.
   - No entanto, matematicamente cada modelo preserva sua unidade e hipótese pura: água em centímetros (`cm`), buscas e AGV em segundos (`s`), inspeção em minutos (`min`) e materiais/veículos em metros (`m`). Os cálculos não somam grandezas físicas heterogêneas.
2. **BFS Minimiza Saltos, Não Segundos**:
   - Na Vista 2 (`Busca`), as arestas possuem tempos hipotéticos em segundos, mas o algoritmo de Busca em Largura (BFS) opera exclusivamente em níveis topológicos (fila FIFO). Para encontrar o menor tempo acumulado em segundos, o algoritmo matemático correto é o **Dijkstra**, como implementado nas Vistas 1 e 6.
3. **Heurística de AGV vs. Ótimo Global**:
   - O refinamento 2-Opt encontra um mínimo local estritamente melhor a partir da rota gulosa do Vizinho Mais Próximo ($280\text{ s} \to 260\text{ s}$). Ele é uma rota candidata de alta qualidade, mas não constitui prova matemática de ótimo global para o Caixeiro-Viajante (problema NP-difícil).
   - Além disso, os nós `TK301`, `R101` e `GRAN201` são herdados da matriz ilustrativa didática e não representam instrumentação física da envasadora.
4. **Precedências de Kahn vs. Disponibilidade Conjunta de Insumos**:
   - A ordenação topológica de Kahn no DAG de materiais confirma que não há impasses circulares na sequência fabril e que $E_1$ antecede $E_2$, que antecede $E_3$, etc.
   - Contudo, a convergência topológica de água em $E_2$ e de tampas em $E_3$ não garante, por si só, que haja insumos físicos suficientes nos estoques (operação lógica AND). No notebook da Aula 18, essa verificação é feita por um modelo separado de quarentena booleana.
5. **Simulação Local em Navegador vs. Automação em Tempo Real**:
   - A execução em [`js/etapa-02-simulator.js`](js/etapa-02-simulator.js) não gera tráfego de rede para CLP, não se comunica via OPC UA / Modbus e não aciona atuadores pneumáticos no software Automation Studio. Trata-se de uma ferramenta analítica de projeto executada localmente no navegador.

---

## 7. Correção de Divergências Encontradas em Relação ao Guia Anterior

A revisão comparativa entre o guia textual anterior e a implementação real no código fonte ([`js/etapa-02-simulator.js`](js/etapa-02-simulator.js)), nas folhas de estilo ([`css/etapa-02.css`](css/etapa-02.css)) e nos testes ([`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs)) permitiu registrar com exatidão a evolução da bancada computacional:

| Tópico | Afirmação no Guia Anterior | Comportamento Real no Código / Testes | Evidência no Código |
| :--- | :--- | :--- | :--- |
| **Visualização Panorâmica Unificada** | Vistas eram exibidas de forma mutuamente exclusiva (trocar de vista ocultava as outras cinco). | Todas as 6 sub-redes são renderizadas simultaneamente no mesmo SVG (`viewBox="0 0 1620 980"`) distribuídas em 6 zonas com 14 elos de acoplamento (`COUPLING_LINKS`, `.e02-coupling-edge`) e rotas contextuais (`.is-context-route`). | Linhas 26-40 de `js/etapa-02-simulator.js` e `e02-zone-layer` / `e02-coupling-layer`. |
| **Seleção por Modelo de Análise** | Botões representavam alternância destrutiva de tela que reiniciava bloqueios. | Controles operam via `<select data-e02-model-select>` sincronizado com `[data-e02-mode]`, preservando o estado de bloqueios em memória (`blocksByMode`) e permitindo cliques diretos em qualquer zona. | Linhas 54-62 de `js/etapa-02-simulator.js` e `.e02-model-bar`. |
| **Disparo ao Mudar `<select>`** | Afirmava na Seção 3.3 que alterar menus `<select>` não disparava o cálculo e exigia obrigatoriamente clicar no botão `Calcular`. | O listener de evento `change` está associado aos seletores de origem, destino e partida, executando a função `run()` imediatamente ao selecionar uma opção. | `one.addEventListener("change", run); two.addEventListener("change", run);` em `js/etapa-02-simulator.js`. |
| **Destaque de Arestas em `Materiais`** | Afirmava na Seção 3.2 que nenhuma aresta recebia destaque `.is-route` na vista de Materiais por Kahn gerar apenas ordem de vértices. | O simulador passa explicitamente `["m8", "m9", "m10", "m11"]` em `edgeIds`, destacando em verde-azulado a espinha dorsal de estações $E_1$ a $E_5$ no SVG. | Retorno de Kahn em `computeZoneSolution` passa `edgeIds: ["m8","m9","m10","m11"]`. |
| **Largura Responsiva do SVG** | Afirmava na Seção 3.2 que o SVG tinha sempre largura mínima fixa de 900px, exigindo rolagem em telas pequenas. | Em desktop, o SVG ajusta-se sem rolagem (`min-width: 0`, altura responsiva). Apenas em telas $\le 760\text{ px}$ ativa-se a rolagem com largura mínima de 960px e dica visível. | Regras responsivas de `css/etapa-02.css`. |
| **Feedback de Arestas Bloqueadas no SVG** | Não documentava a mensagem textual gerada quando arestas fora dos checkboxes são bloqueadas no SVG. | A função `syncBlocks()` insere dinamicamente `<p data-e02-extra-blocks>` no DOM informando quais arestas extras estão ativas no bloqueio. | `note.textContent = "Arestas bloqueadas no diagrama: " + extras.join(", ") + ".";`. |
| **Nós Clicáveis no SVG** | Sugeria genericamente que todos os nós podiam ser clicados no diagrama para alternar bloqueios. | Somente os nós explicitamente pertencentes a `meta().blocks` (`MAN-200_Agua`, `V1`, `V2`, `CORREDOR_B`, `VIA_EXTERNA`) possuem `tabindex="0"`, `role="button"` e tratador de bloqueio. Os demais nós selecionam o modelo correspondente. | Identificação de `clickable = blockableNodes.has(node)` em `renderGraph()`. |

---

## 8. Matriz de Validação e Verificação da Execução

Para garantir integridade técnica perante qualquer auditoria, declaramos com transparência o status de execução de cada item:

### 8.1. Cenários Efetivamente Reproduzidos
Os seguintes cenários foram **executados e aprovados** via ambiente Node e testes automatizados:
1. `COUPLING_LINKS e ZONES`: Imutabilidade via `Object.freeze`, 14 elos de interconexão válidos entre nós existentes e distribuição espacial em 6 zonas no SVG panorâmico 1620x980 (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
2. `Dijkstra`: Menor caminho nominal em água ($270\text{ cm}$), desvio por bloqueio em $a_3$ ($275\text{ cm}$), ausência de rota em falha dupla $a_3 + a_4$ e sentido inverso direcionado (validado na suíte [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs) e oráculo de teste);
3. `Dijkstra Trativas de Borda`: Origem igual ao destino ($0\text{ cm}$), nó de origem ou destino bloqueado, nó desconhecido e pesos zero (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
4. `BFS e DFS`: Minimização de saltos (5 arestas por BFS), contagem de caminhos simples por DFS (2 nominais, 1 com $V_1$ bloqueada) e interrupção completa com $V_1 + V_2$ bloqueadas (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
5. `Veículos`: Menor caminho nominal ($40\text{ m}$), desvio pela via externa com `CORREDOR_B` bloqueado ($65\text{ m}$) e sem rota com bloqueio duplo (`CORREDOR_B` e `VIA_EXTERNA`) (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
6. `Hierholzer (Euler)`: Circuito fechado nominal com 10 IDs e $24,5\text{ min}$, trilha aberta com $t_9$ bloqueado ($22,5\text{ min}$), rejeição de paridade inválida e detecção de subgrafo desconexo (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
7. `NN e 2-Opt`: Rota construtiva do Vizinho Mais Próximo ($280\text{ s}$), refinamento estrito por 2-Opt ($260\text{ s}$) e teste de invariância sem ciclos abertos (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
8. `Kahn`: Ordenação topológica dos 16 vértices mantendo $E_1$ a $E_5$ e detecção de ciclos em dígrafos inválidos (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs));
9. `Seletor e Visualização Unificada`: Tag SVG `viewBox="0 0 1620 980"`, seletor `data-e02-model-select` e 6 botões `data-e02-mode` validados no DOM (validado em [`../tests/etapa-02-simulator.test.cjs`](../tests/etapa-02-simulator.test.cjs)).


### 8.2. Cenários Inferidos Diretamente do Código
Os seguintes comportamentos foram **inspecionados e verificados analiticamente** por confronto estrito com a lógica do código em [`js/etapa-02-simulator.js`](js/etapa-02-simulator.js) e folhas de estilo CSS:
1. Atualização reativa de interface via eventos `change` nos seletores `<select>` e checkboxes;
2. Comportamento visual dos marcadores de seta SVG (`#e02-arrow`, `#e02-arrow-route`, `#e02-arrow-blocked`);
3. Exibição e remoção dinâmica do elemento textual `<p data-e02-extra-blocks>` para arestas bloqueadas via SVG;
4. Truncamento textual visual a 16 caracteres com reticências para nós com identificadores extensos;
5. Mecânica de histórico FIFO limitada a 4 linhas no Diário curto (`state.logs.slice(0, 4)`).

### 8.3. Cenários Declaradamente Não Executados
Nenhum dos seguintes procedimentos foi realizado, por estarem fora do escopo estático desta intervenção ou dependerem de ambiente externo:
1. Não foram executados testes físicos em CLP real ou bancadas de bancada;
2. Não foram disparados comandos via OLE/OPC para o software Automation Studio;
3. Não foi realizada inspeção visual interativa com navegador real via protocolo CDP ou webdriver;
4. Não foram adicionados pacotes npm, dependências CDN ou rotinas de compilação.

---

## 9. Mini Glossário Técnico de Engenharia e Grafos

- **Vértice (ou Nó)**: Ponto de conexão física ou lógica da rede, representando tanques, atuadores, postos da mesa indexadora ou áreas logísticas da planta.
- **Aresta (ou Arco)**: Conexão entre dois vértices. Quando orientada com sentido definido de escoamento, denomina-se **arco** em um **dígrafo**; quando bidirecional, denomina-se **aresta não dirigida**.
- **Vértice de Articulação (Nó Crítico)**: Vértice cuja remoção desconecta o grafo ou impede a comunicação entre a fonte e o consumidor (ex.: o nó `MAN-200_Agua` na rede de abastecimento).
- **Aresta-Ponte (Aresta Crítica)**: Aresta cuja desconexão interrompe a ligação entre componentes (ex.: a aresta $a_5$ entre o manifold e o dosador).
- **Grau de um Vértice**: Em grafos não dirigidos, é a quantidade de arestas incidentes no nó. Em dígrafos, decompõe-se em **grau de entrada ($\deg^-$)** (arcos que chegam) e **grau de saída ($\deg^+$)** (arcos que partem).
- **BFS (*Breadth-First Search* — Busca em Largura)**: Travessia em camadas via fila FIFO. Encontra o percurso com a menor contagem de arestas (saltos), desconsiderando grandezas ponderadas de tempo ou distância.
- **DFS (*Depth-First Search* — Busca em Profundidade)**: Travessia com aprofundamento máximo e retrocesso (*backtracking*). Utilizada para enumerar todos os caminhos simples entre dois pontos.
- **Algoritmo de Dijkstra**: Método ótimo para encontrar o caminho de menor soma de pesos em grafos ponderados com custos estritamente não negativos ($w \ge 0$).
- **Circuito Euleriano vs. Trilha Euleriana**: Passeio que consome cada aresta do grafo exatamente uma vez. Se termina no nó de partida, é um **circuito** (exige grafo conexo e todos os nós de grau par); se parte de um nó e encerra em outro distinto, é uma **trilha** (exige exatamente 2 nós de grau ímpar).
- **Ciclo Hamiltoniano e TSP (*Traveling Salesperson Problem*)**: Ao contrário de Euler (que visita arestas), o ciclo hamiltoniano exige visitar **cada vértice exatamente uma vez** e retornar à origem. O problema do Caixeiro-Viajante busca o ciclo de custo mínimo, sendo de classe NP-difícil.
- **Heurística do Vizinho Mais Próximo (NN) e 2-Opt**: Heurística construtiva gulosa para o TSP que a cada parada escolhe o ponto mais próximo, refinada pela busca local 2-Opt, que inverte segmentos de rota para desfazer cruzamentos e reduzir a soma de tempos.
- **DAG (*Directed Acyclic Graph* — Grafo Acíclico Dirigido)**: Grafo orientado sem ciclos fechados, ideal para representar cronogramas, dependências e fluxos de montagem em que uma etapa não pode retroagir.
- **Ordenação Topológica (Algoritmo de Kahn)**: Procedimento que alinha linearmente os nós de um DAG com base nos graus de entrada, assegurando que nenhum nó apareça antes de suas dependências prévias.

---

## 10. Perguntas Típicas da Banca e Respostas Fundamentadas

1. **"Por que na Vista 2 (Busca) a BFS escolhe a rota por V1 dizendo '5 arestas por BFS', mesmo as arestas possuindo pesos em segundos?"**
   - **Resposta**: Porque o algoritmo BFS explora a rede estritamente por camadas de adjacência (fila FIFO), minimizando o **número de saltos (arestas)** e ignorando grandezas ponderadas. Como os trajetos por V1 e por V2 possuem rigorosamente 5 arestas, a BFS seleciona V1 em virtude da ordem determinística de cadastro na lista de adjacência. Para minimizar o tempo em segundos, o algoritmo correto a ser empregado é o Dijkstra.
2. **"Se a rede possui duas bombas em paralelo (P-101 e P-102), por que a máquina ainda pode ficar em estado 'Sem rota'?"**
   - **Resposta**: Por dois motivos topológicos: primeiro, se houver falha simultânea nas duas tubulações de entrada ($a_3$ e $a_4$); segundo, porque ambas as bombas convergem para um ponto comum — o manifold `MAN-200_Agua` —, que é um **vértice de articulação**, sucedido pela aresta-ponte crítica $a_5$ (`MAN-200_Agua → DOS-201_Dosador`). Bloquear o manifold ou a tubulação $a_5$ corta todo e qualquer suprimento até o dosador.
3. **"Qual é a distinção teórica e prática entre a Aula 16 (Inspeção/Euler) e a Aula 17 (AGV/Hamiltoniano)?"**
   - **Resposta**: Na Aula 16 (Euleriano), o foco reside na cobertura de **todas as arestas** (inspecionar todas as mangueiras e cabos sem repetição), admitindo revisitar vértices; trata-se de um problema solúvel em tempo linear $O(|E|)$ pelo Algoritmo de Hierholzer. Na Aula 17 (Hamiltoniano/TSP), o foco é visitar **todos os nós** (postos de coleta do AGV) exatamente uma vez; trata-se de um problema NP-difícil resolvido via heurísticas (Vizinho Mais Próximo refinado por 2-Opt).
4. **"Por que na Aula 16 o circuito do simulador fecha em 24,5 min, enquanto no notebook a caça a vazamentos soma 57,8 min?"**
   - **Resposta**: Porque são dois grafos independentes. A ronda preventiva do simulador possui 8 nós em dois anéis acoplados, onde todos os nós têm grau par, permitindo um circuito euleriano direto de $24,5\text{ min}$. Já a rede de caça a vazamentos da Aula 12/16 possui 10 cilindros terminais de grau ímpar ($\deg = 1$), exigindo a duplicação de trechos pelo Algoritmo do Carteiro Chinês ($36,4\text{ min}$ de base $+ 21,4\text{ min}$ de retorno repetido $= 57,8\text{ min}$).
5. **"Por que a Aula 18 separa o modelo de Materiais (Kahn) do modelo de Veículos (Dijkstra)?"**
   - **Resposta**: Porque eles possuem restrições topológicas antagônicas. A transformação física do produto (`Materiais`) não pode retroceder nem saltar estações ($E_1$ a $E_5$), exigindo um Grafo Acíclico Dirigido (DAG) validado por Kahn. Já a movimentação logística (`Veículos`) transita por vias bidirecionais de mão dupla e circuitos de retorno à portaria, apresentando **ciclos legítimos** nos quais o algoritmo de Kahn falharia, mas que são naturalmente resolvidos pelo algoritmo de Dijkstra.
6. **"O DAG de materiais comprova que a envasadora está apta a produzir?"**
   - **Resposta**: Não. O DAG comprova unicamente a consistência lógica da ordem de precedência estrutural. Ele não atesta a disponibilidade simultânea (condição lógica AND) de copos, água e tampas, não mede volume de estoque e não substitui os sensores de presença e os intertravamentos do controlador de bancada.
