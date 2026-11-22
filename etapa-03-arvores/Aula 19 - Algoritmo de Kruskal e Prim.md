# Relatório Técnico: Otimização Topológica da Envasadora Pneumática (Aqua Index)

**Dimensionamento Mínimo de Cabeamento SCADA e Malha Pneumática com Algoritmos de Kruskal e Prim**

### Informações do Projeto

| Parâmetro | Detalhe |
| :--- | :--- |
| **Unidade Industrial** | Máquina Pneumática de Envasamento de Água em Copos — Aqua Index (Setores 000 a 500) |
| **Aplicação** | Roteamento de Eletrocalhas/Chicotes de Instrumentação SCADA e Linha Pneumática |
| **Método Formulado** | Árvore Geradora Mínima (MST — *Minimum Spanning Tree*) |
| **Código do Projeto** | ECAA08-SISTEMA-SCADA |

## 1. Contextualização e Objetivo de Engenharia

No projeto eletromecânico e de automação da máquina pneumática de envasamento de água em copos (**Aqua Index**), todas as cinco estações da mesa giratória indexada, o painel central de controle (CLP/SCADA) e a esteira de saída precisam estar interconectados por chicotes de sinais (sensores magnéticos, capacitivos, pressostato, termopar e solenoides) e mangueiramento de ar comprimido.

A otimização desse roteamento reduz o comprimento total de cabos blindados, eletrocalhas e tubulações pneumáticas, minimizando perdas de carga, interferência eletromagnética e custo de capital (*CAPEX*), além de simplificar a manutenção preventiva (*OPEX*).

O objetivo deste estudo é modelar o *layout* físico dos módulos da envasadora como um grafo não direcionado e ponderado $G = (V, E, w)$ e determinar a topologia de interconexão de menor extensão linear contínua utilizando os algoritmos de **Kruskal** e **Prim**.

## 2. Formulação Matemática da Rede

A planta da envasadora é representada por um conjunto de vértices $V$ (módulos operacionais dos setores 000 a 500) e arestas $E$ (calhas e rotas físicas viáveis), onde o peso $w(e)$ quantifica o comprimento do trecho em metros:

* **Vértices ($V$):**
  * $v_1$: `PLC-001` — Painel Central CLP/SCADA e Comandos Gerais (Setor 000)
  * $v_2$: `MESA-001` — Servomotor e Encoder `SE-001` da Mesa Indexadora (Setor 000)
  * $v_3$: `E1-DISP` — Estação 1: Dispensa de Copos (`XV-101` / `ZS-102`) (Setor 100)
  * $v_4$: `E2-ENV` — Estação 2: Envase e Dosagem 150 mL (`XV-201` / `XV-202` / `XV-203`) (Setor 200)
  * $v_5$: `E3-TAMP` — Estação 3: Manipulador de Tampas (`XV-301` / `XV-302` / `VAC-301` / `PIT-301`) (Setor 300)
  * $v_6$: `E4-SEL` — Estação 4: Termosselagem (`XV-401` / `TIT-401`) (Setor 400)
  * $v_7$: `E5-EJEC` — Estação 5: Ejeção Pneumática (`XV-501` / `XV-502`) (Setor 500)
  * $v_8$: `EST-501` — Esteira de Saída e Contagem de Produção (Setor 500)

A malha completa com todas as **14 rotas viáveis** totaliza **$25{,}8\text{ m}$** de calhas/cabos.

## 3. Algoritmo de Kruskal (Abordagem Baseada em Arestas)

O algoritmo de Kruskal adota uma estratégia gulosa (*greedy*) orientada às arestas do grafo. As rotas são ordenadas em ordem crescente de comprimento e inseridas iterativamente na solução, desde que não formem ciclos (verificado pela estrutura *Disjoint Set Union / Union-Find*).

Para $\vert V \vert = 8$ módulos, a Árvore Geradora Mínima (MST) conterá exatamente $\vert V \vert - 1 = 7$ arestas.

