# Proposta de Projeto — Smart Factory SCADA-Core

## 1. Visão geral

Desenvolver um **sistema supervisório inteligente para uma fábrica automatizada**, simulando uma planta industrial composta por células de produção, esteiras, máquinas, estações de inspeção, estoque, expedição e uma frota de AGVs (Automated Guided Vehicles).

O projeto será construído como uma aplicação de simulação com interface gráfica semelhante a um SCADA, na qual o usuário poderá acompanhar o estado da fábrica, comandar equipamentos, provocar falhas e observar o sistema reagir automaticamente.

A proposta foi pensada para utilizar de forma integrada os conceitos de **lógica formal, sistemas especialistas, teoria dos grafos, árvores, relações e máquinas de estados**, em vez de implementar cada conteúdo como um módulo isolado.

---

# 2. Conceito da fábrica

A fábrica será dividida em áreas funcionais:

```text
                    ┌────────────────────┐
                    │  RECEBIMENTO       │
                    │ Matéria-prima      │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ ESTOQUE DE         │
                    │ MATÉRIA-PRIMA      │
                    └─────────┬──────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
       ┌────────────────┐          ┌────────────────┐
       │ CÉLULA DE      │          │ CÉLULA DE      │
       │ PRODUÇÃO 1     │          │ PRODUÇÃO 2     │
       └───────┬────────┘          └───────┬────────┘
               │                           │
               └─────────────┬─────────────┘
                             ▼
                    ┌────────────────────┐
                    │ INSPEÇÃO DE        │
                    │ QUALIDADE           │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ EMBALAGEM           │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ ESTOQUE FINAL       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ EXPEDIÇÃO           │
                    └────────────────────┘
```

A movimentação de materiais entre as áreas será realizada por **AGVs**.

---

# 3. Rede de movimentação

O piso da fábrica será modelado como um **grafo ponderado e dirigido**.

Cada cruzamento ou ponto de operação será um vértice e cada trecho transitável será uma aresta.

Exemplo:

```text
        A ───── B ───── C
        │       │       │
        │       │       │
        D ───── E ───── F
        │       │       │
        │       │       │
        G ───── H ───── I
```

Cada aresta possuirá atributos:

- distância;
- tempo estimado de deslocamento;
- sentido permitido;
- capacidade;
- estado (`LIVRE`, `BLOQUEADA`, `MANUTENÇÃO`);
- custo adicional;
- possibilidade de utilização por determinado AGV.

O custo utilizado pelo algoritmo poderá ser parametrizado.

Por exemplo:

```text
custo = distância + penalidade_de_congestionamento + penalidade_de_prioridade
```

---

# 4. AGVs

A fábrica possuirá múltiplos AGVs, cada um com:

- posição atual;
- destino;
- velocidade;
- capacidade de carga;
- carga atual;
- bateria;
- estado;
- prioridade;
- rota atual;
- rota planejada;
- histórico de deslocamento.

Estados possíveis:

```text
IDLE
MOVING
LOADING
UNLOADING
CHARGING
WAITING
BLOCKED
ERROR
EMERGENCY
```

Cada AGV receberá tarefas automaticamente.

Exemplo:

```text
AGV-01
Origem: Estoque
Destino: Produção 1
Carga: 20 unidades
Prioridade: Alta
```

---

# 5. Roteamento inteligente

O sistema deverá utilizar **Dijkstra** para encontrar o menor caminho entre origem e destino.

Porém, o algoritmo não será executado apenas uma vez.

O sistema deverá permitir **roteamento dinâmico**.

Exemplo:

```text
Rota original:

A → B → E → H → I

      X
      B → E bloqueado
```

O sistema detecta a indisponibilidade e recalcula:

```text
A → B → C → F → I
```

A nova rota deverá ser enviada automaticamente ao AGV.

O usuário poderá bloquear manualmente qualquer trecho da fábrica para demonstrar o funcionamento.

---

# 6. Gerenciamento de conflitos entre AGVs

Para tornar o projeto mais realista, vários AGVs poderão utilizar a mesma rede simultaneamente.

O sistema deverá impedir conflitos como:

### Colisão

```text
AGV-01: A → B → C
AGV-02: D → B → E
             ↑
       mesmo ponto
```

