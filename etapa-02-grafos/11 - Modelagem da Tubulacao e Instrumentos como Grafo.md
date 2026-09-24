# Aula 11: Teoria dos Grafos — Modelagem da Planta e Fluxo de Processo

## 1. Fundamentos Matemáticos: Definição Formal de Dígrafos Ponderados

Um **Grafo Dirigido e Ponderado (Dígrafo)** é formalmente definido pela tripla[cite: 10]:
$$G = (V, E, W)$$

Na nossa **Máquina de Envasamento de Copos**, a modelagem topológica é aplicada ao fluxo físico (água e recipientes)[cite: 5, 8, 9]:
1. **$V = \{v_1, v_2, \dots, v_n\}$** é o conjunto finito de **vértices (nós)**: reservatórios, bombas, cilindro dosador, bico de envase, magazine e a mesa giratória[cite: 5].
2. **$E \subseteq V \times V$** é o conjunto de **arestas dirigidas (arcos)**, representando a tubulação de água ou o trajeto mecânico do copo com sentido de fluxo permitido[cite: 10].
3. **$W: E \rightarrow \mathbb{R}^+$** é a **função de ponderação**, que associa a cada trajeto o comprimento físico em centímetros ($L\text{ [cm]}$)[cite: 10].

```mermaid
graph LR
    TK101["TK-101: Res. Água"] -->|150cm - XV-101A| P101["P-101: Bomba A"]
    TK101 -->|150cm - XV-101B| P102["P-102: Bomba B"]
    P101 -->|80cm - XV-200A| MAN200["MAN-200: Manifold Água"]
    P102 -->|85cm - XV-200B| MAN200
    MAN200 -->|40cm - XV-201| DOS201["DOS-201: Cilindro C (Dosador)"]
    DOS201 -->|20cm - XV-202| BIC202["BIC-202: Bico de Envase"]
    MAG100["MAG-100: Magazine Copos"] -->|15cm - Cilindro A| MESA000["MESA-000: Mesa Indexadora"]
    BIC202 -->|10cm - Gravidade| MESA000
    MESA000 -->|50cm - Cilindro H| EST500["EST-500: Esteira Saída"]
```

A leitura do diagrama acima é direta: cada seta representa um trecho físico com sentido de escoamento ou movimentação fixo (definido por bomba, cilindro ou gravidade)[cite: 5, 10], e o rótulo indica o comprimento em centímetros e o elemento de manobra instalado naquele trecho[cite: 10].

---

## 2. Por que um Grafo e não uma Lista de Equipamentos?

O Automation Studio armazena os componentes mecânicos em listas e *arrays*. A diferença ao adotar a **estrutura de grafo** é que ela expõe propriedades topológicas que uma tabela simples esconde[cite: 8, 9, 10]:

1. **Conectividade:** É possível provar formalmente se existe (ou não) um caminho do reservatório de água até o copo na mesa, sem inspecionar manualmente a planta[cite: 10].
2. **Redundância:** O grau de entrada do manifold ($\deg^-(\text{MAN-200}) = 2$, alimentado por P-101 e P-102) evidencia a existência de bombas reservas — uma propriedade de tolerância a falhas que fica implícita numa tabela[cite: 10].
3. **Composição de algoritmos:** Uma vez que a planta é um grafo, toda a teoria matemática (Euler, Dijkstra) torna-se aplicável para criar buscas (BFS/DFS) e roteamentos automáticos[cite: 8, 9, 10].

### 2.1. Definições Fundamentais de Teoria dos Grafos

Para tornar o vocabulário preciso no contexto da Envasadora, formalizamos os conceitos[cite: 10]:

* **Ordem** do grafo: $\vert{}V\vert{} = n$, o número de vértices (módulos da máquina)[cite: 10].
* **Tamanho** do grafo: $\vert{}E\vert{} = m$, o número de arestas (conexões físicas)[cite: 10].
* **Passeio (*walk*):** sequência alternada $v_0, e_1, v_1, e_2, \dots, e_k, v_k$ onde cada $e_i = (v_{i-1}, v_i) \in E$[cite: 10]. Representa fisicamente o percurso de uma gota de água, podendo repetir tubulações.
* **Caminho (*path*):** um passeio sem vértices repetidos[cite: 10]. É o objeto de interesse quando queremos saber *a rota* da água até o copo, sem retrocessos.
* **Trilha (*trail*):** um passeio sem arestas repetidas[cite: 10]. Relevante quando um robô de inspeção (AGV) pode passar duas vezes pelo mesmo setor, mas nunca inspeciona o mesmo trecho de duto duas vezes.
* **Ciclo (*cycle*):** um caminho fechado ($v_0 = v_k$). A existência de ciclos no grafo indica **rotas alternativas de contingência**[cite: 10].
* **Grau de saída** $\deg^+(v)$: número de arestas que partem de $v$ (saídas de fluxo)[cite: 10].
* **Grau de entrada** $\deg^-(v)$: número de arestas que chegam a $v$ (alimentações)[cite: 10].

