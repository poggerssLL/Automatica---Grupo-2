# Aula 11: Teoria dos Grafos — Modelagem da Planta e Fluxo de Processo

## 1. Fundamentos Matemáticos: Definição Formal de Dígrafos Ponderados

Um **Grafo Dirigido e Ponderado (Dígrafo)** é formalmente definido pela tripla:
$$G = (V, E, W)$$

Na nossa **Máquina de Envasamento de Copos**, a modelagem topológica é aplicada ao fluxo físico (água e recipientes)[cite: 8, 9]:
1. **$V = \{v_1, v_2, \dots, v_n\}$** é o conjunto finito de **vértices (nós)**: reservatórios, bombas, cilindro dosador, bico de envase, magazine e a mesa giratória.
2. **$E \subseteq V \times V$** é o conjunto de **arestas dirigidas (arcos)**, representando a tubulação de água ou o trajeto mecânico do copo com sentido obrigatório[cite: 10].
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