### Conflito de trecho

Dois AGVs tentando ocupar simultaneamente a mesma aresta.

### Prioridade

Se dois AGVs solicitarem o mesmo trecho:

```text
AGV-01: prioridade 3
AGV-02: prioridade 1
```

o AGV-01 terá preferência.

O outro deverá:

- aguardar;
- escolher uma rota alternativa;
- ou ser replanejado.

---

# 7. Gestão de bateria

Cada AGV terá uma bateria simulada.

Exemplo:

```text
AGV-01
Bateria: 18%
Destino: Produção 2
```

O sistema deverá verificar se a bateria é suficiente para completar a tarefa.

Se não for:

```text
Tarefa
  ↓
Bateria insuficiente
  ↓
Calcular rota até carregador
  ↓
Carregar
  ↓
Retomar tarefa
```

Isso adiciona um segundo problema de otimização ao sistema.

---

# 8. Lógica de produção

As células de produção possuirão estados próprios.

Exemplo:

```text
IDLE
  ↓
WAITING_MATERIAL
  ↓
PROCESSING
  ↓
QUALITY_CHECK
  ↓
APPROVED / REJECTED
  ↓
TRANSFER
```

A produção não poderá ocorrer caso determinadas condições não sejam atendidas.

Exemplo:

```text
SE máquina disponível
E material disponível
E operador autorizado
E não houver emergência
ENTÃO permitir produção.
```

Essas regras serão implementadas pelo módulo de **lógica formal/intertravamentos**.

---

# 9. Sistema especialista para diagnóstico

O SCADA deverá possuir uma base de conhecimento capaz de diagnosticar falhas.

Exemplos:

```text
SE
motor ligado
E sensor de movimento desligado
ENTÃO
suspeita = falha no motor ou transmissão
```

```text
SE
AGV não se movimenta
E bateria > 20%
E rota disponível
ENTÃO
suspeita = falha de acionamento
```

```text
SE
sensor de presença ativo
E esteira desligada
E comando de partida ativo
ENTÃO
suspeita = falha na esteira
```

O sistema deverá informar:

- evento detectado;
- possíveis causas;
- causa mais provável;
- nível de confiança;
- ações recomendadas.

Será utilizado um mecanismo de **Forward Chaining** e/ou **Backward Chaining**.

---

# 10. Simulação de falhas

O projeto deverá possuir um painel para o usuário provocar falhas.

Exemplos:

- bloquear trecho da rede;
- desligar esteira;
- falhar sensor;
- falhar motor;
- reduzir bateria do AGV;
- bloquear estação;
- parar máquina;
- gerar emergência;
- gerar sensor incoerente;
- ocupar uma região da fábrica.

Exemplo de interação:

```text
[ SIMULAR FALHA ]

( ) Falha Motor M01
( ) Falha Sensor S03
( ) Bloquear Trecho B-E
( ) Falha AGV-02
( ) Baixa bateria AGV-01
( ) Parada de emergência
```

Isso será importante para demonstrar os algoritmos durante a apresentação.

---

# 11. Gerenciamento inteligente de alarmes

O sistema deverá possuir uma hierarquia de alarmes.

Exemplo:

```text
FALHA MOTOR M01
│
├── Esteira parada
│
├── Material não transportado
│
├── Produção interrompida
│
└── AGV aguardando
```

Em vez de gerar cinco alarmes independentes, o SCADA deverá identificar a causa raiz e apresentar prioritariamente:

```text
CRÍTICO
Falha no motor M01

3 alarmes secundários suprimidos.
```

Isso será implementado utilizando **árvores de dependência e árvores de decisão**.

---

# 12. Alarmes por severidade

Os alarmes serão classificados como:

```text
INFO
WARNING
CRITICAL
EMERGENCY
```

Cada alarme deverá possuir:

- timestamp;
- equipamento;
- categoria;
- severidade;
- descrição;
- causa provável;
- status;
- confirmação do operador;
- causa raiz;
- alarmes secundários associados.

Também deverá existir histórico de alarmes.

---

# 13. Máquina de estados global da fábrica

A fábrica terá uma máquina de estados principal:

