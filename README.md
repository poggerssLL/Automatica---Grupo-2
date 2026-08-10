# SCADA-Core Automática — Grupo 2

Repositório do projeto da disciplina **ECAA08 - Automática (2026.2)**.

## Objetivo do Projeto
Desenvolver um motor computacional de supervisão, controle e diagnóstico para uma planta automatizada, aplicando lógica formal, grafos, árvores e relações para resolver problemas reais de supervisão industrial. A aplicação será uma simulação com interface gráfica tipo SCADA que permita acompanhar e comandar a fábrica, provocar falhas e observar respostas automáticas e humanas.

> Mais detalhes da proposta: `docs/proposta_smart_factory_scada_core.md` (versão completa no repositório).

## Visão geral (resumo da proposta)
- Planta dividida em áreas funcionais: Recebimento, Estoque, Células de Produção, Inspeção, Embalagem, Estoque Final e Expedição.
- Movimentação de materiais por AGVs sobre um mapa modelado como grafo ponderado e dirigido.
- Integração entre: lógica formal/intertravamentos, sistema especialista (diagnóstico), teoria dos grafos (roteamento), árvores (hierarquia de ativos e supressão de alarmes), relações/permissões e máquinas de estados.

## Principais funcionalidades planejadas
- Modelagem da planta como grafo (vértices = pontos/cruzamentos, arestas = trechos transitáveis) com atributos: distância, tempo, sentido, capacidade, estado (LIVRE/BLOQUEADA/MANUTENÇÃO), custo e compatibilidade por AGV.
- AGVs com estado, posição, rota planejada, prioridade, bateria e gerenciamento de carga.
- Roteamento dinâmico com Dijkstra e replanejamento automático quando trechos ficam indisponíveis.
- Gerenciamento de conflitos entre AGVs (evitar colisões, reservar trechos, políticas por prioridade).
- Gestão de bateria: cálculo de capacidade para concluir tarefas, ida ao carregador e retomada de tarefas.
- Lógica de produção com intertravamentos (regras booleanas/proposicionais) e máquina de estados para cada célula.
- Sistema especialista para diagnóstico (Forward / Backward Chaining), sugerindo causas prováveis, nível de confiança e ações recomendadas.
- Simulação de falhas via painel (bloqueio de trechos, falha em sensores/atuadores, redução de bateria, emergência, etc.).
- Gerenciamento inteligente de alarmes: árvore de dependência, supressão de alarmes secundários e identificação de causa raiz.
- Interface SCADA com mapa interativo, lista de alarmes, informações de AGVs e KPIs em tempo real.

## Cenários de demonstração planejados
1. Operação normal.
2. Bloqueio de rota e replanejamento de AGV.
3. Falha de equipamento com diagnóstico e supressão de alarmes.
4. Parada de emergência (stop total, travamento de comandos, reset autorizado).
5. Bateria baixa: AGV vai carregar e retoma tarefa.
6. Múltiplos AGVs disputando trechos — resolução por prioridade/espera/replanejamento.

## Arquitetura sugerida (resumo)
smart-factory/

- app/
  - core/: state_machine, simulation, event_bus
  - logic/: propositions, interlocks, inference_engine
  - graph/: graph, dijkstra, routing_manager
  - agv/: agv, fleet_manager, collision_manager, battery_manager
  - trees/: asset_tree, alarm_tree, decision_tree
  - relations/: permissions, users
  - production/: machine, production_line, orders
  - alarms/: alarm_manager, root_cause, suppression
  - ui/: main_window, factory_view, diagnostics_view
- tests/
- docs/
- requirements.txt

## Tecnologias sugeridas
- Linguagem: Python
- UI: PySide6 / PyQt
- Testes: pytest
- Controle de versão: Git / GitHub

## Indicadores (KPIs) previstos
- Produção total, aprovada e rejeitada
- Tempo médio de produção e transporte
- Utilização máquinas e AGVs
- Distância percorrida por AGVs
- Número de falhas, MTBF simplificado
- Tempo de indisponibilidade, alarmes suprimidos

## Avaliação de viabilidade (resumo)
- Complexidade técnica: Moderada a alta — o projeto integra diversos tópicos (algoritmos, lógica, UI, simulação em tempo real). Requer domínio de estruturas de dados, algoritmos de grafos, lógica proposicional e engenharia de software modular.
- Cronograma: Viável como trabalho de semestre com escopo incremental. Recomenda-se dividir em etapas entregáveis (já presentes nas pastas `etapa-*`) e priorizar núcleo mínimo: grafo + AGV básico + UI mínima para visualização e controle. Depois adicionar intertravamentos, especialista e alarmes.
- Recursos: Um grupo de 4–6 alunos com experiência intermediária em Python e alguma familiaridade com interfaces gráficas e algoritmos pode entregar um protótipo funcional em 12–16 semanas (entregas por etapas). Mais tempo será necessário para polimento, testes e cenários avançados.
- Riscos e mitigação:
  - Risco: Gestão concorrente de AGVs e simulação em tempo real — Mitigação: começar com passo de tempo discreto e simulação centralizada (event loop) antes de otimizações concorrentes.
  - Risco: Escopo grande — Mitigação: priorizar MVP (grafo + roteamento + 1 AGV + UI) e iterar.
  - Risco: Falta de experiência com UI — Mitigação: usar bibliotecas consolidadas (PySide6) e dividir responsabilidades (um membro foca UI).

## Próximos passos recomendados
1. Validar requisitos e priorizar funcionalidades para o MVP.
2. Definir cronograma com milestones (correspondente às `etapa-*`).
3. Implementar modelos de dados (grafo, AGV, assets, alarmes) e testes unitários iniciais.
4. Implementar UI básica que mostre o mapa e permita enviar tarefas e bloquear trechos.
5. Iterar sobre funcionalidades avançadas (sistema especialista, supressão de alarmes, gerenciamento de bateria).

## Referências no repositório
- Proposta completa: `docs/proposta_smart_factory_scada_core.md`
- Etapas: `etapa-01-logica/`, `etapa-02-grafos/`, `etapa-03-arvores/`, `etapa-04-relacoes/`

---

*README atualizado automaticamente: incluí um resumo da proposta, avaliação de viabilidade e próximos passos.*
