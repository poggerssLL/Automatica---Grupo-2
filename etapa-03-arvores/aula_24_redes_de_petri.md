# Aula 24 — Modelagem Formal em Redes de Petri (Envasadora de Copos)

Este documento apresenta a modelagem formal da máquina envasadora de copos utilizando **Redes de Petri (RdP)**, com foco na concorrência entre as estações (`E1–E5`), no intertravamento de exclusão mútua entre a mesa indexadora (`M-001`) e a prensa (`E4`), e na prova de limitação e ausência de *deadlock* na esteira de saída (`EST-500`).

---

## 1. Por que utilizar Redes de Petri neste sistema?

Estruturas baseadas em árvores ou máquinas de estados simples não representam de forma natural o **paralelismo simultâneo** e a **disputa por recursos físicos exclusivos**. Na envasadora:

* As 5 estações (`E1–E5`) executam operações concorrentes a cada ciclo (*takt time* de $3,6\text{ s/copo}$).
* Existe uma **incompatibilidade física crítica**: a mesa indexadora (`M-001`, que gira em incrementos discretos de $72^\circ$) **nunca** pode girar enquanto a prensa (`E4`) estiver atuando.
* A esteira de saída (`EST-500`) possui capacidade física finita; sem modelar essa restrição, o sistema permitiria acúmulo ilimitado de copos.

As Redes de Petri resolvem esse problema por meio de um grafo bipartido composto por **Lugares** ($P$, que representam estados ou recursos) e **Transições** ($T$, que representam eventos discretos), evoluindo pela movimentação de **fichas** (*tokens*).

---

## 2. Definição Formal da Rede

Uma Rede de Petri marcada é definida pela quíntupla:

$$N = (P, T, \text{Pre}, \text{Post}, M_0)$$

Onde:
* $P = \{p_1, p_2, \dots, p_m\}$ é o conjunto finito de **Lugares**.
* $T = \{t_1, t_2, \dots, t_n\}$ é o conjunto finito de **Transições** ($P \cap T = \emptyset$).
* $\text{Pre}: P \times T \to \mathbb{N}$ é a matriz de arcos de entrada (pré-condições para disparo).
* $\text{Post}: P \times T \to \mathbb{N}$ é a matriz de arcos de saída (pós-condições após disparo).
* $M_0: P \to \mathbb{N}$ é o vetor de **Marcação Inicial**.

A **Matriz de Incidência** $C$ é dada por:

$$C = \text{Post} - \text{Pre}$$

Uma transição $t_j$ está **habilitada** em uma marcação $M$ se, e somente se, $M(p_i) \ge \text{Pre}(p_i, t_j)$ para todo $p_i \in P$. Ao disparar $t_j$, a nova marcação $M'$ é obtida pela equação de estado:

$$M' = M + C \cdot \mathbf{e}_j$$

---

## 3. Modelagem Aplicada à Envasadora

### 3.1. Estudo da Esteira `EST-500`: Crescimento Ilimitado ($\omega$) vs. Lugar Complementar ($K_{\max} = 3$)

No subsistema de saída, temos:
* **Cenário A (Sem restrição de capacidade):** A transição de entrada `T1` deposita copos continuamente em `EST-500`, enquanto `T2` realiza o escoamento (`SAIDA`). Na construção da **Árvore de Cobertura (Karp-Miller)**, como `T1` pode disparar repetidamente sem que `T2` dispare, surge uma marcação estritamente maior que sua ancestral, introduzindo o símbolo $\omega$ (crescimento ilimitado). Isso prova que, sem intertravamento de buffer, a esteira transborda.
* **Cenário B (Com Lugar Complementar $K_{\max} = 3$):** Inserimos o lugar complementar `VAGAS_EST500` com marcação inicial $M_0(\text{VAGAS\_EST500}) = 3$.
  * Toda entrada (`T1`) consome 1 ficha de `VAGAS_EST500` e produz 1 ficha em `EST-500`.
  * Toda saída (`T2`) consome 1 ficha de `EST-500` e devolve 1 ficha a `VAGAS_EST500`.

Isso estabelece o seguinte **P-Invariante** (conservação de fichas):

$$M(\text{EST-500}) + M(\text{VAGAS\_EST500}) = 3$$

Com isso, prova-se formalmente que a rede é **$3$-limitada** ($M(\text{EST-500}) \le 3$ em qualquer estado alcançável), eliminando o símbolo $\omega$.

---

### 3.2. Intertravamento de Exclusão Mútua (`M-001` vs. `E4`) e Integração

Para modelar a segurança mecânica integrada ao buffer de saída, definimos os lugares:

| Lugar | Descrição | Marcação Inicial ($M_0$) |
| :--- | :--- | :---: |
| `P_MESA_LIVRE` | Recurso compartilhado (permissão de movimento/atuação) | $1$ |
| `P_M001_GIRANDO` | Mesa indexadora `M-001` executando giro de $72^\circ$ | $0$ |
| `P_E4_PRENSA` | Prensa `E4` em operação (atuando sobre o copo) | $0$ |
| `P_EST500` | Copos acumulados na esteira de saída `EST-500` | $0$ |
| `P_VAGAS_EST500` | Lugar complementar (vagas livres na esteira, $K_{\max}=3$) | $3$ |

E as transições:
* `T_INICIO_GIRO`: consome `P_MESA_LIVRE` $\to$ produz `P_M001_GIRANDO`.
* `T_FIM_GIRO`: consome `P_M001_GIRANDO` $\to$ produz `P_MESA_LIVRE`.
* `T_INICIO_E4`: consome `P_MESA_LIVRE` $\to$ produz `P_E4_PRENSA`.
* `T_FIM_E4`: consome `P_E4_PRENSA` e `P_VAGAS_EST500` $\to$ produz `P_MESA_LIVRE` e `P_EST500`.
* `T_SAIDA_EST500`: consome `P_EST500` $\to$ produz `P_VAGAS_EST500`.

---

## 4. Propriedades Verificadas no Notebook

O arquivo `Aula_24_Simulacao_Petri.ipynb` executa a verificação computacional completa e comprova:

1. **Exclusão Mútua Estrutural:** O P-invariante $M(\text{P\_MESA\_LIVRE}) + M(\text{P\_M001\_GIRANDO}) + M(\text{P\_E4\_PRENSA}) = 1$ garante que `M-001` e `E4` **nunca** operam simultaneamente.
2. **Limitação ($k$-boundedness):** O espaço de estados alcançáveis é finito ($12$ estados no modelo integrado) e nenhum estado viola $M(\text{EST-500}) \le 3$.
3. **Ausência de Deadlock (0 Bloqueios):** Em todos os estados alcançáveis — inclusive com a esteira cheia ($M(\text{EST-500}) = 3$) — existe pelo menos uma transição habilitada (`T_SAIDA_EST500`), garantindo que o sistema nunca entra em estado absorvente de travamento.