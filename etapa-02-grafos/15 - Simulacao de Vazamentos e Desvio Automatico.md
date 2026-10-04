# Aula 15: Simulação de Falhas e Desvio Automático em Malha Fechada

## 1. Fundamentos Matemáticos: Reconfiguração Dinâmica de Grafos em Tempo Real

Na detecção de um vazamento ou falha em um segmento de tubulação $(u, v)$ da Envasadora, o sistema SCADA executa a punição topológica $W(u, v) \leftarrow \infty$ e recalcula instantaneamente a rota via algoritmo de Dijkstra para comutação de válvulas.

---

## 2. Aprofundamento Teórico

### 2.1. Grafos Dinâmicos e o Conceito de Reponderação

Um **grafo dinâmico** é aquele cujo conjunto de arestas ou pesos varia ao longo do tempo, $G_t = (V, E_t, W_t)$, em contraste com o grafo estático estudado nas Aulas 11-14. A técnica de reponderação usada nesta aula — atribuir $W(u,v) \leftarrow \infty$ a um trecho isolado (ex: falha na Bomba A) — é a forma mais simples de modelar uma mudança topológica sem alterar a estrutura de dados subjacente. Ao invés de remover fisicamente a aresta da lista/matriz de adjacência, basta torná-la "infinitamente cara", o que garante que nenhum algoritmo de menor caminho jamais a selecione. Isso preserva o registro histórico de que aquela conexão existe fisicamente (apenas está indisponível).

### 2.2. Recomputar do Zero vs. Algoritmos Incrementais

A estratégia adotada no notebook — **recomputar Dijkstra do zero** a cada mudança de peso — é a mais simples e robusta, com custo $O((\vert{}V\vert{}+\vert{}E\vert{})\log\vert{}V\vert{})$ por recomputação. Isso é perfeitamente aceitável para o tamanho topológico da nossa Envasadora. Em redes de grande escala (centenas de milhares de vértices), essa abordagem se torna custosa. Nesses casos, usam-se estruturas de dados especializadas (árvores de menor caminho dinâmicas, *dynamic shortest path trees*) que atualizam apenas a porção do grafo afetada pela mudança.

### 2.3. Tempo de Decisão como Métrica de Engenharia

O notebook reporta o **tempo de decisão** (`Tempo_Decisão_ms`) do recálculo em milissegundos. Em um sistema de intertravamento de segurança (SIS), o tempo entre a detecção de uma falha e a ação corretiva compõe o **tempo de resposta do processo** (*process safety time*). Um algoritmo de Dijkstra que processa em frações de milissegundo é ordens de magnitude mais rápido que o tempo de atuação física de uma válvula motorizada ou cilindro pneumático (que leva segundos), confirmando que o **gargalo de segurança em contingências está na atuação mecânica, não no cálculo computacional**.

### 2.4. Conectividade, Pontes e Vértices de Articulação

Quais trechos da rede, se isolados, desconectariam completamente a Envasadora? Um trecho cuja remoção desconecta o grafo é chamado de **ponte** (*bridge*). Formalmente, uma aresta $(u,v)$ é uma ponte se e somente se ela não pertence a nenhum ciclo alternativo. Na nossa planta, o trecho `P-101_BombaA -> MAN-200_Agua` **não é uma ponte**, pois existe a rota alternativa via `P-102_BombaB`, o que justifica por que o recálculo encontra uma rota substituta. Porém, o trecho `DOS-201_Dosador -> BIC-202_Bico` é uma ponte sistêmica: se obstruído, não há dosador redundante.

### 2.5. Resiliência de Rede: k-Conectividade

Dizemos que um grafo é **$k$-aresta-conexo** se é necessário remover pelo menos $k$ arestas para desconectá-lo. A rede de pressurização da nossa planta, possuindo duas rotas independentes do reservatório para o manifold, é $2$-aresta-conexa nesse segmento — uma propriedade de projeto desejável que garante à máquina total tolerância a uma falha única.

---

## 3. Exemplo Resolvido

