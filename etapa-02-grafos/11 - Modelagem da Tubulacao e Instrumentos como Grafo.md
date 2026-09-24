from typing import List, Dict, Any

class GrafoTubulacao:
    def __init__(self, vertices: List[str]):
        self.vertices = vertices
        self.v_to_idx = {v: i for i, v in enumerate(vertices)}
        self.idx_to_v = {i: v for i, v in enumerate(vertices)}
        self.n = len(vertices)
        
        # Matriz de adjacência binária (0 ou 1)
        self.adj_binaria = [[0] * self.n for _ in range(self.n)]
        
        # Matriz de pesos (distância em cm) inicializada com infinito
        self.adj_pesos = [[float('inf')] * self.n for _ in range(self.n)]
        for i in range(self.n):
            self.adj_pesos[i][i] = 0.0
        
        self.arestas_detalhes: List[Dict[str, Any]] = []

    def adicionar_conexao(self, origem: str, destino: str, distancia_cm: float, 
                           atuador: str, diametro_pol: float = 0.0):
        u = self.v_to_idx[origem]
        v = self.v_to_idx[destino]
        
        self.adj_binaria[u][v] = 1
        self.adj_pesos[u][v] = distancia_cm
        
        self.arestas_detalhes.append({
            "Origem": origem,
            "Destino": destino,
            "Distância (cm)": distancia_cm,
            "Atuador / Via": atuador,
            "Diâmetro (pol)": diametro_pol
        })

    def obter_graus(self) -> List[Dict[str, Any]]:
        graus = []
        for i, v in enumerate(self.vertices):
            deg_out = sum(self.adj_binaria[i])
            deg_in = sum(self.adj_binaria[r][i] for r in range(self.n))
            graus.append({
                "Equipamento / Nó": v, 
                "Grau Entrada (deg-)": deg_in, 
                "Grau Saída (deg+)": deg_out
            })
        return graus
