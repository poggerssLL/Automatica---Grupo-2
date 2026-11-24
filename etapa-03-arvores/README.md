# Etapa 03 — Árvores, Controle e Decisão (Aulas 19–28)

**UNIFEI • ECAA08 Automática • Grupo 2 — Projeto Aqua Index**

## Escopo
- Estruturas em árvore aplicadas ao sistema conceitual e simulado da envasadora pneumática **Aqua Index** (Setores 000 a 500), respeitando rigorosamente a fronteira física do CLP/Automation Studio e o caráter didático do projeto (`PRODUCT.md`).
- Topologia mínima de infraestrutura (MST), compressão de telemetria SCADA (Huffman), arbitragem de intertravamentos em `O(1)` e historiador balanceado em `O(log n)` (BDT + AVL), planejamento logístico externo `SE(2)` (RRT), redundância L2 Ethernet industrial (RSTP 802.1w), modelagem a eventos discretos (Redes de Petri), controle reativo multi-tick (Behavior Trees), indexação espacial contínua (KD-Trees), indução de regras de qualidade/manutenção (ID3/C4.5/CART) e síntese integrada do Módulo 3.

## Inventário de Aulas (Aulas 19–28)

| Aula | Tema | Documento Teórico (`.md`) | Simulação / Código (`.ipynb`) | Status |
| :---: | :--- | :--- | :--- | :--- |
| **19** | Árvore Geradora Mínima (Kruskal e Prim) | [`Aula 19 - Algoritmo de Kruskal e Prim.md`](./Aula%2019%20-%20Algoritmo%20de%20Kruskal%20e%20Prim.md) | [`Aula 19 - Algoritmo de Kruskal e Prim - code.ipynb`](./Aula%2019%20-%20Algoritmo%20de%20Kruskal%20e%20Prim%20-%20code.ipynb) | Concluída |
| **20** | Compressão Lossless SCADA (Huffman) | [`Aula 20 - Algortimo de Huffman.md`](./Aula%2020%20-%20Algortimo%20de%20Huffman.md) | [`Aula 20 - Algortimo de Huffman - code.ipynb`](./Aula%2020%20-%20Algortimo%20de%20Huffman%20-%20code.ipynb) | Concluída |
| **21** | Árvores Binárias (BDT Contextual + AVL) | [`Aula 21 - Árvores Binárias.md`](./Aula%2021%20-%20%C3%81rvores%20Bin%C3%A1rias.md) | [`Aula 21 - Árvores Binárias - code.ipynb`](./Aula%2021%20-%20%C3%81rvores%20Bin%C3%A1rias%20-%20code.ipynb) | Concluída |
| **22** | Rapidly-exploring Random Trees (RRT `SE(2)`) | [`Aula 22 - Rapidly-exploring Random Trees.md`](./Aula%2022%20-%20Rapidly-exploring%20Random%20Trees.md) | [`Aula 22 - Rapidly-exploring Random Trees - code.ipynb`](./Aula%2022%20-%20Rapidly-exploring%20Random%20Trees%20-%20code.ipynb) | Concluída |
| **23** | Protocolo de Árvore Geradora (STP / RSTP 802.1w) | [`Aula 23 - Protocolo de Árvore Geradora (STP - RSTP).md`](./Aula%2023%20-%20Protocolo%20de%20%C3%81rvore%20Geradora%20(STP%20-%20RSTP).md) | [`Aula 23 - Protocolo de Árvore Geradora (STP RSTP) - code.ipynb`](./Aula%2023%20-%20Protocolo%20de%20%C3%81rvore%20Geradora%20(STP%20RSTP)%20-%20code.ipynb) | Concluída |
| **24** | Redes de Petri e Árvore de Atingibilidade | *Reservada a integrante do grupo — Redes de Petri* | *Reservada a integrante do grupo — Redes de Petri* | Reservada |
| **25** | Árvores de Comportamento (Behavior Trees) | [`Aula 25 - Árvores de Comportamento.md`](./Aula%2025%20-%20%C3%81rvores%20de%20Comportamento.md) | [`Aula 25 - Árvores de Comportamento - code.ipynb`](./Aula%2025%20-%20%C3%81rvores%20de%20Comportamento%20-%20code.ipynb) | Concluída |
| **26** | KD-Trees (Historiador `R³` e `NEAREST` RRT `R²`) | [`Aula 26 - KD-Trees.md`](./Aula%2026%20-%20KD-Trees.md) | [`Aula 26 - KD-Trees - code.ipynb`](./Aula%2026%20-%20KD-Trees%20-%20code.ipynb) | Concluída |
| **27** | Árvores de Decisão (ID3 / C4.5 / CART) | [`Aula 27 - Árvores de Decisão - ID3 C4.5 e CART.md`](./Aula%2027%20-%20%C3%81rvores%20de%20Decis%C3%A3o%20-%20ID3%20C4.5%20e%20CART.md) | [`Aula 27 - Árvores de Decisão - ID3 C4.5 e CART - code.ipynb`](./Aula%2027%20-%20%C3%81rvores%20de%20Decis%C3%A3o%20-%20ID3%20C4.5%20e%20CART%20-%20code.ipynb) | Concluída |
| **28** | Avaliação e Simulação Integrada do Módulo 3 | [`Aula 28 - Avaliacao e Simulacao Integrada do Modulo 3.md`](./Aula%2028%20-%20Avaliacao%20e%20Simulacao%20Integrada%20do%20Modulo%203.md) | [`Aula 28 - Avaliacao e Simulacao Integrada do Modulo 3 - code.ipynb`](./Aula%2028%20-%20Avaliacao%20e%20Simulacao%20Integrada%20do%20Modulo%203%20-%20code.ipynb) | Concluída |

## Simulador Web Integrado
- Interface editorial interativa com **10 modos** (`integrated`, `mst`, `huffman`, `binary`, `rrt`, `rstp`, `petri`, `bt`, `kdtree`, `dtree`) em `doc/etapa-03-arvores.html` + `doc/js/etapa-03-simulator.js`.
- Nota: o modo `petri` (Aula 24) exibe uma **prévia sincronizável** (cenário ilimitado com `ω` vs. limitado com `K_max = 3`), aguardando a integração final com o entregável do integrante responsável pela Aula 24.