**Pergunta:** Se, além da linha da Bomba A (`P-101_BombaA -> MAN-200_Agua`), a linha de contingência da Bomba B (`P-102_BombaB -> MAN-200_Agua`) também sofresse falha simultânea, qual seria o resultado do recálculo?

**Resolução:** Ambas as arestas de entrada no manifold estariam com peso $\infty$, tornando o grau de entrada efetivo de `MAN-200_Agua` igual a zero. Como o algoritmo de Dijkstra nunca atravessa uma aresta de peso $\infty$, o cálculo terminaria com custo global $\infty$ e retornaria "sem rota" — evidenciando que, embora a máquina tolere uma falha isolada, ela **não possui resiliência estrutural a falhas mecânicas simultâneas nas duas bombas principais**.

---

## 4. Atividades de Investigação

1. Implemente uma função que teste, para cada aresta da Envasadora, se a sua remoção desconecta `TK-101_Agua` de `DOS-201_Dosador`. Quantas "pontes" existem ao longo deste trajeto?
2. Compare o tempo de decisão do Dijkstra extraído (em ms) com o tempo típico de comutação de uma válvula solenoide industrial (pesquise datasheets reais).
3. Proponha o traçado de uma terceira tubulação conectando a Bomba B diretamente ao Bico de Envase (ignorando o dosador). Como isso afetaria a k-conectividade teórica da máquina?

---

## 5. Entregável da Aula 15

* **Simulador de Desvio Automático:** Classe Python atualizada com injeção de falha programada e recálculo dinâmico via Dijkstra em tempo real.

```python
import time
import heapq
from typing import Dict, Any, Tuple, Optional, Set, List

class RoteadorDijkstra:
    def __init__(self, grafo):
        self.g = grafo

    def calcular_menor_caminho(self, origem: str, destino: str, 
                               bloqueios: Optional[Set[str]] = None) -> Tuple[float, List[str]]:
        if bloqueios is None: bloqueios = set()
        if origem in bloqueios or destino in bloqueios: return float('inf'), []
        dist = {v: float('inf') for v in self.g.vertices}
        pred = {v: None for v in self.g.vertices}
        dist[origem] = 0.0
        heap = [(0.0, origem)]
        
        while heap:
            d_u, u = heapq.heappop(heap)
            if d_u > dist[u]: continue
            if u == destino: break
            u_idx = self.g.v_to_idx[u]
            for v_idx in range(self.g.n):
                v = self.g.idx_to_v[v_idx]
                peso = self.g.adj_pesos[u_idx][v_idx]
                if peso < float('inf') and v not in bloqueios:
                    nova_d = d_u + peso
                    if nova_d < dist[v]:
                        dist[v] = nova_d
                        pred[v] = u
                        heapq.heappush(heap, (nova_d, v))
        caminho = []
        atual = destino
        while atual is not None:
            caminho.append(atual)
            atual = pred[atual]
        caminho.reverse()
        if caminho and caminho[0] == origem:
            return dist[destino], caminho
        return float('inf'), []

class SistemaDesvioAutomatico:
    def __init__(self, grafo):
        self.grafo = grafo
        self.roteador = RoteadorDijkstra(grafo)
        
    def tratar_evento_falha(self, origem_falha: str, destino_falha: str,
                            origem_fluxo: str, destino_fluxo: str) -> Dict[str, Any]:
        t0 = time.perf_counter()
        u = self.grafo.v_to_idx[origem_falha]
        v = self.grafo.v_to_idx[destino_falha]
        self.grafo.adj_pesos[u][v] = float('inf')
        self.grafo.adj_binaria[u][v] = 0
        
        novo_custo, nova_rota = self.roteador.calcular_menor_caminho(origem_fluxo, destino_fluxo)
        t_ms = (time.perf_counter() - t0) * 1000.0
        
        return {
            "Trecho_Isolado": f"{origem_falha} -> {destino_falha}",
            "Nova_Rota_Ativa": " -> ".join(nova_rota) if novo_custo < float('inf') else "FALHA SISTÊMICA (Sem Rota)",
            "Comprimento_Total_cm": f"{novo_custo:.1f}",
            "Tempo_Decisão_ms": f"{t_ms:.4f}"
        }