| Ordem | Aresta $e$ | Trecho Conectado | Distância $w(e)$ | Ciclo Detectado? | Decisão de Projeto |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | $(v_7, v_8)$ | `E5-EJEC` $\leftrightarrow$ `EST-501` | $1{,}1\text{ m}$ | Não | **INCLUÍDA** |
| 2 | $(v_3, v_4)$ | `E1-DISP` $\leftrightarrow$ `E2-ENV` | $1{,}2\text{ m}$ | Não | **INCLUÍDA** |
| 3 | $(v_4, v_5)$ | `E2-ENV` $\leftrightarrow$ `E3-TAMP` | $1{,}3\text{ m}$ | Não | **INCLUÍDA** |
| 4 | $(v_5, v_6)$ | `E3-TAMP` $\leftrightarrow$ `E4-SEL` | $1{,}4\text{ m}$ | Não | **INCLUÍDA** |
| 5 | $(v_6, v_7)$ | `E4-SEL` $\leftrightarrow$ `E5-EJEC` | $1{,}5\text{ m}$ | Não | **INCLUÍDA** |
| 6 | $(v_2, v_3)$ | `MESA-001` $\leftrightarrow$ `E1-DISP` | $1{,}6\text{ m}$ | Não | **INCLUÍDA** |
| 7 | $(v_2, v_4)$ | `MESA-001` $\leftrightarrow$ `E2-ENV` | $1{,}7\text{ m}$ | Sim ($v_2 - v_3 - v_4$) | **REJEITADA** |
| 8 | $(v_1, v_3)$ | `PLC-001` $\leftrightarrow$ `E1-DISP` | $1{,}8\text{ m}$ | Não | **INCLUÍDA** |
| 9 | $(v_2, v_5)$ | `MESA-001` $\leftrightarrow$ `E3-TAMP` | $1{,}9\text{ m}$ | Sim ($v_2 - v_3 - v_4 - v_5$) | **REJEITADA** |
| 10 | $(v_1, v_2)$ | `PLC-001` $\leftrightarrow$ `MESA-001` | $2{,}0\text{ m}$ | Sim ($v_1 - v_3 - v_2$) | **REJEITADA** |
| 11 | $(v_2, v_6)$ | `MESA-001` $\leftrightarrow$ `E4-SEL` | $2{,}1\text{ m}$ | Sim ($v_2 - v_3 - v_4 - v_5 - v_6$) | **REJEITADA** |
| 12 | $(v_2, v_7)$ | `MESA-001` $\leftrightarrow$ `E5-EJEC` | $2{,}2\text{ m}$ | Sim ($v_2 - v_3 - \dots - v_7$) | **REJEITADA** |
| 13 | $(v_7, v_3)$ | `E5-EJEC` $\leftrightarrow$ `E1-DISP` | $2{,}6\text{ m}$ | Sim ($v_3 - v_4 - v_5 - v_6 - v_7$) | **REJEITADA** |
| 14 | $(v_1, v_8)$ | `PLC-001` $\leftrightarrow$ `EST-501` | $3{,}4\text{ m}$ | Sim ($v_1 - v_3 - \dots - v_8$) | **REJEITADA** |

> *Observação:* No algoritmo computacional, a execução encerra por parada antecipada no **Passo 8**, assim que a 7ª aresta ($\vert V \vert - 1$) é incluída.

**Comprimento total da infraestrutura via Kruskal:**

$$
W_{\text{Kruskal}} = 1{,}1 + 1{,}2 + 1{,}3 + 1{,}4 + 1{,}5 + 1{,}6 + 1{,}8 = 9{,}9\text{ metros}
$$

## 4. Algoritmo de Prim (Abordagem Baseada em Vértices)

O algoritmo de Prim expande uma única árvore conectada a partir de um nó raiz definido fisicamente como o **Painel Central CLP/SCADA** ($v_1$ / `PLC-001`), adicionando a cada iteração a aresta de menor peso da fronteira de corte (gerenciada por *Min-Heap*) que conecta a árvore atual a um módulo ainda não atendido.

