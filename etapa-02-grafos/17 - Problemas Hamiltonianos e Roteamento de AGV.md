# Aula 17: Problemas Hamiltonianos e Roteamento Logístico de AGVs (TSP) na Máquina Envasadora de Copos

## 1. Fundamentos Matemáticos: Ciclos Hamiltonianos e o Caixeiro‑Viajante (TSP)

O **Problema do Caixeiro‑Viajante (TSP)** busca o ciclo hamiltoniano de menor custo que visita todos os vértices exatamente uma vez e retorna à base. Na nossa planta de envase de copos utilizamos esse modelo para definir a rota ótima de um **AGV (Veículo Guiado Automaticamente)** que deve coletar amostras em diferentes estações (por exemplo, controle de qualidade, medição de peso, inspeção visual) antes de retornar ao ponto de partida.

---

## 2. Aprofundamento Teórico

### 2.1. Ciclo Hamiltoniano vs. Circuito Euleriano — Contraste Fundamental

| Propriedade | Circuito Euleriano (Aula 16) | Ciclo Hamiltoniano (Aula 17) |
|---|---|---|
| O que visita | Cada **aresta** exatamente uma vez | Cada **vértice** exatamente uma vez |
| Vértices podem repetir? | Sim (desde que a aresta usada seja diferente) | Não, exceto o vértice inicial/final |
| Critério de existência | Verificável em $O(|V|+|E|)$ (Teorema de Euler) | **NP‑completo** – não há critério simples conhecido |
| Aplicação típica na planta | Robô de inspeção percorrendo toda a tubulação | AGV coletando amostras em pontos específicos, sem necessidade de percorrer todo o duto |

### 2.2. Por que o TSP é Computacionalmente Difícil

O TSP pertence à classe **NP‑difícil**; a versão de decisão "existe um ciclo hamiltoniano de custo $\le k$?" é **NP‑completa**. Uma busca exaustiva (força bruta) tem complexidade $O(n!)$ – para $n=6$ estações já são $5! = 120$ permutações, inviáveis para $n\ge20$.

A programação dinâmica de **Held‑Karp** melhora para $O(n^2\cdot2^n)$, ainda exponencial, mas viável até cerca de $n=20$‑25. Para plantas maiores recorre‑se a **heurísticas** (Nearest Neighbor, 2‑Opt, Christofides) que fornecem soluções boas em tempo polinomial.

### 2.3. Heurística do Vizinho Mais Próximo (Nearest Neighbor)

Constrói a rota gulosamente: a cada passo escolhe o próximo ponto ainda não visitado mais próximo ao ponto atual. Complexidade $O(n^2)$. A heurística pode ficar presa em decisões locais que geram um "salto longo" ao final da rota.

### 2.4. Refinamento por Busca Local 2‑Opt

A técnica **2‑Opt** troca duas arestas não adjacentes e reconecta o caminho invertendo o segmento entre elas, aceitando a troca se reduzir o custo total. Cada iteração custa $O(n^2)$; o número de iterações até convergência é tipicamente $O(n)$, resultando em $O(n^3)$ no pior caso.

A combinação **NN + 2‑Opt** costuma produzir rotas muito próximas da ótima, especialmente quando a matriz de distâncias satisfaz a desigualdade triangular (caso típico em planta com layout planar).

---

## 3. Exemplo Resolvido

Considere a rede simplificada da nossa linha de envase (estações “Lab”, “TK301”, “TK302”, “R101”, “TK303”, “GRAN201”). As distâncias abaixo são tempos de deslocamento (em segundos) entre as estações, obtidos a partir da simulação do layout.

```python
class RoteadorEnvasadora_TSP:
    def __init__(self, locais, matriz_dist):
        self.locais = locais
        self.dist = matriz_dist
        self.n = len(locais)

    def calcular_custo(self, rota):
        c = sum(self.dist[rota[i]][rota[i+1]] for i in range(self.n-1))
        c += self.dist[rota[-1]][rota[0]]  # volta ao ponto de partida
        return c

    def vizinho_mais_proximo(self, inicio=0):
        nao_vis = set(range(self.n))
        nao_vis.remove(inicio)
        rota = [inicio]
        atual = inicio
        while nao_vis:
            prox = min(nao_vis, key=lambda v: self.dist[atual][v])
            rota.append(prox)
            nao_vis.remove(prox)
            atual = prox
        return rota

    def otimizar_2opt(self, rota):
        melhor = list(rota)
        melhor_c = self.calcular_custo(melhor)
        melhorou = True
        while melhorou:
            melhorou = False
            for i in range(1, self.n-1):
                for j in range(i+1, self.n):
                    nova = melhor[:i] + melhor[i:j+1][::-1] + melhor[j+1:]
                    c = self.calcular_custo(nova)
                    if c < melhor_c:
                        melhor, melhor_c = nova, c
                        melhorou = True
                        break
                if melhorou:
                    break
        return melhor

locais = ["Lab", "TK301", "TK302", "R101", "TK303", "GRAN201"]
matriz = [
    [0, 45, 50, 80, 75, 110],
    [45, 0, 20, 55, 60, 95],
    [50, 20, 0, 45, 50, 85],
    [80, 55, 45, 0, 25, 40],
    [75, 60, 50, 25, 0, 35],
    [110, 95, 85, 40, 35, 0],
]

agv = RoteadorEnvasadora_TSP(locais, matriz)
ini = agv.vizinho_mais_proximo(0)
opt = agv.otimizar_2opt(ini)
print("Rota Inicial NN:", " -> ".join(locais[i] for i in ini), f"| Custo: {agv.calcular_custo(ini):.1f}s")
print("Rota Ótima 2‑Opt:", " -> ".join(locais[i] for i in opt), f"| Custo: {agv.calcular_custo(opt):.1f}s")
```

A saída típica é:
```
Rota Inicial NN: Lab -> TK301 -> TK302 -> R101 -> TK303 -> GRAN201 | Custo: 280.0s
Rota Ótima 2‑Opt: Lab -> TK301 -> TK302 -> R101 -> GRAN201 -> TK303 | Custo: 260.0s
```
A otimização 2‑Opt troca a ordem dos últimos dois nós, eliminando o salto longo de volta ao **Lab**.

---

## 4. Atividades de Investigação

1. **Força bruta**: Calcule o custo de todas as $5! = 120$ permutações (fixando “Lab” como início) e verifique se a solução 2‑Opt encontrada acima é a ótima global.
2. **Variação de ponto de partida**: Rode a heurística NN a partir de “TK303” e compare a rota inicial com a obtida a partir de “Lab”.
3. **Árvore Geradora Mínima (MST)**: Construa a MST da matriz de distâncias e compare seu custo total com o da rota ótima. Mostre que a MST fornece uma cota inferior válida.
4. **Pesquisa**: Consulte o algoritmo de **Christofides** e descreva brevemente como ele combina MST, emparelhamento mínimo e um ciclo euleriano para garantir uma solução com fator $1{,}5$ da ótima.

---

## 5. Entregável da Aula 17

* **Otimizador Logístico de AGV em Python** – implementação das funções `vizinho_mais_proximo` e `otimizar_2opt` (ou equivalentes) aplicadas ao modelo da máquina envasadora de copos.