### 2.2. Lema do Aperto de Mãos Dirigido

Para a rede de abastecimento da Envasadora $G = (V, E)$, vale a identidade[cite: 10]:

$$\sum_{v \in V} \deg^+(v) = \sum_{v \in V} \deg^-(v) = \vert{}E\vert{}$$

**Justificativa:** cada aresta (tubulação/trajeto) contribui exatamente $+1$ para o grau de saída da sua origem e $+1$ para o grau de entrada do seu destino[cite: 10]. Esta identidade é a base da verificação de consistência: se a soma não bater com o número de conexões, há um erro de modelagem[cite: 10].
Na tabela gerada, temos 9 conexões físicas cadastradas. Somando os graus de saída (`deg+`: $2+1+1+1+1+1+1+1+0 = 9$) e os graus de entrada (`deg-`: $0+1+1+2+1+1+0+2+1 = 9$), a identidade confirma-se matematicamente[cite: 11].

### 2.3. Representações Computacionais e Trade-offs

| Representação | Estrutura | Custo de espaço | Consulta "existe aresta $(u,v)$?" | Quando usar na Automação |
| --- | --- | --- | --- | --- |
| Matriz de adjacência | `float[n][n]` | $O(n^2)$ | $O(1)$ | Grafos densos ou quando se precisa de acesso instantâneo para algoritmos como Dijkstra[cite: 8, 9, 10]. |
| Lista de adjacência | `dict[str, list]` | $O(n + m)$ | $O(\deg(u))$ | Grafos esparsos — típico em plantas reais muito grandes[cite: 10]. |
| Matriz de incidência | `int[n][m]` | $O(n \cdot m)$ | — | Balanço de massa e análise de ciclos fechados[cite: 8, 10]. |

A classe `GrafoTubulacao` implementada no notebook desta aula adota a **matriz de adjacência dupla**: uma matriz binária (`adj_binaria`) e uma matriz de pesos (`adj_pesos`, inicializada com $\infty$ fora da diagonal e $0$ na diagonal, convenção padrão para algoritmos de caminho mínimo)[cite: 10, 11].

### 2.4. Grafo Simples vs. Multigrafo

Se adicionássemos uma mangueira pneumática redundante entre o Compressor e a Prensa (Setor 400), o modelo deixaria de ser um grafo simples e passaria a ser um **multigrafo**, pois existiria mais de uma aresta entre o mesmo par de vértices[cite: 10]. A matriz de adjacência simples não captura essa redundância diretamente, sendo necessário armazenar uma lista de pesos por par $(u,v)$[cite: 10].

---

## 3. Exemplo Resolvido

**Pergunta:** Qual é o grau de saída total da rede e o que ele representa fisicamente[cite: 10]?

**Resolução:** Somando a coluna `deg+` da tabela topológica gerada no notebook[cite: 11]:
$\deg^+(\text{TK-101}) + \deg^+(\text{P-101}) + \deg^+(\text{P-102}) + \deg^+(\text{MAN-200}) + \deg^+(\text{DOS-201}) + \deg^+(\text{BIC-202}) + \deg^+(\text{MAG-100}) + \deg^+(\text{MESA-000}) + \deg^+(\text{EST-500})$
$= 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 0 = 9$.

Fisicamente, este total representa o número exato de elementos de transferência (válvulas, gravidade ou cilindros pneumáticos) que empurram o produto para o próximo estágio na máquina envasadora[cite: 10].

---

## 4. Atividades de Investigação

1. Prove, a partir do Lema do Aperto de Mãos Dirigido, que é impossível existir um dígrafo com exatamente um vértice de grau de saída ímpar e todos os demais com grau de saída par, se a soma dos graus de entrada for par[cite: 10].
2. Adicione uma tubulação redundante `TK-101_Agua -> MAN-200_Agua` (uma segunda linha física direta) e discuta por que a matriz de adjacência binária simples não representa corretamente esta redundância. Proponha uma estrutura de dados alternativa[cite: 10].
3. Classifique cada um dos 9 trechos da rede padrão como pertencente a um caminho, uma trilha ou nenhum dos dois, considerando a rota completa de `TK-101_Agua` até `EST-500_Saida` passando pelo dosador[cite: 10].
4. Se a esteira `EST-500_Saida` tivesse um sistema de descarte de copos defeituosos que os devolvesse ao `MAG-100_Copos` para reciclagem, quantos ciclos simples passariam a existir na rede? Enumere-os[cite: 10].

---

## 5. Entregável da Aula 11

* **Classe `GrafoTubulacao` em Python:** Estrutura orientada a objetos com suporte a nós parametrizados, inserção de tubulações com distância (cm) e atuador associado, matrizes de adjacência e incidência, e exportação para algoritmos de roteamento[cite: 8, 9, 10, 11].