| Iteração | Vértices na Árvore ($S$) | Aresta Selecionada | Nó Adicionado | Custo |
| :--- | :--- | :--- | :--- | :--- |
| **1** | $\{v_1\}$ | $(v_1, v_3)$: `PLC-001` $\leftrightarrow$ `E1-DISP` | $v_3$ (`E1-DISP`) | $1{,}8\text{ m}$ |
| **2** | $\{v_1, v_3\}$ | $(v_3, v_4)$: `E1-DISP` $\leftrightarrow$ `E2-ENV` | $v_4$ (`E2-ENV`) | $1{,}2\text{ m}$ |
| **3** | $\{v_1, v_3, v_4\}$ | $(v_4, v_5)$: `E2-ENV` $\leftrightarrow$ `E3-TAMP` | $v_5$ (`E3-TAMP`) | $1{,}3\text{ m}$ |
| **4** | $\{v_1, v_3, v_4, v_5\}$ | $(v_5, v_6)$: `E3-TAMP` $\leftrightarrow$ `E4-SEL` | $v_6$ (`E4-SEL`) | $1{,}4\text{ m}$ |
| **5** | $\{v_1, v_3, v_4, v_5, v_6\}$ | $(v_6, v_7)$: `E4-SEL` $\leftrightarrow$ `E5-EJEC` | $v_7$ (`E5-EJEC`) | $1{,}5\text{ m}$ |
| **6** | $\{v_1, v_3, v_4, v_5, v_6, v_7\}$ | $(v_7, v_8)$: `E5-EJEC` $\leftrightarrow$ `EST-501` | $v_8$ (`EST-501`) | $1{,}1\text{ m}$ |
| **7** | $\{v_1, v_3, v_4, v_5, v_6, v_7, v_8\}$ | $(v_3, v_2)$: `E1-DISP` $\leftrightarrow$ `MESA-001` | $v_2$ (`MESA-001`) | $1{,}6\text{ m}$ |

**Comprimento total da infraestrutura via Prim:**

$$
W_{\text{Prim}} = 1{,}8 + 1{,}2 + 1{,}3 + 1{,}4 + 1{,}5 + 1{,}1 + 1{,}6 = 9{,}9\text{ metros}
$$

## 5. Representação Esquemática da Rede e Otimização MST

O diagrama topológico da mesa indexadora (`MESA-001`), das cinco estações periféricas (`E1-DISP` a `E5-EJEC`), do painel `PLC-001` e da esteira `EST-501` é gerado automaticamente pelo *notebook* acompanhante (`Aula 19 - Algoritmo de Kruskal e Prim.ipynb`), evidenciando o barramento perimetral contínuo pelas estações com derivação única para o eixo da mesa.

## 6. Análise Comparativa e Decisão Industrial

> 💡 **Recomendações de Aplicação na Envasadora (Projeto Básico vs. Montagem de Bancada/Chão de Fábrica)**
>
> Ambos os métodos convergem para exatamente a mesma Árvore Geradora Mínima (**$9{,}9\text{ metros}$**), proporcionando uma redução de **$61{,}6\%$** em relação à malha completa com todas as rotas candidatas ($25{,}8\text{ m}$). A escolha operacional depende da fase de engenharia:
>
> * **Algoritmo de Kruskal** $\mathcal{O}(\vert E \vert \log \vert E \vert)$**:** Recomendado na fase de projeto elétrico/pneumático (*FEED* / orçamento), quando todas as distâncias entre estações da máquina estão consolidadas no *layout* CAD e deseja-se minimizar o custo global de chicotes e mangueiras.
> * **Algoritmo de Prim** $\mathcal{O}(\vert E \vert \log \vert V \vert)$**:** Recomendado na fase de montagem eletromecânica e comissionamento da envasadora, pois permite lançar o barramento de comunicação SCADA e alimentação pneumática de forma contínua a partir do painel central (`PLC-001`), energizando e testando cada estação (`E1` $\rightarrow$ `E2` $\rightarrow$ `E3` $\rightarrow$ `E4` $\rightarrow$ `E5` $\rightarrow$ `EST-501`) sequencialmente sem deixar trechos isolados.

## 7. Referências Técnicas

1. CORMEN, T. H. et al. **Algoritmos: Teoria e Prática**. 3. ed. Rio de Janeiro: Elsevier, 2012.
2. ANSI/ISA-5.1-2009. **Instrumentation Symbols and Identification**. International Society of Automation, 2009.
3. Documentação Técnica do Projeto **Aqua Index — SCADA da Máquina Pneumática de Envasamento de Água em Copos** (`README.md`, ECAA08).