```text
                ┌──────────────┐
                │    OFF       │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  STARTING    │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │    READY     │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  RUNNING     │
                └──────┬───────┘
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
        ┌──────────┐        ┌───────────┐
        │ WARNING  │        │ EMERGENCY │
        └────┬─────┘        └─────┬─────┘
             │                    ↓
             │               ┌──────────┐
             └──────────────→│  STOP    │
                             └──────────┘
```

A transição entre estados deverá depender de condições lógicas.

---

# 14. Parada de emergência

Uma parada de emergência deverá:

1. interromper a produção;
2. parar os AGVs;
3. bloquear novos comandos;
4. colocar máquinas em estado seguro;
5. gerar alarme crítico;
6. registrar o evento;
7. exigir ação autorizada para reset.

O reset não poderá ser realizado por qualquer usuário.

---

# 15. Sistema de usuários e permissões

Haverá diferentes níveis de acesso:

```text
Visitante
   ↓
Operador
   ↓
Supervisor
   ↓
Engenheiro
   ↓
Administrador
```

Será utilizada uma relação de ordem parcial para representar permissões.

Exemplo:

| Ação | Operador | Supervisor | Engenheiro | Administrador |
|---|---:|---:|---:|---:|
| Visualizar planta | ✓ | ✓ | ✓ | ✓ |
| Confirmar alarme | ✓ | ✓ | ✓ | ✓ |
| Comandar AGV | ✓ | ✓ | ✓ | ✓ |
| Bloquear trecho | ✗ | ✓ | ✓ | ✓ |
| Alterar parâmetros | ✗ | ✗ | ✓ | ✓ |
| Reset de emergência | ✗ | ✓ | ✓ | ✓ |
| Alterar permissões | ✗ | ✗ | ✗ | ✓ |

---

# 16. Árvore de ativos

Os equipamentos serão organizados hierarquicamente:

```text
Fábrica
│
├── Recebimento
│   ├── Esteira E01
│   └── Sensor S01
│
├── Produção
│   ├── Célula 01
│   │   ├── Motor M01
│   │   ├── Sensor S02
│   │   └── Esteira E02
│   │
│   └── Célula 02
│
├── Inspeção
│
├── Embalagem
│
├── Estoque
│
└── Expedição
```

Tags poderão ser armazenadas em uma **árvore binária de busca**, permitindo consultas eficientes.

Exemplo:

```text
Buscar: MOTOR_CELULA_02_03
```

---

# 17. Planejamento de inspeção

Além dos AGVs de transporte, poderá existir um **AGV de inspeção**.

Esse AGV deverá visitar determinados pontos da fábrica.

Serão utilizados conceitos de:

- caminho Euleriano;
- caminho Hamiltoniano;
- problema do caixeiro viajante;
- menor caminho.

O sistema deverá comparar estratégias de rota.

Exemplo:

```text
Pontos de inspeção:

A → C → D → F → H → J
```

O sistema calcula uma rota eficiente e apresenta:

- distância total;
- tempo estimado;
- quantidade de pontos;
- custo da rota.

---

# 18. Interface SCADA

A aplicação deverá possuir uma interface gráfica central.

Tela principal:

```text
┌───────────────────────────────────────────────────────┐
│ SMART FACTORY SCADA                    RUNNING        │
├───────────────────────────────────────────────────────┤
│                                                       │
│  RECEB.      PRODUÇÃO       INSPEÇÃO       EXPEDIÇÃO │
│    │             │             │               │      │
│    └─────────────┴─────────────┴───────────────┘      │
│                                                       │
│             MAPA DA FÁBRICA                           │
│                                                       │
│        ● AGV-01 → → →                                 │
│                   ● AGV-02                            │
│                                                       │
├───────────────────────┬───────────────────────────────┤
│ ALARMES               │ INFORMAÇÕES                   │
│                       │                               │
│ CRITICAL M01          │ AGV-01  72%                  │
│ WARNING S03           │ AGV-02  41%                  │
│                       │ Produção: 84%                 │
├───────────────────────┴───────────────────────────────┤
│ [PRODUÇÃO] [AGVs] [ALARMES] [GRAFOS] [TAGS] [USUÁRIO]│
└───────────────────────────────────────────────────────┘
```

A interface deverá permitir:

- visualizar equipamentos;
- visualizar estados;
- acompanhar AGVs;
- visualizar rotas;
- bloquear trechos;
- gerar falhas;
- confirmar alarmes;
- consultar tags;
- visualizar histórico;
- alterar parâmetros autorizados;
- acompanhar produção.

---

# 19. Simulação em tempo real

A fábrica não deverá ser apenas uma imagem estática.

Os equipamentos possuirão estados internos e deverão evoluir com o tempo.

Exemplo:

```text
Ordem de produção
       ↓
AGV recebe tarefa
       ↓
AGV calcula rota
       ↓
AGV desloca-se
       ↓
Chega à estação
       ↓
Carrega material
       ↓
Retorna
       ↓
Produção inicia
       ↓
Processamento
       ↓
Inspeção
       ↓
Produto aprovado
       ↓
AGV transporta produto
```

Toda essa sequência deverá ser visível na interface.

---

# 20. Indicadores de desempenho

O SCADA deverá apresentar KPIs básicos:

- produção total;
- produção aprovada;
- produtos rejeitados;
- tempo médio de produção;
- tempo médio de transporte;
- utilização das máquinas;
- utilização dos AGVs;
- distância percorrida pelos AGVs;
- número de falhas;
- MTBF simplificado;
- tempo de indisponibilidade;
- quantidade de alarmes;
- alarmes suprimidos;
- eficiência da fábrica.

---

# 21. Cenários de demonstração

O sistema deverá possuir cenários preparados para a apresentação.

## Cenário 1 — Operação normal

Todos os equipamentos funcionando.

Demonstrar:

- produção;
- AGVs;
- rotas;
- estados;
- indicadores.

## Cenário 2 — Bloqueio de rota

Bloquear um trecho.

Esperado:

```text
Falha
 ↓
Trecho indisponível
 ↓
Dijkstra
 ↓
Nova rota
 ↓
AGV continua operação
```

## Cenário 3 — Falha de equipamento

Provocar falha em uma máquina.

Esperado:

```text
Falha
 ↓
Sistema especialista
 ↓
Diagnóstico
 ↓
Alarme raiz
 ↓
Supressão dos alarmes secundários
```

## Cenário 4 — Emergência

Ativar parada de emergência.

Esperado:

```text
EMERGENCY
 ↓
Parar AGVs
 ↓
Parar produção
 ↓
Bloquear comandos
 ↓
Gerar alarme crítico
```

## Cenário 5 — Bateria baixa

AGV fica com bateria insuficiente.

Esperado:

```text
Bateria baixa
 ↓
Interromper tarefa
 ↓
Calcular rota para carregador
 ↓
Carregar
 ↓
Retomar tarefa
```

## Cenário 6 — Múltiplos AGVs

Vários AGVs disputam trechos.

Esperado:

```text
Conflito
 ↓
Sistema verifica prioridade
 ↓
Reserva de trecho
 ↓
AGV prioritário passa
 ↓
Segundo AGV aguarda/recalcula
```

---

# 22. Arquitetura sugerida

A aplicação deverá ser modular.

```text
smart-factory/
│
├── app/
│   ├── main
│   │
│   ├── core/
│   │   ├── state_machine
│   │   ├── simulation
│   │   └── event_bus
│   │
│   ├── logic/
│   │   ├── propositions
│   │   ├── interlocks
│   │   └── inference_engine
│   │
│   ├── graph/
│   │   ├── graph
│   │   ├── dijkstra
│   │   ├── bfs
│   │   ├── dfs
│   │   └── routing_manager
│   │
│   ├── agv/
│   │   ├── agv
│   │   ├── fleet_manager
│   │   ├── collision_manager
│   │   └── battery_manager
│   │
│   ├── trees/
│   │   ├── bst
│   │   ├── asset_tree
│   │   ├── alarm_tree
│   │   └── decision_tree
│   │
│   ├── relations/
│   │   ├── permissions
│   │   ├── users
│   │   └── state_relations
│   │
│   ├── production/
│   │   ├── machine
│   │   ├── production_line
│   │   └── orders
│   │
│   ├── alarms/
│   │   ├── alarm_manager
│   │   ├── root_cause
│   │   └── suppression
│   │
│   ├── simulation/
│   │   ├── sensors
│   │   ├── actuators
│   │   ├── faults
│   │   └── clock
│   │
│   └── ui/
│       ├── main_window
│       ├── factory_view
│       ├── agv_view
│       ├── alarm_view
│       └── diagnostics_view
│
├── tests/
├── docs/
├── README.md
└── requirements.txt
```

