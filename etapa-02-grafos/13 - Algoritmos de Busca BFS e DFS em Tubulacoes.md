# Aula 13: Algoritmos de Busca (BFS e DFS) em Máquina Envasadora de Copos

## 1. Fundamentos Matemáticos: Travessia em Grafos

1. **Busca em Largura (BFS):** Utiliza fila FIFO. Encontra o caminho com o **menor número de etapas/processos** (\$O(|V| + |E|)\$).
2. **Busca em Profundidade (DFS):** Utiliza pilha/LIFO (recursão). Permite detectar ciclos e enumerar todas as sequências alternativas de operação.

---

## 2. Aprofundamento Teórico

### 2.1. Busca em Largura (BFS) — Definição Formal

O algoritmo BFS explora o grafo **por camadas**: a partir de um vértice origem \$s\$, visita primeiro todos os vértices a distância \$1\$ (número de etapas), depois a distância \$2\$, etc. Formalmente, seja \$d(s, v)\$ a distância mínima (em número de arestas) de \$s\$ até \$v\$. O BFS garante:

$$\text{Se } v \text{ é retirado da fila antes de } u, \text{ então } d(s, v) \leq d(s, u).$$

Esta propriedade assegura que **o primeiro caminho encontrado até um vértice é o mais curto em número de etapas**, o que na máquina envasadora corresponde ao caminho com menos válvulas/estações, reduzindo risco de falha.

**Complexidade:** \$O(|V| + |E|)\$ – cada vértice é enfileirado uma vez e cada aresta examinada uma única vez.

### 2.2. Busca em Profundidade (DFS) — Definição Formal

O DFS aprofunda-se ao máximo por um ramo antes de retroceder (*backtrack*). Cada aresta é classificada em:

| Tipo de aresta | Definição | Interpretação na máquina |
|---|---|---|
| **Árvore** | leva a um vértice ainda não visitado | fluxo principal de operação |
| **Retorno** | leva a um ancestral na árvore de busca | indica **ciclo** (ex.: recirculação de fluido) |
| **Avanço** | leva a um descendente já visitado | atalho para etapa já alcançada |
| **Cruzamento** | liga sub‑árvores distintas | transição entre linhas de produção |

A detecção de arestas de retorno prova que o grafo não é acíclico dirigido (DAG), relevante para garantir que não existam fluxos indesejados na linha de envase.

**Complexidade:** idem a BFS, \$O(|V| + |E|)\$.

---

## 3. Exemplo Resolvido

Considere a seguinte topologia simplificada da máquina envasadora:

- **Reservatório** → **Bomba** → **Válvula1** → **Envasadora** → **Estação_Inspeção** → **Empacotadora**
- Existe também um caminho alternativo **Válvula2** que pode contornar a **Envasadora** em caso de manutenção.

