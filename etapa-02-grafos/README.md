# Etapa 02 — Teoria dos Grafos e Roteamento

## Contexto e escopo

Esta etapa reúne modelos didáticos de Teoria dos Grafos aplicados ao contexto de uma envasadora pneumática de copos. O processo de referência possui cinco estações: **E1** dispensa de copos, **E2** envase, **E3** posicionamento de tampa, **E4** selagem e **E5** ejeção.

Os grafos, custos, tempos, capacidades e cenários de falha apresentados nas aulas servem ao estudo dos algoritmos. Eles não formam uma planta integrada validada e não comprovam hardware, SCADA, automação, segurança ou disponibilidade industrial.

## Índice das aulas

| Aula | Assunto e resultado resumido | Material |
| --- | --- | --- |
| 11 | Modelagem de tubulação e instrumentos como dígrafo ponderado; introduz vértices, conexões, graus, matriz de pesos e uma topologia proposta. | [Roteiro](11%20-%20Modelagem%20da%20Tubulacao%20e%20Instrumentos%20como%20Grafo.md) · [Notebook](11%20-%20Modelagem%20da%20Tubulacao%20e%20Instrumentos%20como%20Grafo.ipynb) |
| 12 | Rede pneumática: matrizes de incidência, adjacência e custos, além de Floyd-Warshall, balanços e um resíduo de vazamento simulado. | [Roteiro](12%20-%20Matrizes%20de%20Incidencia%20Adjacencia%20e%20Custos.md) · [Notebook](12_Matrizes_de_Incidencia_Adjacencia_e_Custos.ipynb) |
| 13 | Busca no grafo simplificado: BFS para menor número de arestas e DFS para enumerar caminhos simples, incluindo cenário com V1 bloqueada. | [Roteiro](13%20-%20Algoritmos%20de%20Busca%20BFS%20e%20DFS%20em%20Tubulacoes.md) · [Notebook](13_Algoritmos_de_Busca_BFS_e_DFS_em_Tubulacoes.ipynb) |
| 14 | Menor caminho com Dijkstra e reponderação: compara rota nominal, desvio e ausência de rota em bloqueio duplo no modelo da aula. | [Roteiro](14%20-%20Menor%20Caminho%20Dijkstra%20e%20Roteamento%20Dinamico.md) · [Notebook](14%20-%20Menor%20Caminho%20Dijkstra%20e%20Roteamento%20Dinamico.ipynb) |
| 15 | Simulação manual de falha em uma conexão e recálculo de rota, com cenário didático e medição local de tempo. | [Roteiro](15%20-%20Simulacao%20de%20Vazamentos%20e%20Desvio%20Automatico.md) · [Notebook](15%20-%20Simulacao%20de%20Vazamentos%20e%20Desvio%20Automatico.ipynb) |
| 16 | Inspeção de infraestrutura: ronda e caça a vazamentos em grafos não dirigidos com Hierholzer e Carteiro Chinês; inclui também o circuito CIP dirigido. | [Roteiro](16%20-%20Problemas%20Eulerianos%20e%20Inspecao%20de%20Infraestrutura.md) · [Notebook](16_Problemas_Eulerianos_e_Inspecao_de_Infraestrutura.ipynb) |
| 17 | Problemas hamiltonianos e PCV/TSP em matriz ilustrativa, com heurística do Vizinho Mais Próximo e refinamento 2-Opt. | [Roteiro](17%20-%20Problemas%20Hamiltonianos%20e%20Roteamento%20de%20AGV.md) · [Notebook](17_Problemas_Hamiltonianos_e_Roteamento_de_AGV.ipynb) |
| 18 | Logística de materiais e veículos em modelos separados: DAG para precedências, Kahn para sequência e caminhos sob bloqueios/quarentena. | [Roteiro](18%20-%20Grafos%20de%20Logistica%20de%20Insumos%20e%20Produtos%20Acabados.md) · [Notebook](18%20-%20Grafos%20de%20Logistica%20de%20Insumos%20e%20Produtos%20Acabados.ipynb) |

A presença dos arquivos é um inventário do conteúdo versionado; não representa aprovação docente.

## Relação entre os modelos

As aulas 11, 14 e 15 compartilham a ideia de rede dirigida para modelagem, menor caminho e reconfiguração de rota. As aulas 12 e 16 exploram a rede pneumática sob representações e objetivos distintos; na Aula 16, a caça a vazamentos é não dirigida para visita dos trechos, enquanto o circuito CIP é um dígrafo separado.

A aula 13 usa um grafo simplificado próprio, portanto seus resultados de busca não devem ser generalizados aos demais modelos. A aula 17 usa uma matriz ilustrativa de PCV/TSP, sem demonstrar rota ótima global nem AGV implantado. A aula 18 separa explicitamente o grafo de materiais do grafo de veículos; conectividade de rota não substitui a verificação conjunta de insumos e permissivos.

## Orientação de estudo

| Se o objetivo é estudar... | Comece por |
| --- | --- |
| Conceitos de dígrafos e representação de processo | Aula 11 |
| Matrizes, custos e caminhos entre pontos da rede | Aula 12 |
| Estratégias de travessia por largura e profundidade | Aula 13 |
| Menor caminho e alteração de pesos/bloqueios | Aulas 14 e 15 |
| Cobertura de trechos para inspeção | Aula 16 |
| Visita a pontos logísticos e heurísticas de rota | Aula 17 |
| Precedências de materiais e circulação interna | Aula 18 |

Leia cada roteiro como a fonte conceitual da aula e use o notebook como material executável correspondente. Os nomes, as estruturas e os parâmetros pertencem ao cenário de cada atividade, mesmo quando há assunto semelhante entre elas.

## Como executar os notebooks

1. Abra o notebook correspondente no Jupyter ou Google Colab.
2. Selecione um kernel **Python 3.10+** e execute as células na ordem apresentada.
3. Os imports observados pertencem somente à biblioteca padrão do Python; não há dependência externa declarada nesta etapa.
4. Não execute com `python -O`: os notebooks usam `assert` como parte das verificações didáticas.

Saídas já gravadas em notebooks podem ser de execução anterior e não comprovam que os testes foram executados nesta rodada. Para reprodução, execute as células e interprete os resultados dentro dos limites de cada roteiro.

## Limites de leitura

- BFS encontra o menor número de arestas no modelo, não o menor tempo nem uma garantia de segurança; a enumeração de caminhos simples por DFS pode crescer exponencialmente.
- O desvio da aula 15 é uma injeção manual de falha e um recálculo local, não teste de estresse ou mecanismo automático industrial.
- As heurísticas da aula 17 são candidatas de rota, sem prova de ótimo global; os rótulos do exemplo não constituem layout físico medido.
- Custos, velocidades e demais parâmetros dos exemplos são hipotéticos e devem ser lidos como dados de modelagem didática.