---

# 23. Tecnologias sugeridas

A implementação poderá ser feita em:

- Python;
- PySide6 ou PyQt para interface;
- estruturas de dados implementadas pelo próprio grupo;
- Git/GitHub para controle de versão;
- testes automatizados com pytest.

Bibliotecas externas deverão ser utilizadas principalmente para interface e infraestrutura. Os algoritmos estudados na disciplina deverão ser implementados pelo grupo, especialmente:

- BFS;
- DFS;
- Dijkstra;
- BST;
- percursos de árvores;
- lógica proposicional;
- motor de inferência;
- relações;
- máquina de estados.

---

# 24. Integração com o conteúdo da disciplina

| Conteúdo | Aplicação |
|---|---|
| Lógica proposicional | Intertravamentos |
| Lógica de predicados | Regras globais de diagnóstico |
| Tautologias | Validação de condições de segurança |
| Sistemas especialistas | Diagnóstico de falhas |
| Forward/Backward Chaining | Motor de inferência |
| Grafos | Mapa da fábrica |
| Matriz de adjacência | Rede de transporte |
| Matriz de incidência | Relação entre trechos/equipamentos |
| BFS/DFS | Busca na rede |
| Dijkstra | Roteamento dos AGVs |
| Euleriano | Inspeção de infraestrutura |
| Hamiltoniano | Rota de visita aos pontos |
| BST | Banco de Tags |
| Árvores | Hierarquia da fábrica |
| Árvores de decisão | Diagnóstico/Trip |
| Relações | Permissões |
| Ordem parcial | Hierarquia de usuários |
| Grafcet/SFC | Sequenciamento da produção |
| Git/GitHub | Desenvolvimento colaborativo |

---

# 25. Objetivo final

O objetivo é entregar um **mini sistema supervisório de uma Smart Factory**, capaz de:

1. simular uma fábrica automatizada;
2. controlar virtualmente os equipamentos;
3. transportar materiais utilizando AGVs;
4. calcular e recalcular rotas;
5. detectar conflitos de movimentação;
6. diagnosticar falhas;
7. gerenciar alarmes;
8. identificar causas raiz;
9. executar intertravamentos;
10. controlar permissões;
11. executar sequências de produção;
12. registrar eventos;
13. apresentar indicadores;
14. permitir testes de falhas em tempo real.

A característica principal do projeto será a **integração entre os algoritmos matemáticos e o comportamento da fábrica**.

O sistema não deve apenas "mostrar" que Dijkstra ou uma árvore funciona. Esses algoritmos deverão ser necessários para que a fábrica continue operando.

---

# 26. Exemplo de demonstração final

Uma demonstração completa poderá seguir esta sequência:

```text
1. Fábrica inicia em OFF
        ↓
2. Operador autorizado realiza START
        ↓
3. Máquina de estados leva a fábrica para READY
        ↓
4. Ordem de produção é criada
        ↓
5. AGV recebe a tarefa
        ↓
6. Dijkstra calcula a rota
        ↓
7. AGV inicia deslocamento
        ↓
8. Professor bloqueia um trecho da fábrica
        ↓
9. Sistema detecta indisponibilidade
        ↓
10. Rota é recalculada
        ↓
11. AGV continua
        ↓
12. Máquina de produção apresenta falha
        ↓
13. Sistema especialista analisa os sintomas
        ↓
14. Causa raiz é identificada
        ↓
15. Alarmes secundários são suprimidos
        ↓
16. Intertravamento impede operação insegura
        ↓
17. Supervisor recebe permissão para intervenção
        ↓
18. Falha é corrigida
        ↓
19. Produção é retomada
        ↓
20. Produto final é enviado à expedição
```

Esse fluxo demonstra, em uma única operação, a integração de **lógica + sistemas especialistas + grafos + árvores + relações + máquina de estados + SCADA + simulação**.