```python
# Construção do grafo (mesmo código do professor, porém com novos nós)
from collections import deque
from typing import List, Set, Optional

class GrafoEnvasadora:
    def __init__(self, vertices):
        self.vertices = vertices
        self.v_to_idx = {v: i for i, v in enumerate(vertices)}
        self.idx_to_v = {i: v for i, v in enumerate(vertices)}
        self.n = len(vertices)
        self.adj_binaria = [[0] * self.n for _ in range(self.n)]
        self.adj_pesos = [[float('inf')] * self.n for _ in range(self.n)]
        for i in range(self.n):
            self.adj_pesos[i][i] = 0.0
        self.arestas_detalhes = []

    def adicionar_transicao(self, origem, destino, tempo_s, tag_valvula):
        u = self.v_to_idx[origem]
        v = self.v_to_idx[destino]
        self.adj_binaria[u][v] = 1
        self.adj_pesos[u][v] = tempo_s
        self.arestas_detalhes.append({
            "Origem": origem,
            "Destino": destino,
            "Tempo (s)": tempo_s,
            "Válvula": tag_valvula,
        })

def criar_rede_envasadora():
    nos = ["Reservatorio", "Bomba", "V1", "V2", "Envasadora", "Estacao_Inspecao", "Empacotadora"]
    g = GrafoEnvasadora(nos)
    g.adicionar_transicao("Reservatorio", "Bomba", 5, "V-RES-B")
    g.adicionar_transicao("Bomba", "V1", 2, "V-B-1")
    g.adicionar_transicao("Bomba", "V2", 3, "V-B-2")
    g.adicionar_transicao("V1", "Envasadora", 4, "V-1-ENV")
    g.adicionar_transicao("V2", "Envasadora", 6, "V-2-ENV")
    g.adicionar_transicao("Envasadora", "Estacao_Inspecao", 3, "V-ENV-INS")
    g.adicionar_transicao("Estacao_Inspecao", "Empacotadora", 2, "V-INS-EMP")
    return g

class NavegadorGrafos:
    def __init__(self, grafo: GrafoEnvasadora):
        self.g = grafo

    def bfs_menor_numero_etapas(self, origem: str, destino: str, nos_bloqueados: Optional[Set[str]] = None) -> Optional[List[str]]:
        if nos_bloqueados is None:
            nos_bloqueados = set()
        if origem in nos_bloqueados or destino in nos_bloqueados:
            return None
        fila = deque([(origem, [origem])])
        visitados = {origem}
        while fila:
            u_nome, caminho = fila.popleft()
            if u_nome == destino:
                return caminho
            u_idx = self.g.v_to_idx[u_nome]
            for v_idx in range(self.g.n):
                v_nome = self.g.idx_to_v[v_idx]
                if self.g.adj_binaria[u_idx][v_idx] == 1 and v_nome not in visitados and v_nome not in nos_bloqueados:
                    visitados.add(v_nome)
                    fila.append((v_nome, caminho + [v_nome]))
        return None

    def dfs_todos_caminhos(self, origem: str, destino: str, nos_bloqueados: Optional[Set[str]] = None) -> List[List[str]]:
        if nos_bloqueados is None:
            nos_bloqueados = set()
        caminhos = []
        def dfs(u_nome: str, visitados: List[str]):
            if u_nome == destino:
                caminhos.append(list(visitados))
                return
            u_idx = self.g.v_to_idx[u_nome]
            for v_idx in range(self.g.n):
                v_nome = self.g.idx_to_v[v_idx]
                if self.g.adj_binaria[u_idx][v_idx] == 1 and v_nome not in visitados and v_nome not in nos_bloqueados:
                    visitados.append(v_nome)
                    dfs(v_nome, visitados)
                    visitados.pop()
        dfs(origem, [origem])
        return caminhos

# Demonstração
rede = criar_rede_envasadora()
nav = NavegadorGrafos(rede)
rota_bfs = nav.bfs_menor_numero_etapas("Reservatorio", "Empacotadora")
print("1. Rota mínima (BFS):", " -> ".join(rota_bfs))
rotas_dfs = nav.dfs_todos_caminhos("Reservatorio", "Empacotadora")
print("2. Total de rotas (DFS):", len(rotas_dfs))
for i, r in enumerate(rotas_dfs, 1):
    print(f"   Opção {i}: {' -> '.join(r)}")

# Simulação de falha na Válvula V1
rota_bloqueada = nav.bfs_menor_numero_etapas("Reservatorio", "Empacotadora", nos_bloqueados={"V1"})
print("3. Rota com V1 bloqueada:", " -> ".join(rota_bloqueada) if rota_bloqueada else "Nenhum caminho disponível")
``` 

---

## 4. Atividades de Investigação

1. Execute manualmente a BFS a partir de `Reservatorio` até `Empacotadora` e registre a camada (distância em etapas) de cada vértice.
2. Liste todas as rotas possíveis usando DFS e verifique se alguma inclui um ciclo (ex.: retorno a `Bomba`). Justifique por que o grafo da etapa é ou não um DAG.
3. Bloqueie simultaneamente `V1` e `V2` e execute a BFS. O algoritmo retorna `None`? Interprete o resultado para a operação da máquina.
4. Modifique a DFS para interromper a enumeração após encontrar 2 caminhos e compare o tempo teórico de execução.

---

## 5. Entregável da Aula 13

* **Motor de Busca Topológica em Python:** Implementação das classes `BFS_Router` e `DFS_PathFinder` com suporte a nós bloqueados, aplicado ao modelo da máquina envasadora de copos.
